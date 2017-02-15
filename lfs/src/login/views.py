from django.http import HttpResponse
from django.shortcuts import render

from .models import info

def login_home(request):
	queryset = info.objects.all()
	return render(request, "login.html", queryset)	