from pyexpat import model
from django.db import models
import secrets


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    # Hex color code (e.g., #FF9090)
    color = models.CharField(max_length=7, default="#836AAD")


class Question(models.Model):
    category = models.ForeignKey(
        Category, related_name="questions", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    multiple = models.BooleanField(default=False)


class Option(models.Model):
    question = models.ForeignKey(
        Question, related_name="options", on_delete=models.CASCADE)
    index = models.PositiveIntegerField()
    icon = models.CharField(max_length=10)
    value = models.CharField(max_length=100)


class Room(models.Model):
    results = models.JSONField(default=list)
    code = models.CharField(max_length=22, unique=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="rooms")
    max_count = models.IntegerField(default=1)
    answered_count = models.IntegerField(default=0)
    outcome = models.CharField(max_length=100, default="")

    @staticmethod
    def generate_short_identifier(digits=4):
        max_value = 10**digits - 1
        return str(secrets.randbelow(max_value + 1)).zfill(digits)
