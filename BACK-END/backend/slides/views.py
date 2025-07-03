from rest_framework.views import APIView
from django.http import JsonResponse
from .models import Slide
from .serializers import SlideSerializer
from http import HTTPStatus
from django.core.files.storage import FileSystemStorage
from django.http import Http404
import os
from datetime import datetime

class SlideView(APIView):

    def get(self, request):
        slides = Slide.objects.all()
        serializer = SlideSerializer(slides, many=True)
        return JsonResponse({"data": serializer.data}, status=HTTPStatus.OK)

    def post(self, request):
        if 'imagen' not in request.FILES:
            return JsonResponse({"estado": "error", "mensaje": "El campo imagen es obligatorio"}, status=HTTPStatus.BAD_REQUEST)

        try:
            fs = FileSystemStorage()
            nombre_imagen = f"{datetime.timestamp(datetime.now())}{os.path.splitext(str(request.FILES['imagen']))[1]}"
            fs.save(f"slides/{nombre_imagen}", request.FILES['imagen'])
            slide = Slide.objects.create(imagen=f"slides/{nombre_imagen}")
            return JsonResponse({"estado": "ok", "mensaje": "Slide creado correctamente"}, status=HTTPStatus.CREATED)
        except Exception as e:
            return JsonResponse({"estado": "error", "mensaje": "No se pudo guardar la imagen"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)

class SlideDetalle(APIView):

    def delete(self, request, id):
        try:
            slide = Slide.objects.get(id=id)
        except Slide.DoesNotExist:
            raise Http404
        
        # Borrar la imagen del sistema de archivos
        try:
            os.remove(slide.imagen.path)
        except Exception:
            pass  # en caso de que no exista físicamente

        slide.delete()
        return JsonResponse({"estado": "ok", "mensaje": "Slide eliminado"}, status=HTTPStatus.OK)
