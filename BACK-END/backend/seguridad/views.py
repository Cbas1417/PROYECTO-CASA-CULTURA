from django.http.response import JsonResponse
from .models import *
from django.http import Http404, HttpResponseRedirect
from http import HTTPStatus
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import uuid
import os
from dotenv import load_dotenv
from contactos.utilidades import utilidades
from jose import jwt
from django.conf import settings
from datetime import datetime, timedelta
import time
from usuarios.models import Usuario
from django.contrib.auth.hashers import make_password
# Create your views here.

class class1(APIView):
    def post(self,request):
        tipo_documento = request.data.get("tipo_documento")
        documento = request.data.get("numero_documento")
        nombre = request.data.get("nombre")
        fecha = request.data.get("fecha_nacimiento")
        correo = request.data.get("correo")
        telefono = request.data.get("telefono")
        password = request.data.get("password")

        if not tipo_documento :
            return JsonResponse({"estado":"error","mensaje":"el campo tipo de documento es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not documento:
            return JsonResponse({"estado":"error","mensaje":"el campo documento es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not nombre :
            return JsonResponse({"estado":"error","mensaje":"el campo nombre es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not fecha:
            return JsonResponse({"estado":"error","mensaje":"el campo fecha es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not correo:
            return JsonResponse({"estado":"error","mensaje":"el campo E-mail es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not password:
            return JsonResponse({"estado":"error","mensaje":"el campo password es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if User.objects.filter(email=correo).exists():
            return JsonResponse({"estado":"error","mensaje":f"el correo {correo} no esta disponible"}, status=HTTPStatus.BAD_REQUEST)
        
        token=str(uuid.uuid4())
        url=f"{os.getenv("BASE_URL")}api/v1/seguridad/verificacion/{token}"
        print(url)
        
        u=User.objects.create_user(username=correo,
                                    password=password,
                                    email=correo,
                                    first_name=nombre,
                                    last_name="",
                                    is_active=0)
        UserMetadata.objects.create(token=token, user_id=u.id) 

        Usuario.objects.create(
            tipo_documento=tipo_documento,
            numero_documento=documento,
            fecha_nacimiento=fecha,
            telefono=telefono,
            correo=correo,
            contraseña=make_password(password)
        )

        try:
            html= f"""
                    <h1>Verificación de cuentas</h1>
                    Hola {nombre} te haz registrado exitosamente. Para activar tu cuenta
                    en el siguiente enlace:<br>
                    <a href="{url}">{url}</a>
                    <br>
                    O copia o pega el siguiente enlace en tu navegador favorito:
                    <br>
                    {url}
                    """
            
            utilidades.sendmail( html, "Verificación" , correo )
            
            return JsonResponse ({"estado":"ok","mensaje":"se creo exitosamente"}, status=HTTPStatus.CREATED)
        except Exception as e:
            return JsonResponse ({"estado":"error","mensaje":"ocurrio un error inesperado"}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):
    def get(self,request,token):
        if token==None or not token:
            return JsonResponse ({"estado":"error","mensaje":"recurso no disponible"}, status=404)
        try:
            data=UserMetadata.objects.filter(token=token).get()
            UserMetadata.objects.filter(token=token).update(token="")
            User.objects.filter(id=data.user_id).update(is_active=1)
            return JsonResponse({"estado": "OK", "mensaje": "cuenta verificada con éxito"}, status=200)
        except UserMetadata.DoesNotExist:
            raise Http404

class class3(APIView):
    def post(self,request):

        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo:
            return JsonResponse({"estado":"error","mensaje":"el campo e-mail es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not password:
            return JsonResponse({"estado":"error","mensaje":"el campo password es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        try:
            user=User.objects.filter(email=correo).get()
        except User.DoesNotExist:
            return JsonResponse({"estado":"error","mensaje":"Recusrso no disponible"},status=HTTPStatus.NOT_FOUND)
        
        auth=authenticate(request, username=correo, password=password)
        if auth is not None:
            #construimos token
            fecha=datetime.now()
            despues=fecha+timedelta(days=1)
            fecha_numero=int(datetime.timestamp(despues))
            payload = {"id":user.id,
                        "ISS":os.getenv("BASE_URL"),
                        "iat":int(time.time()),
                        "exp":int(fecha_numero)}
            try:
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS512")
                return JsonResponse ({"ID":user.id,"Nombre":user.first_name,"Token":token})
            except Exception as e:
                return JsonResponse({"estado":"error","mensaje":"ocurrio un error inesperado"},status=HTTPStatus.BAD_REQUEST)
        else:
            return JsonResponse({"estado":"error","mensaje":"las credenciales ingresadas no son correctas"},status=HTTPStatus.BAD_REQUEST)
