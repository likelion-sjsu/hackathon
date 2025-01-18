from rest_framework import serializers
from .models import Category, Option, Question, Room


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Category
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = '__all__'
