from django.db import models

from django.contrib.auth.models import User

class usertype(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    userType = models.CharField(max_length=100)