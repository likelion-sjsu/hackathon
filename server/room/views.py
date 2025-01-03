import json
import os
from rest_framework.response import Response
from rest_framework import status
from .models import Room
from rest_framework.views import APIView
from .serializers import RoomSerializer
from openai import OpenAI
from decouple import config
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')

get_recommendations = {
    "name": "get_recommendations",
    "description": "A function that generates personalized recommendations based on the user's preferences and category. The function returns a list of suitable recommendations.",
    "parameters": {
        "type": "object",
        "properties": {
            "recommendations": {
                "type": "array",
                "items": {"type": "string"},
            }
        }
    }
}

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.5,
    streaming=True,
    openai_api_key=openai_api_key
).bind(
    function_call={"name": "get_recommendations"},
    functions=[get_recommendations]
)

template = ChatPromptTemplate.from_messages([
    ("system",
        """
        You are a personalized recommendation system specializing in {category}. Based on the user's preferences, provide 5 tailored recommendations.

        User Preferences:
        {preferences}

        Your task:
        - Take the provided preferences into account.
        - Provide 5 distinct, diverse, and recognizable food recommendations that fit the user's preferences in the {category}.
        - The recommendations should be food names that are commonly searched for and easily recognizable, without any additional descriptions or modifiers like "with" or "and".

        Example Recommendations for food category:
        - General Tso's Chicken, Orange Chicken, Kung Pao Chicken, Sweet and Sour Pork, Dim Sum

        Recommendation:
        Please suggest 5 suitable {category} options that match the user's preferences.
        """)
])


def format_prefs(preferences):
    formatted = ""
    for pref in preferences:
        for key, value in pref.items():
            if isinstance(value, list):
                formatted += f"- {key}: {', '.join(value)}\n"
            else:
                formatted += f"- {key}: {value}\n"
    return formatted


chain = template | llm


class RoomListAPI(APIView):
    def get(self, request):
        queryset = Room.objects.all()
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        category = request.data['category']
        max_count = request.data['max_count']
        instance = Room()
        code = instance.generate_short_identifier()

        data = {
            'code': code,
            'category': category,
            'max_count': max_count
        }

        if category not in ['food', 'hangout', 'travel']:
            return Response({'detail': "category not allowed"}, status=status.HTTP_404_NOT_FOUND)

        # Deserialize the request data using RoomSerializer
        room_serializer = RoomSerializer(data=data)

        # Check if the serialized data is valid
        if room_serializer.is_valid():
            # Save the room to the database
            room_serializer.save()

            # Return the serialized data of the created room in the response
            return Response(room_serializer.data, status=status.HTTP_201_CREATED)

        # If the serialized data is not valid, return error response
        return Response(room_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomAPI(APIView):
    def get(self, request, code):
        try:
            room = Room.objects.get(code=code)
            serializer = RoomSerializer(room)
            return Response(serializer.data)
        except:
            return Response({"message": "room not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, code):
        try:
            room = Room.objects.get(code=code)
            # if room.end == True:
            #     return Response({"message": "room already terminated"},status=status.HTTP_400_BAD_REQUEST)
            room.end = True
            room.save()
            serializer = RoomSerializer(room)
            return Response(serializer.data)
        except:
            return Response({"message": "room not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, code):
        try:
            query = Room.objects.get(code=code)
        except Room.DoesNotExist:
            return Response({'error': {'message': "team not found!"}}, status=status.HTTP_404_NOT_FOUND)

        result = Room.objects.get(code=code)
        result.delete()
        return Response({"message": "successfully deleted!"}, status=204)


class GroupAPI(APIView):
    def get(self, request, code):
        try:
            room = Room.objects.get(code=code)
        except Room.DoesNotExist:
            return Response({'error': {'message': "room not found!"}}, status=status.HTTP_404_NOT_FOUND)

        category = room.category

        if category == 'food':
            content = "Each one of us prefers the following food. "
            spiciness_list = ["no spicy", "mild spicy", "moderately spicy",
                              "very spicy", "extremely spicy", "whatever"]
            price_list = ["$0-$10", "$10-$25",
                          "$25-$50", "$50 and up", "whatever"]
            spiciness = "whatever"
            price = "whatever"
            for i, data in enumerate(room.results):
                cuisine = data['cuisine']
                type = data['type']
                temperature = data['temperature']
                special_offer = data['special_offer']
                content += f"{i+1}. {temperature} {cuisine} food"
                if type != "":
                    content += f" including {type}"
                if special_offer != "":
                    content += f". {special_offer}"
                spiciness = spiciness_list[min(spiciness_list.index(
                    spiciness), spiciness_list.index(data['spiciness']))]
                price = price_list[min(price_list.index(
                    price), price_list.index(data['price']))]
            content += f". Spiciness : {spiciness}, price range: {price}."
            content += " Recommend one food that can mostly fulfil our preferences. Respond just the word of food."

        elif category == 'hangout':
            content = "Each one of us prefers the following requirements for hangout. "
            for i, data in enumerate(room.results):
                time = data['time']
                size = data['size']
                place = data['place']
                mood = data['mood']
                special_offer = data['special_offer']
                content += f"{i+1}. time: {time}, number of size: {
                    size}, place: {place}, mood: {mood}. {special_offer} "
            content += " Recommend one thing to do that can mostly fulfil our preferences. Respond just the word of thing."
        else:
            return Response({'error': {'message': "Invalid category"}}, status=status.HTTP_400_BAD_REQUEST)

        # Create a chat completion
        api_key = config('OPENAI_API_KEY')
        client = OpenAI(api_key=api_key)
        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": content}]
        )
        room.outcome = chat_completion.choices[0].message.content
        room.end = True
        room.save()
        serializer = RoomSerializer(room)
        return Response(serializer.data)


class AnswerAPI(APIView):
    def post(self, request):
        code = request.GET['code']
        try:
            room = Room.objects.get(code=code)
            category = room.category

            if category == 'food':
                fields = ['cuisine', 'price', 'spiciness',
                          'temperature', 'type', 'special_offer']
            elif category == 'hangout':
                fields = ['time', 'size', 'mood', 'place', 'special_offer']
            data = {field: request.data.get(field) for field in fields}
            room.results.append(data)
            room.answered_count += 1
            room.save()
            serializer = RoomSerializer(room)
            return Response(serializer.data)

        except Room.DoesNotExist:
            return Response({'error': {'message': "room not found!"}}, status=status.HTTP_404_NOT_FOUND)


class SoloAPI(APIView):
    def post(self, request, category):
        data = request.data
        formatted_pref = format_prefs(data)

        try:
            response = chain.invoke({
                "category": category,
                "preferences": {formatted_pref}
            })
        except Exception:
            return Response({'error': {'message': "Errors on OpenAI!"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        arguments = response.additional_kwargs["function_call"]["arguments"]
        result = json.loads(arguments)["recommendations"]
        return Response(result)
