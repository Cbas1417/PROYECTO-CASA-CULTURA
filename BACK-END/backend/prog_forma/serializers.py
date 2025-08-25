from rest_framework import serializers
from .models import *
from django.conf import settings
from dotenv import load_dotenv
import os
# esto es para camellar con el .env (este siempre hace referencia al serializer)


class ProgramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programa
        fields = ['id','foto_programa','titulo','descripcion']
