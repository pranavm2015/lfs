
from django.conf.urls import include, url
from django.contrib import admin

from django.contrib.auth import views
from login.forms import LoginForm

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('login.urls')),
    url(r'^login/$', views.login, {'template_name': 'login.html', 'authentication_form': LoginForm}, name='login'),
    url(r'^logout/$', views.logout, {'next_page': '/login'}),  
]
