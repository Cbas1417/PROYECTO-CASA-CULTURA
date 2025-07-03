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

    def get(self, request):
        data=Usuario.objects.order_by('-id').all()
        serializer=UsuarioSerializer(data, many=True)
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        tipo_documento = request.data.get('tipo_documento')
        numero_documento = request.data.get('numero_documento')
        nombre = request.data.get('nombre')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        correo = request.data.get('correo')
        telefono = request.data.get('telefono')
        contraseña = request.data.get('contraseña')

        if not tipo_documento or not numero_documento or not nombre or not fecha_nacimiento or not correo or not telefono or not contraseña:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Usuario.objects.create(
                                                tipo_documento=tipo_documento,
                                                numero_documento=numero_documento,
                                                nombre=nombre,
                                                fecha_nacimiento=fecha_nacimiento,
                                                correo=correo,
                                                telefono=telefono,
                                                contraseña=contraseña
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        
        except Exception as e:

            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)
        

class class2(APIView):

    def put(self,request,id):
        tipo_documento = request.data.get('tipo_documento')
        numero_documento = request.data.get('numero_documento')
        nombre = request.data.get('nombre')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        correo = request.data.get('correo')
        telefono = request.data.get('telefono')
        contraseña = request.data.get('contraseña')
        try:
            data=Usuario.objects.filter(id=id).get
        except:
            raise Http404
        
        if not tipo_documento or not numero_documento or not nombre or not fecha_nacimiento or not correo or not telefono or not contraseña:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)
        
        try:
            Usuario.objects.filter(id=id).update(
                                                tipo_documento=tipo_documento,
                                                numero_documento=numero_documento,
                                                nombre=nombre,
                                                fecha_nacimiento=fecha_nacimiento,
                                                correo=correo,
                                                telefono=telefono,
                                                contraseña=contraseña
                                                )
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Usuario.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Usuario.objects.filter(id=id).delete()
            return JsonResponse({"Estado":"Ok","Mensaje":"Eliminado correctamente"},status=HTTPStatus.OK)
        
        except Usuario.DoesNotExist:
            raise Http404
