from rest_framework.response import Response
from rest_framework import status
from server.settings import OPENAI_API_KEY
from .models import Room
from rest_framework.views import APIView
from .serializers import RoomSerializer
from openai import OpenAI

# Create your views here.
class RoomListAPI(APIView):
    def get(self, request):
        queryset = Room.objects.all()
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        try:
            category = request.data['category']
        except:
            return Response({'detail': "need category"}, status=status.HTTP_404_NOT_FOUND)

        instance = Room()
        code= instance.generate_short_identifier()
        
        data = {
            'code': code,
            'category': category
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
    
    def delete(self, request):
        try:
            Room.objects.all().delete()
            return Response({"detail": "All Room data deleted successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Error deleting Room data: {e}"}, status=500)
        


class RoomAPI(APIView):
    def get(self, request, code):
        try:
            room = Room.objects.get(code=code)
            serializer = RoomSerializer(room)
            return Response(serializer.data)
        except: 
            return Response({"message": "team not found"},status=status.HTTP_404_NOT_FOUND)       
        
    def put(self, request, code):
        data = request.data
        room = Room.objects.get(code=code)
        try:
            room.end = data['end']
            room.save()
            room_serializer = RoomSerializer(room)
        
            return Response(room_serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(room_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, room_id):
        try:
            query = Room.objects.get(room_id=room_id)
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "team not found!"}}, status = status.HTTP_404_NOT_FOUND)
        
        result = Room.objects.get(room_id=room_id)
        result.delete()
        return Response({"message": "successfully deleted!"}, status=204)
    

class RecommendAPI(APIView):
    def post(self, request, category):
        data = request.data        
        cuisine = data['cuisine']
        soup = data['soup']
        spiciness = data['spiciness']
        temperature = data['temperature']
        type = data['type']
        
        if category=="food":

            content = f"Recommend me one of {temperature}, {spiciness}% spicy, {soup}, {cuisine} food including {type}. respond just the words of food."
            
            # Create a chat completion
            client = OpenAI(api_key=OPENAI_API_KEY)
            chat_completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": content}]
            )
            result = chat_completion.choices[0].message.content
            
            return Response({"result": result}, status=status.HTTP_200_OK)
        
        else:
            return Response({"detail": "category not found"}, status=status.HTTP_404_NOT_FOUND) 
                
class RoomRecommendAPI(APIView):
    def get(self, request, category, code):
        try:
            room = Room.objects.get(code=code)
            
            content = "Each one of us prefers the following food."
            for data in room.result:
                cuisine = data['cuisine']
                soup = data['soup']
                spiciness = data['spiciness']
                temperature = data['temperature']
                type = data['type']
                content += f" {temperature}, {spiciness} spicy, {soup}, {cuisine} food including {type}."
            content += " Recommend one food that can mostly fulfil our preferences. Respond just the word of food."
            # print(content)
            
            # Create a chat completion
            client = OpenAI(api_key=OPENAI_API_KEY)
            chat_completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": content}]
            )
            result = chat_completion.choices[0].message.content
            
            return Response({"result": result}, status=status.HTTP_200_OK)

        except Room.DoesNotExist:
            return Response({"detail": "room not found"}, status=status.HTTP_404_NOT_FOUND) 
        
    def post(self, request, category, code):
        data = request.data
        try:
            cuisine = data['cuisine']
            soup = data['soup']
            spiciness = data['spiciness']
            temperature = data['temperature']
            type = data['type']
        except:
            return Response({"detail": "wrong data input"}, status=status.HTTP_400_BAD_REQUEST) 

        
        try:
            room = Room.objects.get(code=code)
            
            room.result.append(data)
            room.answered_count = room.answered_count + 1

            room.save()
            serializer = RoomSerializer(room)

            return Response(serializer.data, status=status.HTTP_200_OK) 

        except Room.DoesNotExist:
            return Response({"detail": "room not found"}, status=status.HTTP_404_NOT_FOUND) 
        
