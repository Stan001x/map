from django.urls import path
from . import views

urlpatterns = [
    path('', views.pkk, name='pkk'),
    path('pks/', views.pks, name='pks'),
    path('tiles/', views.tiles, name='tiles'),
    path('parceltext/', views.parceltext, name='parceltext'),
    path('building/', views.building, name='building'),
    path('construction/', views.construction, name='construction'),
    path('uncomplite/', views.uncomplite, name='uncomplite'),
    path('<slug:regions_slug>/', views.pkk_regions_by_slug, name='regions'),
]