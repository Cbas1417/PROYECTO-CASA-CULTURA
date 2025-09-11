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
        data=Fotos.objects.order_by('-id').all()
        serializer=FotosSerializer(data, many=True, context={'request': request})
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        imagen = request.FILES.get('imagen')

        if not imagen:
            return JsonResponse({"Estado": "Error", "Mensaje": "Es obligatorio que haya una foto"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Fotos.objects.create(
                                        imagen=imagen
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):

    def put(self,request,id):
        imagen = request.FILES.get('imagen')
        try:
            a = Fotos.objects.get(id=id)
        except:
            raise Http404("Producto no encontrado")
        
        if not imagen:
            return JsonResponse({"Estado": "Error", "Mensaje": "Es obligatorio que haya una foto"}, status=HTTPStatus.BAD_REQUEST)
        
        a.imagen=imagen
        
        try:
            a.save()
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Fotos.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Fotos.objects.filter(id=id).delete()
            return JsonResponse({"estado":"ok","mensaje":"eliminado correctamente"},status=HTTPStatus.OK)
        
        except Fotos.DoesNotExist:
            raise Http404