from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.contrib.auth.models import User

class usertype(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    userType = models.CharField(max_length=100)
    seat_booked = models.IntegerField(default = False)

class seat(models.Model):
	seat = models.CharField(max_length=3,unique = True)
	booked = models.BooleanField(default = False)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.usertype.save()