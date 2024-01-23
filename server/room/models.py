from django.db import models
import shortuuid
import random

# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=22, unique=True)
    category = models.CharField(max_length=10, default="food")
    result = models.CharField(max_length=10000, default="")
    end = models.BooleanField(default=False)

    @staticmethod
    def generate_short_identifier(digits=4):
        max_value = 10**digits - 1
        return str(random.randint(0, max_value)).zfill(digits)