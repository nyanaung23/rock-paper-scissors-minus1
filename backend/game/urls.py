from django.urls import path
from .views import create_room, room_exists

urlpatterns = [
    path("create-room/", create_room, name="create_room"),
    path("room-exists/<str:code>/", room_exists, name="room_exists"),
]
