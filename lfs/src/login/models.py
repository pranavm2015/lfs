from django.db import models

# Create your models here.

class info(models.Model):
	UserName = models.CharField(max_length=220,)
	Password = models.CharField(max_length=20,)

	def __str__(self):
		return str(self.UserName)