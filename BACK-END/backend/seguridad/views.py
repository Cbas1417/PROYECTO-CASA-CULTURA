from django.http.response import JsonResponse
from .models import *
from django.http import Http404
from http import HTTPStatus
from rest_framework.views import APIView
from django.contrib.auth.models import User
import uuid
import os
from dotenv import load_dotenv
from contactos.utilidades import utilidades
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
        url=f"{os.getenv("BASE_URL")}api/v1/verificacion/{token}"
        print(url)
        
        #try:
        u=User.objects.create_user(username=correo,
                                    password=password,
                                    email=correo,
                                    first_name=nombre,
                                    last_name="",
                                    is_active=0)
        UserMetadata.objects.create(token=token, user_id=u.id) 

        html= f"""
                <h1>Verificación de cuentas</h1>
                Hola {nombre} te haz registrado exitosamente. Para activar tu cuenta
                en el siguiente enlace:<br>
                <a href="{url}">{url}</a>
                </br>
                O copia o pega el siguiente enlace en tu navegador favorito:
                </br>
                {url}
                """
        
        utilidades.sendmail( html, "Verificación" , correo )
        

        return JsonResponse ({"Estado":"OK","Mensaje":"Se creo exitosamente"}, status=HTTPStatus.CREATED)

        #except Exception as e:
        #    return JsonResponse ({"Estado":"Error","Mensaje":"Ocurrio un error inesperado"}, status=HTTPStatus.BAD_REQUEST)

class class3(APIView):
    def post(self,request):

        correo = request.data.get("correo")
        password = request.data.get("password")

        if not correo:
            return JsonResponse({"Estado":"Error","Mensaje":"el campo E-mail es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        if not password:
            return JsonResponse({"Estado":"Error","Mensaje":"el campo password es obligatorio"},status=HTTPStatus.BAD_REQUEST)
        
        try:
            pass
        except User.DoesNotExist:
            return JsonResponse({"Estado":"error","mensaje":"el campo password es obligatorio"},status=HTTPStatus.NOT_FOUND)
