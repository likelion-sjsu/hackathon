from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import Room
from rest_framework.views import APIView
from .serializers import RoomSerializer
import shortuuid

# Create your views here.
class RoomListAPI(APIView):
    def get(self, request):
        queryset = Room.objects.all()
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        instance = Room()
        code= instance.generate_short_identifier()

        # Add the generated room_id to the request data
        request.data['code'] = code

        # Deserialize the request data using RoomSerializer
        room_serializer = RoomSerializer(data=request.data)

        # Check if the serialized data is valid
        if room_serializer.is_valid():
            # Save the room to the database
            room_serializer.save()

            # Return the serialized data of the created room in the response
            return Response(room_serializer.data, status=status.HTTP_201_CREATED)

        # If the serialized data is not valid, return error response
        return Response(room_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomAPI(APIView):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(room_id=room_id)
            serializer = RoomSerializer(room)
            return Response(serializer.data)
        except: 
            return Response({"message": "team not found"},status=status.HTTP_404_NOT_FOUND)       
        
    def put(self, request, room_id):
        room_id = shortuuid.uuid()

        # Add the generated room_id to the request data
        request.data['room_id'] = room_id

        # Deserialize the request data using RoomSerializer
        room_serializer = RoomSerializer(data=request.data)

        # Check if the serialized data is valid
        if room_serializer.is_valid():
            # Save the room to the database
            room_serializer.save()

            # Return the serialized data of the created room in the response
            return Response(room_serializer.data, status=status.HTTP_201_CREATED)

        # If the serialized data is not valid, return error response
        return Response(room_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, room_id):
        try:
            query = Room.objects.get(room_id=room_id)
        except Room.DoesNotExist:
            return Response({'error' : {'message' : "team not found!"}}, status = status.HTTP_404_NOT_FOUND)
        
        result = Room.objects.get(room_id=room_id)
        result.delete()
        return Response({"message": "successfully deleted!"}, status=204)