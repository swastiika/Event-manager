from django.urls import path
from . import views 
urlpatterns = [
    path("",views.index,name="index"),
    path('login',views.login_view,name="login"),
    path('register',views.register,name='register'),
    path("logout", views.logout_view, name="logout"),
    path("create_event",views.create_event,name="create_event"),
    path("show_event",views.show_event,name="show_event"),
    path("show_profile",views.show_profile,name="show_profile"),
    path('send-invitation/<int:event_id>',views.events,name="send_invitations"),
    path('showInvitations',views.showInvitations,name="showInvitations"),
    path('update_status/<int:event_id>', views.update_status, name='update_status'),
    path('accepted_events',views.accepted_events,name="accepted_events"),
     # path('send_invitations/<int:event_id>',views.send_invitations,name="send_invitations")
     
]