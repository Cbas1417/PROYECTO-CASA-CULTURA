from rest_framework.views import APIView
from django.http import JsonResponse
from .models import Exposicion
from .serializers import ExposicionSerializer
from http import HTTPStatus
from django.http import Http404

class Exposicions(APIView):

    def get(self, request):
        exposiciones = Exposicion.objects.order_by('-id').all()
        data = ExposicionSerializer(exposiciones, many=True)
        return JsonResponse({"data": data.data}, status=HTTPStatus.OK)

    def post(self, request):
        campos = ["nombre", "descripcion", "tiempo"]
        for campo in campos:
            if not request.data.get(campo):
                return JsonResponse(
                    {"estado": "error", "mensaje": f"El campo {campo} es obligatorio"},
                    status=HTTPStatus.BAD_REQUEST
                )
        
        serializer = ExposicionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"estado": "ok", "mensaje": "Exposición creada correctamente"}, status=HTTPStatus.CREATED)
        return JsonResponse(serializer.errors, status=HTTPStatus.BAD_REQUEST)

class ExposicionDetalle(APIView):

    def get(self, request, id):
        try:
            exposicion = Exposicion.objects.get(id=id)
        except Exposicion.DoesNotExist:
            return JsonResponse({"estado": "error", "mensaje": "No encontrada"}, status=HTTPStatus.NOT_FOUND)
        
        serializer = ExposicionSerializer(exposicion)
        return JsonResponse({"data": serializer.data}, status=HTTPStatus.OK)

    def put(self, request, id):
        try:
            exposicion = Exposicion.objects.get(id=id)
        except Exposicion.DoesNotExist:
            raise Http404

        campos = ["nombre", "descripcion", "tiempo"]
        for campo in campos:
            if not request.data.get(campo):
                return JsonResponse(
                    {"estado": "error", "mensaje": f"El campo {campo} es obligatorio"},
                    status=HTTPStatus.BAD_REQUEST
                )
        
        serializer = ExposicionSerializer(exposicion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"estado": "ok", "mensaje": "Exposición actualizada"}, status=HTTPStatus.OK)
        return JsonResponse(serializer.errors, status=HTTPStatus.BAD_REQUEST)

    def delete(self, request, id):
        try:
            exposicion = Exposicion.objects.get(id=id)
        except Exposicion.DoesNotExist:
            raise Http404
        
        exposicion.delete()
        return JsonResponse({"estado": "ok", "mensaje": "Exposición eliminada"}, status=HTTPStatus.OK)
