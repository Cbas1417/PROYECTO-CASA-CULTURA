from rest_framework import serializers
from .models import Exposicion

class ExposicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exposicion
        fields = "__all__"
