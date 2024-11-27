from django.contrib import admin
from .models import Event,User,Invitee
# Register your models here.
admin.site.register(Event)
admin.site.register(User)
class InviteeAdmin(admin.ModelAdmin):
    list_display = ('email', 'event', 'rsvp_status', 'invitation_sent_at')

admin.site.register(Invitee, InviteeAdmin)