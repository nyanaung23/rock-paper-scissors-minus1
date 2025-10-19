from django.urls import re_path
from .consumers import RPSConsumer

websocket_urlpatterns = [
    re_path(r"^ws/rps/(?P<room_code>[A-Za-z0-9]{6})/$", RPSConsumer.as_asgi()),
]

