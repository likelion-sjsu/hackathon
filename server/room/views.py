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
        
        print(category)
        if category not in ['food', 'activity', 'travel']:
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
            if room.end == True:
                return Response({"message": "room already terminated"},status=status.HTTP_400_BAD_REQUEST)       
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

class AnswerAPI(APIView):
    def post(self, request,code):
        try:
            room = Room.objects.get(code=code)
            serializer = RoomSerializer(room)
            category = serializer.data.get("category")
            fields = ['cuisine', 'soup', 'spiciness', 'temperature', 'type']
            data = {field: request.data.get(field) for field in fields}
            room.results.append(data)
            room.answered_count +=1
            room.save()
            serializer = RoomSerializer(room)
            return Response(serializer.data)

        except Room.DoesNotExist:
            return Response({'error' : {'message' : "room not found!"}}, status = status.HTTP_404_NOT_FOUND)


class RecommendAPI(APIView):
    def post(self, request, category, code):
        try:
            room = Room.objects.get(code=code,category=category)
            serializer = RoomSerializer(room)
            category = serializer.data.get("category")
            print(serializer.data)
            if category == 'food':
                fields = ['cuisine', 'soup', 'spiciness', 'temperature', 'type']
                data = {field: request.data.get(field) for field in fields}
                content = f"Recommend me one of {data['temperature']}, {data['spiciness']}% spicy, {data['soup']}, {data['cuisine']} food including {data['type']}. respond just the words of food."
                # Create a chat completion
                api_key = config('OPENAI_API_KEY')
                print("api key ", api_key)
                client = OpenAI(api_key=api_key)
                chat_completion = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": content}]
                )
                result = chat_completion.choices[0].message.content    
                return Response({"result": result})
            else:
                return Response({'error': {'message': "Invalid category"}}, status=status.HTTP_400_BAD_REQUEST)
          
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "room not found!"}}, status = status.HTTP_404_NOT_FOUND)

class SoloAPI(APIView):
    def post(self, request, category):
        try:
            print(category)
            if category == 'food':
                fields = ['cuisine', 'soup', 'spiciness', 'temperature', 'type']
                data = {field: request.data.get(field) for field in fields}
                content = f"Recommend me one of {data['temperature']}, {data['spiciness']}% spicy, {data['soup']}, {data['cuisine']} food including {data['type']}. respond just the words of food."
                # Create a chat completion
                api_key = config('OPENAI_API_KEY')
                print("api key ", api_key)
                client = OpenAI(api_key=api_key)
                chat_completion = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": content}]
                )
                result = chat_completion.choices[0].message.content    
                return Response({"result": result})
            else:
                return Response({'error': {'message': "Invalid category"}}, status=status.HTTP_400_BAD_REQUEST)
          
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "room not found!"}}, status = status.HTTP_404_NOT_FOUND)
