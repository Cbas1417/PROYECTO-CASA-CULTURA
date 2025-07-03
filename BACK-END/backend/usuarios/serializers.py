from rest_framework import serializers
from .models import *
from django.conf import settings
from dotenv import load_dotenv
import os
# esto es para camellar con el .env (este siempre hace referencia al serializer)


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['tipo_documento','numero_documento','nombre','fecha_nacimiento','correo','telefono','contraseña']