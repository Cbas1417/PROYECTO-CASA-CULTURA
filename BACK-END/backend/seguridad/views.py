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
# Create your views here.

class class1(APIView):
    def post(self,request):
        nombre = request.data.get("nombre")
        correo = request.data.get("correo")
        password = request.data.get("password")

        if not nombre :
            return JsonResponse({"estado":"error","mensaje":"el campo nombre es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not correo:
            return JsonResponse({"estado":"error","mensaje":"el campo E-mail es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not password:
            return JsonResponse({"estado":"error","mensaje":"el campo password es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if User.objects.filter(email=correo).exists():
            return JsonResponse({"Estado":"Error","Mensaje":f"El correo {correo} no esta disponible"}, status=HTTPStatus.BAD_REQUEST)
        
        token=str(uuid.uuid4())
        url=f"{os.getenv("BASE_URL")}api/v1/seguridad/verificacion/{token}"
        print(url)
        
        #try:
        u=User.objects.create_user(username=correo,
                                    password=password,
                                    email=correo,
                                    first_name=nombre,
                                    last_name="",
                                    is_active=0)
        UserMetadata.objects.create(token=token, user_id=u.id) 

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
            
            return JsonResponse ({"Estado":"OK","Mensaje":"Se creo exitosamente"}, status=HTTPStatus.CREATED)
        except Exception as e:
            return JsonResponse ({"Estado":"Error","Mensaje":"Ocurrio un error inesperado"}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):
    def get(self,request,token):
        if token==None or not token:
            return JsonResponse ({"Estado":"Error","Mensaje":"Recurso no disponible"}, status=404)
        try:
            data=UserMetadata.objects.filter(token=token).get()
            UserMetadata.objects.filter(token=token).update(token="")
            User.objects.filter(id=data.user_id).update(is_active=1)
            return JsonResponse({"Estado": "OK", "Mensaje": "Cuenta verificada con éxito"}, status=200)
        except UserMetadata.DoesNotExist:
            raise Http404

class class3(APIView):
    def post(self,request):

        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo:
            return JsonResponse({"Estado":"Error","Mensaje":"el campo E-mail es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not password:
            return JsonResponse({"Estado":"Error","Mensaje":"el campo password es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        try:
            user=User.objects.filter(email=correo).get()
        except User.DoesNotExist:
            return JsonResponse({"Estado":"error","mensaje":"Recusrso no disponible"},status=HTTPStatus.NOT_FOUND)
        
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
                return JsonResponse({"Estado":"error","mensaje":"Ocurrio un error inesperado"},status=HTTPStatus.BAD_REQUEST)
        else:
            return JsonResponse({"Estado":"error","mensaje":"Las credenciales ingresadas no son correctas"},status=HTTPStatus.BAD_REQUEST)
