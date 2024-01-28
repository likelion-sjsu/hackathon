from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import Room
from rest_framework.views import APIView
from .serializers import RoomSerializer
import shortuuid
from openai import OpenAI
from decouple import config

# Create your views here.
class RoomListAPI(APIView):
    def get(self, request):
        queryset = Room.objects.all()
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        category = request.data['category']
        max_count = request.data['max_count']
        instance = Room()
        code= instance.generate_short_identifier()

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
            return Response({"message": "room not found"},status=status.HTTP_404_NOT_FOUND)       
        
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
            return Response({"message": "room not found"},status=status.HTTP_404_NOT_FOUND)       
        

    def delete(self, request, code):
        try:
            query = Room.objects.get(code=code)
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "team not found!"}}, status = status.HTTP_404_NOT_FOUND)
        
        result = Room.objects.get(code=code)
        result.delete()
        return Response({"message": "successfully deleted!"}, status=204)

class GroupAPI(APIView): 
    def get(self, request, code):
        try:
            room = Room.objects.get(code=code)
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "room not found!"}}, status = status.HTTP_404_NOT_FOUND)
        
        category = room.category
        
        if category == 'food':    
            content = "Each one of us prefers the following food. "
            spiciness_list = ["no spicy", "mild spicy", "moderately spicy", "very spicy", "extremely spicy", "whatever"]
            price_list = ["$0-$10", "$10-$25", "$25-$50", "$50 and up", "whatever"]
            spiciness = "whatever"
            price = "whatever"
            for i, data in enumerate(room.results):
                cuisine = data['cuisine']
                type = data['type']
                temperature = data['temperature']
                special_offer = data['special_offer']
                content += f"{i+1}. {temperature}  {cuisine} food including {type}. {special_offer}. "
                spiciness = spiciness_list[min(spiciness_list.index(spiciness), spiciness_list.index(data['spiciness']))]
                price = price_list[min(price_list.index(price), price_list.index(data['price']))]
            content += f"Spiciness : {spiciness}, price range: {price}."
            content += " Recommend one food that can mostly fulfil our preferences. Respond just the word of place."
            
        elif category == 'hangout':
            content = "Each one of us prefers the following place to hangout. "
            for i, data in enumerate(room.results):
                time = data['time']
                size = data['size']
                place = data['place']
                mood = data['mood']
                special_offer = data['special_offer']
                content += f"{i+1}. time: {time}, number of size: {size}, place: {place}, mood: {mood}. {special_offer} "
            content += " Recommend place that can mostly fulfil our preferences. Respond just the word of place."
        else:
            return Response({'error': {'message': "Invalid category"}}, status=status.HTTP_400_BAD_REQUEST)
            
        print(content)
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
                fields = ['cuisine', 'price', 'spiciness', 'temperature', 'type', 'special_offer']
            elif category == 'hangout':
                fields = ['time', 'size', 'mood', 'place', 'special_offer']
            data = {field: request.data.get(field) for field in fields}
            room.results.append(data)
            room.answered_count +=1
            room.save()
            serializer = RoomSerializer(room)
            return Response(serializer.data)

        except Room.DoesNotExist:
            return Response({'error' : {'message' : "room not found!"}}, status = status.HTTP_404_NOT_FOUND)

class SoloAPI(APIView):
    def post(self, request, category):
        data = request.data
        special_offer = data['special_offer']
        
        try:
            if category == 'food':
                cuisine = data['cuisine']
                type = data['type']
                spiciness = data['spiciness']
                price = data['price']
                temperature = data['temperature']
                content = f"Recommend me one of {temperature} and {spiciness} {cuisine} foods including {type} in {price}. {special_offer}. respond just the words of one food."
                
            elif category == 'hangout':
                time = data['time']
                size = data['size']
                place = data['place']
                mood = data['mood']
                content = "Recommend me one place to hangout that satisfies the following conditions."
                content += f"time: {time}, number of size: {size}, place: {place}, mood: {mood}. {special_offer}."
                content += " respond just the words of one place."
                
            else:
                return Response({'error': {'message': "Invalid category"}}, status=status.HTTP_400_BAD_REQUEST)
            print(content)
            # Create a chat completion
            api_key = config('OPENAI_API_KEY')
            client = OpenAI(api_key=api_key)
            chat_completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": content}]
            )
            result = chat_completion.choices[0].message.content    
            return Response({"result": result})
            
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "room not found!"}}, status = status.HTTP_404_NOT_FOUND)
