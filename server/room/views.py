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
    def get(self, request):
        code = request.GET['code']
        try:
            room = Room.objects.get(code=code)
            category = room.category
            if category == 'food':
                
                content = "Each one of us prefers the following food. "
                for i, data in enumerate(room.results):
                    cuisine = data['cuisine']
                    type = data['type']
                    comfort = data['comfort']
                    spiciness = data['spiciness']
                    temperature = data['temperature']
                    special_offer = data['special_offer']
                    content += f"{i+1}. {temperature} {spiciness} {cuisine} food including {type} in {comfort} atmosphere. {special_offer}"
                content += " Recommend one food that can mostly fulfil our preferences. Respond just the word of food."

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
            else:
                return Response({'error': {'message': "Invalid category"}}, status=status.HTTP_400_BAD_REQUEST)
          
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "room not found!"}}, status = status.HTTP_404_NOT_FOUND)
        
        
    def post(self, request,code):
        try:
            room = Room.objects.get(code=code)
            
            fields = ['cuisine', 'comfort', 'spiciness', 'temperature', 'type', 'special_offer']
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
        
        cuisine = data['cuisine']
        type = data['type']
        spiciness = data['spiciness']
        comfort = data['comfort']
        temperature = data['temperature']
        special_offer = data['special_offer']
        try:
            if category == 'food':
                fields = ['cuisine', 'soup', 'spiciness', 'temperature', 'type']
                data = {field: request.data.get(field) for field in fields}
                content = f"Recommend me one of {temperature} {spiciness} {cuisine} foods including {type} in {comfort} atmosphere. {special_offer}.respond just the words of one food."
                
                # Create a chat completion
                api_key = config('OPENAI_API_KEY')
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
