from rest_framework import serializers
from .models import Fotos

class FotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fotos
        fields = ['id', 'imagen', 'album']
