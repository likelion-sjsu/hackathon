from django.db import models
import shortuuid
import random

# Create your models here.
class Room(models.Model):
    results = models.JSONField(default=list)
    code = models.CharField(max_length=22, unique=True)
    category = models.CharField(max_length=10, default="food")
    max_count = models.IntegerField(default =1, null=True)
    answered_count = models.IntegerField(default=0)
    outcome = models.CharField(max_length=100, default="")

    @staticmethod
    def generate_short_identifier(digits=4):
        max_value = 10**digits - 1
        return str(random.randint(0, max_value)).zfill(digits)