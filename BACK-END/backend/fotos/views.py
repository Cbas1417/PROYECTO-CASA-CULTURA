from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Fotos
from .serializers import FotosSerializer

class FotosListCreate(APIView):
    """
    GET -> lista fotos (opcional: filtra por album con ?album=ID)
    POST -> crea nueva foto
    """

    def get(self, request):
        album_id = request.query_params.get("album", None)  # <-- capturar query param
        if album_id:
            fotos = Fotos.objects.filter(album_id=album_id).order_by("-id")
        else:
            fotos = Fotos.objects.all().order_by("-id")

        serializer = FotosSerializer(fotos, many=True, context={"request": request})
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FotosSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"Estado": "Ok", "Mensaje": "Registro creado correctamente"},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"Estado": "Error", "Mensaje": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class FotosDetail(APIView):
    """
    PUT -> actualizar una foto
    DELETE -> eliminar una foto
    """

    def get_object(self, id):
        try:
            return Fotos.objects.get(id=id)
        except Fotos.DoesNotExist:
            raise Http404

    def put(self, request, id):
        foto = self.get_object(id)
        serializer = FotosSerializer(foto, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"Estado": "Ok", "Mensaje": "Se modificó el elemento correctamente"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"Estado": "Error", "Mensaje": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, id):
        foto = self.get_object(id)
        foto.delete()
        return Response(
            {"Estado": "Ok", "Mensaje": "Eliminado correctamente"},
            status=status.HTTP_200_OK,
        )