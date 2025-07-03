from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from .models import DashboardVisita
from datetime import datetime
from http import HTTPStatus

class DashboardAPIView(APIView):

    def get(self, request):
        data = DashboardVisita.objects.all().order_by('-anio', '-mes')
        visitas = [{"id": d.id, "mes": d.mes, "anio": d.anio, "visitas": d.visitas} for d in data]
        return JsonResponse({"data": visitas}, status=HTTPStatus.OK)

    def post(self, request):
        mes = request.data.get("mes")
        anio = request.data.get("anio")
        visitas = request.data.get("visitas")

        if not mes or not anio or visitas is None:
            return JsonResponse({"estado": "error", "mensaje": "Todos los campos son obligatorios"}, status=HTTPStatus.BAD_REQUEST)

        try:
            DashboardVisita.objects.create(mes=mes, anio=anio, visitas=visitas)
            return JsonResponse({"estado": "ok", "mensaje": "Registro creado correctamente"}, status=HTTPStatus.CREATED)
        except Exception:
            return JsonResponse({"estado": "error", "mensaje": "No se pudo crear"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)

class DashboardDetalleAPIView(APIView):

    def get(self, request, id):
        try:
            visita = DashboardVisita.objects.get(id=id)
            data = {"id": visita.id, "mes": visita.mes, "anio": visita.anio, "visitas": visita.visitas}
            return JsonResponse({"data": data})
        except DashboardVisita.DoesNotExist:
            raise Http404

    def put(self, request, id):
        try:
            visita = DashboardVisita.objects.get(id=id)
        except DashboardVisita.DoesNotExist:
            raise Http404

        visita.mes = request.data.get("mes", visita.mes)
        visita.anio = request.data.get("anio", visita.anio)
        visita.visitas = request.data.get("visitas", visita.visitas)
        visita.save()
        return JsonResponse({"estado": "ok", "mensaje": "Actualizado correctamente"})

    def delete(self, request, id):
        try:
            visita = DashboardVisita.objects.get(id=id)
            visita.delete()
            return JsonResponse({"estado": "ok", "mensaje": "Eliminado correctamente"})
        except DashboardVisita.DoesNotExist:
            raise Http404
