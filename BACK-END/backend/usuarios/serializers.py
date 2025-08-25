from rest_framework import serializers
from .models import *
from django.conf import settings
from dotenv import load_dotenv
import os


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id','tipo_documento','numero_documento','nombre','fecha_nacimiento','correo','telefono','contraseña']