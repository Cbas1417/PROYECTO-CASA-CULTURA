from rest_framework import serializers
from .models import Exposicion

class ExposicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exposicion
        fields = '__all__'
    
    def validate(self, data):
        if not data.get('tiempo'):
            raise serializers.ValidationError("El campo tiempo es obligatorio.")
        return data


