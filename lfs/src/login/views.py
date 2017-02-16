from django.http import HttpResponse
from django.shortcuts import render

from .models import info

def login_home(request):
	queryset = info.objects.all()
	context = {"list_all" : queryset}
	return render(request, "site_basic.html", context)	