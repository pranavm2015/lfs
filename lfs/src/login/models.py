from django.db import models

from django.contrib.auth.models import User

class usertype(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    userType = models.CharField(max_length=100)

class seat(models.Model):
	seat = models.CharField(max_length=3,unique = True)
	booked = models.BooleanField(default = False)