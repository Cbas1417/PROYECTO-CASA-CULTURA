from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from http import HTTPStatus
from django.http import Http404
from django.utils.text import slugify
from .models import *
from .serializers import *
from django.core.files.storage import FileSystemStorage
from datetime import datetime

# Create your views here.
class class1(APIView):

    def get(self,request):
        data=Album.objects.order_by('-id').all()
        serializer=AlbumSerializer(data, many=True, context={'request': request})
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        titulo = request.data.get('titulo')

        if not titulo:
            return JsonResponse({"Estado": "Error", "Mensaje": "La carpeta debe tener titulo"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Album.objects.create(
                                        titulo=titulo
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):

    def put(self,request,id):
        titulo = request.data.get('titulo')
        try:
            a = Album.objects.get(id=id)
        except:
            raise Http404("Producto no encontrado")
        
        if not titulo:
            return JsonResponse({"Estado": "Error", "Mensaje": "La carpeta debe tener titulo"}, status=HTTPStatus.BAD_REQUEST)
        
        a.titulo=titulo
        
        try:
            a.save()
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Album.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Album.objects.filter(id=id).delete()
            return JsonResponse({"estado":"ok","mensaje":"eliminado correctamente"},status=HTTPStatus.OK)
        
        except Album.DoesNotExist:
            raise Http404