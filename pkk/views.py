from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request,'pkk/home.html')

def pkk(request):
    return render(request,'pkk/pkk.html')

def pk(request):
    return render(request,'pkk/pk.html')
