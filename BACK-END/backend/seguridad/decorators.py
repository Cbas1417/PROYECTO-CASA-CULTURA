#codigo de juan mi apa, el otro no lo borren por ak 
from functools import wraps
from django.http import JsonResponse
from http import HTTPStatus
from django.conf import settings
from jose import jwt
import time

def logueado():
    def metodo(func):
        @wraps(func)
        def _decorador(*args, **kwargs):
            #args[0] =self (la vista)
            #args[1] = request
            request = args[1]

            token_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')

            if not token_header:
                return JsonResponse(
                    {"estado": "error", "mensaje": "sin autorizacion"},
                    status=HTTPStatus.UNAUTHORIZED
                )
            
            header = token_header.split(" ")
            if len(header) != 2 or header[0] != "Bearer":
                return JsonResponse(
                    {"estado": "error", "mensaje": "formato invalido de token"},
                    status=HTTPStatus.UNAUTHORIZED
                )
            
            token = header[1]

            try:
                datos_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS512'])
            except Exception as e: 
                print("Error al codificar token:", str(e))
                return JsonResponse(
                    {"estado": "error", "mensaje": "token invalido"},
                    status=HTTPStatus.UNAUTHORIZED
                )
            
            if int(datos_token.get("exp", 0))> int(time.time()):
                return func(*args, **kwargs)
            else:
                return JsonResponse(
                    {"estado": "error", "mensaje": "token expirado"},
                    status=HTTPStatus.UNAUTHORIZED
                )
        return _decorador
    return metodo