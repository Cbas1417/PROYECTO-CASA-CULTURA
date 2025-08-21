from rest_framework import serializers
from .models import *
from django.conf import settings
from dotenv import load_dotenv
import os
# esto es para camellar con el .env (este siempre hace referencia al serializer)


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id','tipo_documento','numero_documento','nombre','fecha_nacimiento','correo','telefono','contraseña']
    
    def create(self, validated_data):
        password = validated_data.pop('contraseña')
        correo = validated_data['correo']
        nombre = validated_data['nombre']

        user = User.objects.create_user(
            username=correo,
            email=correo,
            first_name=nombre,
            password=password,
            is_active=True
        )
        
        usuario = Usuario.objects.create(user=user, **validated_data)

        return usuario