from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('pkk/', views.pkk),
]