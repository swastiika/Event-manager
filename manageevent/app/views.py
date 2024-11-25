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


from .models import User,Event
from .serializers import EventSerializer

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
            return render(request, "network/login.html", {
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
    data['owner'] = request.user.id  # Assign the authenticated user's ID as owner

    serializer = EventSerializer(data=data)
    if serializer.is_valid():
        event = serializer.save()  # Save the event
        # Re-serialize the saved event and return it
        return Response(EventSerializer(event).data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def show_event(request):
    events = Event.objects.filter(type='public')
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def show_profile(request):
    events = Event.objects.filter(owner = request.user)
    serializer = EventSerializer(events,many=True)
    return Response(serializer.data)

def events(request,event_id):
    return render(request,"app/rsvp.html")