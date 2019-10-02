from django.conf.urls import url
from . import views
from django.views.generic import RedirectView

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^home/$', RedirectView.as_view(url='/')),
    url(r'^account/$', views.account, name='account'),
    url(r'^about/$', views.about, name='about'),
    url(r'^contact/$', views.contact, name='contact'),
    url(r'^lsb/$', views.lsb, name='lsb'),
    url(r'^fas/$', views.fas, name='fas'),
    url(r'^prof/$', views.prof, name='prof'),
    url(r'^lsb/stopwatch_try.html$', views.stopwatch, name='stop'),
]
