from django.contrib import admin
from .models import Room, Category, Question, Option

# Register your models here.
admin.site.register(Room)
admin.site.register(Category)
admin.site.register(Question)
admin.site.register(Option)
