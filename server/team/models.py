from django.db import models

# Create your models here.
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Teammate(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='teammates')
    is_leader = models.BooleanField(default=False)  # check if this teammate is a leader

    def __str__(self):
        return self.name