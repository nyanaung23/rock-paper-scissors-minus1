from django.db import models
from django.utils import timezone

class Room(models.Model):
    code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    state = models.JSONField(default=dict)

    def __str__(self):
        return self.code
