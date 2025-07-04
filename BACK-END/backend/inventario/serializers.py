from rest_framework import serializers
from .models import *
from django.conf import settings
from dotenv import load_dotenv
import os
# esto es para camellar con el .env (este siempre hace referencia al serializer)


class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = ['id','imagen','nombre','cantidad','descripcion']