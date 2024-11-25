from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Event(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField()
    type = models.CharField(max_length=50, choices=[('private', 'Private'), ('public', 'Public')])
    mode = models.CharField(max_length=50, choices=[('offline', 'Offline'), ('online', 'Online')])
    venue = models.CharField(max_length=255, blank=True)  # Removed null=True
    link = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    
    def __str__(self):
        return f"{self.name} ({self.date}) - {self.mode.capitalize()}"


class Invitee(models.Model):
    event = models.ForeignKey(Event,on_delete=models.CASCADE,related_name="invitees")
    email = models.EmailField
    rsvp_status = models.CharField(max_length=20,choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Declined', 'Declined')],
        default='Pending')
    invitation_sent_at = models.DateTimeField(auto_now_add=True)