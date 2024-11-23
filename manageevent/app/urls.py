from django.urls import path
from . import views 
urlpatterns = [
    path("",views.index,name="index"),
    path('login',views.login_view,name="login"),
    path('register',views.register,name='register'),
     path("logout", views.logout_view, name="logout"),
     path("create_event",views.create_event,name="create_event"),
]