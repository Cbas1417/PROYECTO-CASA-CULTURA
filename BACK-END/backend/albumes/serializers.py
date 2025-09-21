# albumes/serializers.py
from rest_framework import serializers
from .models import Album
from fotos.models import Fotos  # importamos el modelo Fotos para consultas directas

class AlbumSerializer(serializers.ModelSerializer):
    portada = serializers.SerializerMethodField()
    total_fotos = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = "__all__"

    def get_portada(self, obj):
        # Buscamos la última foto (por id descendente) asociada a este álbum
        ultima = Fotos.objects.filter(album=obj).order_by("-id").first()
        if ultima and getattr(ultima, "imagen", None):
            request = self.context.get("request")
            url = ultima.imagen.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_total_fotos(self, obj):
        # Contamos las fotos asociadas (consulta directa, robusta)
        return Fotos.objects.filter(album=obj).count()