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
        data=Programa.objects.order_by('-id').all()
        serializer=ProgramaSerializer(data, many=True)
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        titulo = request.data.get('titulo')
        descripcion = request.data.get('descripcion')
        foto_programa = request.FILES.get('foto_programa')

        if not titulo or not descripcion:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)

        if not foto_programa:
            return JsonResponse({"Estado": "Error", "Mensaje": "Tiene que haber una imagen"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Programa.objects.create(
                                                titulo=titulo,
                                                descripcion=descripcion,
                                                foto_programa=foto_programa
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):

    def put(self,request,id):
        titulo = request.data.get('titulo')
        descripcion = request.data.get('descripcion')
        foto_programa = request.FILES.get('foto_programa')
        try:
            data=Programa.objects.filter(id=id).get
        except:
            raise Http404
        
        if not titulo or not descripcion or not descripcion:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)
        
        if not foto_programa:
            return JsonResponse({"Estado": "Error", "Mensaje": "Tiene que haber una imagen"}, status=HTTPStatus.BAD_REQUEST)
        
        try:
            Programa.objects.filter(id=id).update(titulo=titulo,
                                                descripcion=descripcion,
                                                foto_programa=foto_programa)
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Programa.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Programa.objects.filter(id=id).delete()
            return JsonResponse({"estado":"ok","mensaje":"eliminado correctamente"},status=HTTPStatus.OK)
        
        except Programa.DoesNotExist:
            raise Http404