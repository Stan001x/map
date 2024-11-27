from django.urls import path
from . import views

urlpatterns = [
    path('', views.pkk, name='pkk'),
    path('pks/', views.pks, name='pks'),
    path('tiles/', views.tiles, name='tiles'),
]