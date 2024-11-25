from .models import Event,Invitee
from rest_framework import serializers


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  # or specify fields explicitly


class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitee
        fields = '__all__'
        