from django.db import models
import shortuuid
import random

# Create your models here.
class Room(models.Model):
    #result = models.TextField()
    code = models.CharField(max_length=22, unique=True)

    @staticmethod
    def generate_short_identifier(digits=4):
        max_value = 10**digits - 1
        return str(random.randint(0, max_value)).zfill(digits)