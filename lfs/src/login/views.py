#!/usr/bin/python
from django.shortcuts import render, get_object_or_404,redirect
from django.contrib.auth.decorators import login_required
import pyfirmata
from time import sleep
from .models import seat, usertype
from django.contrib.auth.models import User

# Associate port and board with pyFirmata
from .forms import PostForm, UserForm


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
	form2 = UserForm()
	if request.method == "POST":

		sed = User.objects.get(username = request.user)
		if sed.usertype.seat_booked > 0 :
			print(1)
			query = seat.objects.get(seat = sed.usertype.seat_booked)
			query.booked = False
			print(query.seat, sed.usertype.seat_booked)
			form = PostForm(request.POST, instance = query)
			print(form)
			sed.usertype.seat_booked = 0
			sed.save()
			if  form.is_valid() :	
				form1 = UserForm(request.POST, instance = sed)
				print("hello")
				if form1.is_valid():
					form1.save()
				form.save()
			print(query.booked, sed.usertype.seat_booked)
			return render(request,'1.html',{"bseat":bookseat,"form":form,"chk":"","form2":form2})
		query = seat.objects.get(seat = 1)
		try :
			query = seat.objects.get(seat = request.POST['seat'])
			if query.booked :
				form = PostForm()
				return render(request,'1.html',{"bseat":bookseat,"form":form,"chk":"1","form2":form2})
			query.booked = True
			form = PostForm(request.POST, instance = query)
			print(2)
			if form.is_valid :
				print(3)				
				owner = User.objects.get(username = request.user)
				print(owner.usertype.seat_booked,request.POST['seat'])
				owner.usertype.seat_booked = request.POST['seat']
				
				form1 = UserForm(request.POST, instance = owner)
				print(owner)
				print(owner.usertype.seat_booked)
				owner.save()
				if form1.is_valid() :
					form1.save()
				form.save()
				#return redirect('/')
		except query.DoesNotExist :
			form = PostForm()
			return render(request,'1.html',{"bseat":bookseat,"form":form,"chk":"2","form2":form2})
	else :
			form = PostForm()
	

	return render(request,'1.html',{"bseat":bookseat,"form":form,"chk":"","form2":form2})

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
