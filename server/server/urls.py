"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from room.views import CategoryAPI, CategoryListAPI, RoomAPI, RoomListAPI, GroupAPI, SoloAPI, AnswerAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('room/', RoomListAPI.as_view()),
    path('room/<str:code>', RoomAPI.as_view()),
    path('recommend', AnswerAPI.as_view()),
    path('recommend/result/<str:code>', GroupAPI.as_view()),
    path('recommend/<str:category>/', SoloAPI.as_view()),
    path('category', CategoryListAPI.as_view()),
    path('category/<str:id>', CategoryAPI.as_view())
]
