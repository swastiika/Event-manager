from .models import Event,Invitee,User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']  # Include the fields you want

class EventSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)  # Use UserSerializer for detailed info
    class Meta:
        model = Event
        fields = '__all__' 


class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitee
        fields = '__all__'
        