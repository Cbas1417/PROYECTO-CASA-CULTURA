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
from seguridad.decorators import logueado
import os
from contactos.utilidades import utilidades

class class1(APIView):
    @logueado()
    def get(self, request):
        data = Programa.objects.order_by('-id').all()
        serializer = ProgramaSerializer(data, many=True)
        return JsonResponse({"data": serializer.data}, status=HTTPStatus.OK)

    @logueado()
    def post(self, request):
        titulo = request.data.get('titulo')
        descripcion = request.data.get('descripcion')
        foto_programa = request.FILES.get('foto_programa')

        if not titulo or not descripcion:
            return JsonResponse(
                {"estado": "error", "mensaje": "Todos los campos tienen que estar llenos"},
                status=HTTPStatus.BAD_REQUEST,
            )
        if not foto_programa:
            return JsonResponse(
                {"estado": "error", "mensaje": "Tiene que existir una imagen"},
                status=HTTPStatus.BAD_REQUEST,
            )

        # Validar tipo de archivo imagen (opcinal)
        if foto_programa.content_type not in ["image/jpeg", "image/png"]:
            return JsonResponse(
                {"estado": "error", "mensaje": "La imagen debe ser JPG o PNG"},
                status=HTTPStatus.BAD_REQUEST,
            )

        try:
            # Guardar archivo con FileSystemStorage si quieres controlar la ruta
            # Pero si usas ImageField en el modelo, Django lo gestiona automáticamente.
            nuevo = Programa.objects.create(
                titulo=titulo,
                descripcion=descripcion,
                foto_programa=foto_programa,
            )
            return JsonResponse({"estado": "ok", "mensaje": "Registro creado correctamente"}, status=HTTPStatus.CREATED)
        except Exception as e:
            return JsonResponse(
                {"estado": "error", "mensaje": f"Error creando el registro: {str(e)}"},
                status=HTTPStatus.BAD_REQUEST,
            )


class class2(APIView):
    @logueado()
    def put(self, request, id):
        titulo = request.data.get('titulo')
        descripcion = request.data.get('descripcion')
        foto_programa = request.FILES.get('foto_programa')

        try:
            programa = Programa.objects.get(id=id)
        except Programa.DoesNotExist:
            return JsonResponse(
                {"estado": "error", "mensaje": "El programa no existe"},
                status=HTTPStatus.NOT_FOUND,
            )

        if not titulo or not descripcion:
            return JsonResponse(
                {"estado": "error", "mensaje": "Todos los campos tienen que estar llenos"},
                status=HTTPStatus.BAD_REQUEST,
            )
        if not foto_programa:
            return JsonResponse(
                {"estado": "error", "mensaje": "Tiene que haber una imagen"},
                status=HTTPStatus.BAD_REQUEST,
            )

        # Validar tipo de archivo imagen
        if foto_programa.content_type not in ["image/jpeg", "image/png"]:
            return JsonResponse(
                {"estado": "error", "mensaje": "La imagen debe ser JPG o PNG"},
                status=HTTPStatus.BAD_REQUEST,
            )

        try:
            # Eliminar foto anterior si existe para evitar acumulación
            if programa.foto_programa and os.path.isfile(programa.foto_programa.path):
                os.remove(programa.foto_programa.path)

            programa.titulo = titulo
            programa.descripcion = descripcion
            programa.foto_programa = foto_programa
            programa.save()
            return JsonResponse(
                {"estado": "ok", "mensaje": "Se modificó el elemento correctamente"},
                status=HTTPStatus.OK,
            )
        except Exception as e:
            return JsonResponse(
                {"estado": "error", "mensaje": f"Error modificando el registro: {str(e)}"},
                status=HTTPStatus.BAD_REQUEST,
            )

    @logueado()
    def delete(self, request, id):
        try:
            programa = Programa.objects.get(id=id)

            # Eliminar foto antes de borrar el registro
            if programa.foto_programa and os.path.isfile(programa.foto_programa.path):
                os.remove(programa.foto_programa.path)

            programa.delete()
            return JsonResponse(
                {"estado": "ok", "mensaje": "Eliminado correctamente"},
                status=HTTPStatus.OK,
            )
        except Programa.DoesNotExist:
            return JsonResponse(
                {"estado": "error", "mensaje": "El programa no existe"},
                status=HTTPStatus.NOT_FOUND,
            )
        except Exception as e:
            return JsonResponse(
                {"estado": "error", "mensaje": f"Error eliminando el registro: {str(e)}"},
                status=HTTPStatus.BAD_REQUEST,
            )
        


#correo
class class3(APIView):
    def post(self,request):
        correo = request.data.get("correo")
        
        
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
            correo=correo,
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