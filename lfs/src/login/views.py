from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url="login/")

def home(request):
	return render(request,"home.html",{})

def account(request):
	return render(request,'account.html',{})


def about(request):
	return render(request,'about.html',{})


def contact(request):
	return render(request,'contact_us.html',{})


def lsb(request):
	return render(request,'lsb.html',{})


def fas(request):
	return render(request,'fas.html',{})


def prof(request):
	return render(request,'prof.html',{})