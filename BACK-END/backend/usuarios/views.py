from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from http import HTTPStatus
from django.utils.text import slugify
from .models import *
from .serializers import *
from django.core.files.storage import FileSystemStorage
from datetime import datetime
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

# Create your views here.

class class1(APIView):

    def get(self, request):
        # data=Usuario.objects.order_by('-id').all()
        # serializer=UsuarioSerializer(data, many=True)
        # return JsonResponse ({"data":serializer.data})
        data = Usuario.objects.select_related("user").order_by('-id').all()
        lista = []
        for u in data:
            lista.append({
                "id": u.id,
                "nombre": u.nombre,
                "telefono": u.telefono,
                "correo": u.user.email,  
                "username": u.user.username
            })
        return JsonResponse({"data": lista})
    
    def post(self, request):
        tipo_documento = request.data.get('tipo_documento')
        numero_documento = request.data.get('numero_documento')
        nombre = request.data.get('nombre')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        correo = request.data.get('correo')
        telefono = request.data.get('telefono')
        password = request.data.get('contraseña')

        if not tipo_documento or not numero_documento or not nombre or not fecha_nacimiento or not correo or not telefono or not password:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=correo,
                email=correo,
                first_name=nombre,
                password=password,
                is_active=True  
            )

            Usuario.objects.create(
                user=user,
                tipo_documento=tipo_documento,
                numero_documento=numero_documento,
                nombre=nombre,
                fecha_nacimiento=fecha_nacimiento,
                correo=correo,
                telefono=telefono,
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
        password = request.data.get('contraseña')
        try:
            usuario = Usuario.objects.get(id=id)
        except Usuario.DoesNotExist:
            return JsonResponse(
                {"Estado": "Error", "Mensaje": "Usuario no encontrado"},
                status=HTTPStatus.NOT_FOUND)
        
        if not tipo_documento or not numero_documento or not nombre or not fecha_nacimiento or not correo or not telefono:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)
        
        try:
            # actualizar perfil
            usuario.tipo_documento = tipo_documento
            usuario.numero_documento = numero_documento
            usuario.nombre = nombre
            usuario.fecha_nacimiento = fecha_nacimiento
            usuario.correo = correo
            usuario.telefono = telefono
            usuario.save()

            # actualizar User si cambia correo o password
            user = usuario.user
            user.first_name = nombre
            user.email = correo
            user.username = correo
            if password:
                user.set_password(password)
            user.save()

            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Usuario.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            usuario=Usuario.objects.get(id=id)
            if usuario.user_id:  # revisa si realmente hay un user enlazado
                usuario.user.delete()  # esto también borra el Usuario por CASCADE
            else:
                usuario.delete()  # borra solo el perfil si no está enlazado
            return JsonResponse({"Estado":"Ok","Mensaje":"Eliminado correctamente"},status=HTTPStatus.OK)
        
        except Usuario.DoesNotExist:
            raise Http404
