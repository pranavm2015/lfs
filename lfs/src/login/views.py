#!/usr/bin/python
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
import pyfirmata
from time import sleep
from .models import seat

# Associate port and board with pyFirmata
from .forms import PostForm

@login_required(login_url="login/")

def home(request):
	return render(request,"home.html",{})

def account(request):
	return render(request,'account.html',{})


def about(request):
	return render(request,'about.html',{})


def contact(request):
	return render(request,'contact_us.html',{})

def lsb(request, id = None):
	bookseat = seat.objects.all()
	if request.method == "POST":
		print(request.POST['seat'])
		query = seat.objects.get(seat = request.POST['seat'])
		try : 
			form = PostForm(request.POST, instance = query)
			print(2)
			if form.is_valid :
				print(3)
				form.save()
		except query.DoesNotExist :
			form = PostForm()
	else :
			form = PostForm()
	return render(request,'1.html',{"bseat":bookseat,"form":form})

def stopwatch(request):
	return render(request,'stopwatch_try.html',{})


def prof(request):
	return render(request,'prof.html',{})



port = '/dev/ttyACM1'
board = pyfirmata.Arduino(port)

it = pyfirmata.util.Iterator(board)
it.start()

# Define pins
pirPin = board.get_pin('d:2:i')
present = "Faculty not Present in Room"



def fas(request):
	# Use iterator thread to avoid buffer overflow
	# Check for PIR sensor input
	# Ignore case when receiving None value from pin5

	value = pirPin.read()
	while value is None :
		sleep(1)
		value = pirPin.read()
		print(value)
	if value is None:
		present = "none"
	if value is True:
		present = "Faculty Present in Room"
	if value is False:
		present = "Faculty Not Present"
	context = {"this" : present}
	return render(request,'fas.html',context)	
