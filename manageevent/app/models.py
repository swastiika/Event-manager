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
    
class RSVPStatus(models.TextChoices):
    PENDING = 'Pending', 'Pending'
    ACCEPTED = 'Accepted', 'Accepted'
    DECLINED = 'Declined', 'Declined'

class Invitee(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="invitees")
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name="send_invitation",default=1)
    recipient = models.EmailField(default="default@example.com")  # Add parentheses here to instantiate the field
    rsvp_status = models.CharField(
        max_length=20,
        choices=RSVPStatus.choices,
        default=RSVPStatus.PENDING
    )
    invitation_sent_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.recipient} - {self.event} ({self.rsvp_status})"
