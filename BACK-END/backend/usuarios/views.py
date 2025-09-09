from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from http import HTTPStatus
from .models import Usuario
from django.contrib.auth.models import User


class UsuarioView(APIView):
    # GET y POST en la misma vista
    def get(self, request):
        data = Usuario.objects.select_related("user").order_by("-id").all()
        lista = []
        for u in data:
            lista.append({
                "id": u.id,
                "tipo_documento": u.tipo_documento,
                "numero_documento": u.numero_documento,
                "nombre": u.nombre,
                "fecha_nacimiento": str(u.fecha_nacimiento),
                "correo": u.user.email if u.user else u.correo,
                "telefono": u.telefono,
            })
        return JsonResponse({"data": lista})

    def post(self, request):
        tipo_documento = request.data.get('tipo_documento')
        numero_documento = request.data.get('numero_documento')
        nombre = request.data.get('nombre')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        correo = request.data.get('correo')
        telefono = request.data.get('telefono')
        password = request.data.get('password') 

        if not all([tipo_documento, numero_documento, nombre, fecha_nacimiento, correo, telefono, password]):
            return JsonResponse(
                {"Estado": "Error", "Mensaje": "Todos los campos son obligatorios"},
                status=HTTPStatus.BAD_REQUEST
            )

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


class UsuarioDetailView(APIView):

    # GET (obtener un usuario por id)
    def get(self, request, id):
        try:
            usuario = Usuario.objects.get(id=id)
        except Usuario.DoesNotExist:
            return JsonResponse(
                {"Estado": "Error", "Mensaje": "Usuario no encontrado"},
                status=HTTPStatus.NOT_FOUND
            )

        data = {
            "id": usuario.id,
            "tipo_documento": usuario.tipo_documento,
            "numero_documento": usuario.numero_documento,
            "nombre": usuario.nombre,
            "fecha_nacimiento": str(usuario.fecha_nacimiento),
            "correo": usuario.user.email if usuario.user else usuario.correo,
            "telefono": usuario.telefono,
        }
        return JsonResponse(data)
    
    # PUT
    def put(self, request, id):
        try:
            usuario = Usuario.objects.get(id=id)
        except Usuario.DoesNotExist:
            return JsonResponse({"Estado": "Error", "Mensaje": "Usuario no encontrado"}, status=HTTPStatus.NOT_FOUND)

        tipo_documento = request.data.get('tipo_documento')
        numero_documento = request.data.get('numero_documento')
        nombre = request.data.get('nombre')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        correo = request.data.get('correo')
        telefono = request.data.get('telefono')
        password = request.data.get('password')  # 👈 corregido

        if not all([tipo_documento, numero_documento, nombre, fecha_nacimiento, correo, telefono]):
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos son obligatorios"}, status=HTTPStatus.BAD_REQUEST)

        try:
            # actualizar Usuario
            usuario.tipo_documento = tipo_documento
            usuario.numero_documento = numero_documento
            usuario.nombre = nombre
            usuario.fecha_nacimiento = fecha_nacimiento
            usuario.correo = correo
            usuario.telefono = telefono
            usuario.save()

            # actualizar auth_user
            user = usuario.user
            user.first_name = nombre
            user.email = correo
            user.username = correo
            if password:
                user.set_password(password)
            user.save()

            return JsonResponse({"Estado": "Ok", "Mensaje": "Se modificó correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

    # DELETE
    def delete(self, request, id):
        try:
            usuario = Usuario.objects.get(id=id)
            if usuario.user_id:
                usuario.user.delete()
            else:
                usuario.delete()
            return JsonResponse({"Estado": "Ok", "Mensaje": "Eliminado correctamente"})
        except Usuario.DoesNotExist:
            return JsonResponse({"Estado": "Error", "Mensaje": "Usuario no encontrado"}, status=HTTPStatus.NOT_FOUND)

class UsuarioByUserView(APIView):
    def get(self, request, user_id):
        try:
            usuario = Usuario.objects.get(user_id=user_id)
        except Usuario.DoesNotExist:
            return JsonResponse(
                {"Estado": "Error", "Mensaje": "Usuario no encontrado"},
                status=HTTPStatus.NOT_FOUND
            )

        data = {
            "id": usuario.id,  # id del Usuario (pk real)
            "tipo_documento": usuario.tipo_documento,
            "numero_documento": usuario.numero_documento,
            "nombre": usuario.nombre,
            "fecha_nacimiento": str(usuario.fecha_nacimiento),
            "correo": usuario.user.email if usuario.user else usuario.correo,
            "telefono": usuario.telefono,
            "user_id": usuario.user.id  # por si necesitas ambos
        }
        return JsonResponse(data)