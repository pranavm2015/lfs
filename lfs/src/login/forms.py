from django.contrib.auth.forms import AuthenticationForm 
from django import forms
from .models import seat, usertype
from django.contrib.auth.models import User


class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Username", max_length=30, 
                               widget=forms.TextInput(attrs={'class': 'form-control', 'name': 'username'}))
    password = forms.CharField(label="Password", max_length=30, 
                               widget=forms.PasswordInput(attrs={'class': 'form-control', 'name': 'password'}))


class PostForm(forms.ModelForm):

    class Meta:
        model = seat
        fields = ('seat',)

# forms.py
class UserForm(forms.ModelForm):
    class Meta:
        model = usertype
        fields = ('seat_booked', )
