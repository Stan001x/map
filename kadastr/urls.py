
from django.contrib import admin
from django.urls import path, include
from pkk import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('pkk/', include('pkk.urls')),
]
