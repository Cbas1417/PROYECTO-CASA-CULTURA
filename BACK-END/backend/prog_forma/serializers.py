from rest_framework import serializers
from .models import Programa

class ProgramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programa
        fields = '__all__'  # Incluye todos los campos automáticamente