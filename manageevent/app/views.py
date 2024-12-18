from django.shortcuts import render
from django.http import HttpRequest,HttpResponse,HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,get_object_or_404,redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from datetime import datetime, timedelta
from django.utils.timezone import now

from .models import User,Event,Invitee
from .serializers import EventSerializer,InviteSerializer,UserSerializer

# Create your views here.
def index(request):
    return render(request,"app/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "app/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "app/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))



def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "app/register.html", {
                "message": "Passwords must match."
            })

        # Check if email is already in use
        if User.objects.filter(email=email).exists():
            return render(request, "app/register.html", {
                "message": "Email is already in use."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "app/register.html", {
                "message": "Username already taken."
            })

        # Log the user in and redirect to the index page
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "app/register.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

@api_view(['POST'])
def create_event(request):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=401)

    # Add the owner (request.user) to the serializer's data
    data = request.data.copy()  # Make a copy of request.data to add the owner

    serializer = EventSerializer(data=data)
    if serializer.is_valid():
        event = serializer.save(owner = request.user)  # Save the event
        # Re-serialize the saved event and return it
        return Response(EventSerializer(event).data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def show_event(request):
    events = Event.objects.filter(type='public')
    serializer = EventSerializer(events, many=True)
    for event_data, event in zip(serializer.data, events):
        event_data['is_owner'] = event.owner == request.user  # Check if user is the owner
    return Response(serializer.data)

@api_view(['GET'])
def show_profile(request):
    events = Event.objects.filter(owner = request.user)
    serializer = EventSerializer(events,many=True)
    for event_data, event in zip(serializer.data, events):
        event_data['is_owner'] = True
    return Response(serializer.data)

@api_view(['GET', 'POST'])  # Pass both methods in a single list
def events(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    if request.method == "GET":
        # Fetch all invitees related to the event
        invitees = Invitee.objects.filter(event=event)  # Corrected query
        return render(request, "app/rsvp.html", {"event": event, "invitees": invitees})

    elif request.method == 'POST':
        # Deserialize and validate data
        serializer = InviteSerializer(data=request.data, many=True)  # Assuming bulk creation
        if serializer.is_valid():
            serializer.save(event=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def showInvitations(request):
    user_mail = request.user.email
    events = Invitee.objects.filter(recipient = user_mail)
    serializer = InviteSerializer(events,many = True)
    return Response(serializer.data)

@api_view(['POST'])
def update_status(request, event_id):
    """
    Update RSVP status for a specific event invitation.
    """
    # Extract status from the request body
    status = request.data.get('status')  # Use request.data for POST
    if status not in ['Accepted', 'Declined']:
        return JsonResponse({'error': 'Invalid status value.'}, status=400)

    # Authenticate and fetch invitee
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User not authenticated.'}, status=401)

    # Fetch invitee for the event
    invitee = get_object_or_404(Invitee, id=event_id, recipient=request.user.email)

    # Update RSVP status
    invitee.rsvp_status = status
    invitee.responded_at = now()
    invitee.save()
    event = invitee.event
    serializer = EventSerializer(event)

    return Response({
        'message': f'RSVP status updated to {status}.',
        'event': serializer.data
    }, status=200)

@api_view(['GET'])
def accepted_events(request):
    recipient_email = request.user.email  # Get the recipient email of the logged-in user

    # Get accepted events by filtering Invitee model based on RSVP status and recipient email
    accepted_invitees = Invitee.objects.filter(recipient=recipient_email, rsvp_status="Accepted")

    # Prepare the events data in FullCalendar's expected format
    event_list = []

    for invitee in accepted_invitees:
        event = invitee.event  # Access the associated event object
        
        # Prepare the event data
        event_data = {
            'title': event.name,  # Event name
            'date': event.date.isoformat(),  # Event date in ISO format, assuming a single-day event
            'location': event.venue,  # Optional: Add venue (location of the event)
        }

        event_list.append(event_data)

    return Response(event_list)