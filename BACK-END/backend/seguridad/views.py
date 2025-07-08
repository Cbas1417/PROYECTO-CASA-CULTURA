from django.http.response import JsonResponse
from .models import *
from django.http import Http404
from http import HTTPStatus
from rest_framework.views import APIView
from django.contrib.auth.models import User
import uuid
import os
from django.core.mail import send_mail
from django.contrib.auth import authenticate
from jose import jwt
from django.conf import settings
from datetime import datetime,timedelta
import time
# Create your views here.
class class1(APIView):
    def post(self,request):
        nombre = request.GET.get("nombre")
        correo = request.GET.get("correo")
        password = request.GET.get("password")
        if not nombre :
            return JsonResponse({"estado":"error","mensaje":"el campo nombre es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not correo:
            return JsonResponse({"estado":"error","mensaje":"el campo E-mail es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not password:
            return JsonResponse({"estado":"error","mensaje":"el campo password es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if User.objects.filter(email=correo).exists():
            return JsonResponse({"Estado":"Error","Mensaje":f"El correo {correo} no esta disponible"}, status=HTTPStatus.BAD_REQUEST)