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
        data=Inventario.objects.order_by('-id').all()
        serializer=InventarioSerializer(data, many=True, context={'request': request})
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        nombre = request.data.get('nombre')
        cantidad = request.data.get('cantidad')
        descripcion = request.data.get('descripcion')
        imagen = request.FILES.get('imagen')

        if not nombre or not cantidad or not descripcion:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)

        if not imagen:
            return JsonResponse({"Estado": "Error", "Mensaje": "Tiene que haber una imagen"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Inventario.objects.create(
                                                nombre=nombre,
                                                cantidad=cantidad,
                                                descripcion=descripcion,
                                                imagen=imagen
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):

    def put(self,request,id):
        nombre = request.data.get('nombre')
        cantidad = request.data.get('cantidad')
        descripcion = request.data.get('descripcion')
        imagen = request.FILES.get('imagen')
        try:
            producto = Inventario.objects.get(id=id)
        except:
            raise Http404("Producto no encontrado")
        
        if not nombre or not cantidad or not descripcion:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)
        
        
        producto.nombre=nombre
        producto.cantidad=cantidad
        producto.descripcion=descripcion
        
        if imagen:
            if producto.imagen:
                producto.imagen.delete(save=False)
            producto.imagen = imagen
        
        try:
            producto.save()
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Inventario.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Inventario.objects.filter(id=id).delete()
            return JsonResponse({"estado":"ok","mensaje":"eliminado correctamente"},status=HTTPStatus.OK)
        
        except Inventario.DoesNotExist:
            raise Http404