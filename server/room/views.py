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
        - Provide 5 distinct, diverse, and recognizable {category} recommendations that fit the user's preferences in the {category}.
        - The recommendations should be {category} names that are commonly searched for and easily recognizable, without any additional descriptions or modifiers like "with" or "and".
        - maximum 3 words

        Example Recommendations for {category} category:
        - General Tso's Chicken, Orange Chicken, Kung Pao Chicken, Sweet and Sour Pork, Dim Sum

        Recommendation:
        Please suggest 5 suitable {category} options that match the user's preferences.
        """)
])


def format_prefs(preferences):
    formatted = ""
    for pref in preferences:
        key = pref[0]
        value = ', '.join(item['value'] for item in pref[1])
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

        # TODO: Check if category is in the questions DB. Currently DB is in json in client side.

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

        response = chain.invoke({
            "category": room.category,
            "preferences": "\n".join(room.results)
        })
        arguments = response.additional_kwargs["function_call"]["arguments"]
        result = json.loads(arguments)["recommendations"]
        room.outcome = result
        room.end = True
        room.save()
        return Response(result)


class AnswerAPI(APIView):
    def post(self, request):
        code = request.GET['code']
        pref = request.data

        try:
            room = Room.objects.get(code=code)
            category = room.category

            formatted_pref = format_prefs(pref)
            room.results.append(formatted_pref)
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
        print(f"{category}\n{formatted_pref}]")
        try:
            response = chain.invoke({
                "category": category,
                "preferences": {formatted_pref}
            })
        except Exception:
            return Response({'error': {'message': "Errors on OpenAI!"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        arguments = response.additional_kwargs["function_call"]["arguments"]
        result = json.loads(arguments)["recommendations"]
        print(result)
        return Response(result)
