from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from .models import Visita
from http import HTTPStatus
from django.db.models import Sum, Count
from datetime import datetime

class Dashboard(APIView):
    def get(self, request):
        data = Visita.objects.all().order_by('-anio', '-mes')
        visitas = [{"id": d.id, "mes": d.mes, "anio": d.anio, "visitas": d.visitas} for d in data]
        return JsonResponse({"data": visitas}, status=HTTPStatus.OK)

    def post(self, request):
        mes = request.data.get("mes")
        anio = request.data.get("anio")
        visitas = request.data.get("visitas")

        if not mes or not anio or visitas is None:
            return JsonResponse({"estado": "error", "mensaje": "Todos los campos son obligatorios"}, status=HTTPStatus.BAD_REQUEST)

        try:
            Visita.objects.create(mes=mes, anio=anio, visitas=visitas)
            return JsonResponse({"estado": "ok", "mensaje": "Registro creado correctamente"}, status=HTTPStatus.CREATED)
        except Exception as e:
            return JsonResponse({"estado": "error", "mensaje": f"No se pudo crear: {str(e)}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)

class Detalle(APIView):
    def get(self, request, id):
        try:
            visita = Visita.objects.get(id=id)
            data = {"id": visita.id, "mes": visita.mes, "anio": visita.anio, "visitas": visita.visitas}
            return JsonResponse({"data": data})
        except Visita.DoesNotExist:
            raise Http404

    def put(self, request, id):
        try:
            visita = Visita.objects.get(id=id)
        except Visita.DoesNotExist:
            raise Http404

        visita.mes = request.data.get("mes", visita.mes)
        visita.anio = request.data.get("anio", visita.anio)
        visita.visitas = request.data.get("visitas", visita.visitas)
        visita.save()
        return JsonResponse({"estado": "ok", "mensaje": "Actualizado correctamente"})

    def delete(self, request, id):
        try:
            visita = Visita.objects.get(id=id)
            visita.delete()
            return JsonResponse({"estado": "ok", "mensaje": "Eliminado correctamente"})
        except Visita.DoesNotExist:
            raise Http404

# Endpoint para estadísticas
class estadisticas(APIView):
    def get(self, request):
        visitas_totales = Visita.objects.aggregate(total=Sum("visitas"))["total"]
        visitas_por_anio = Visita.objects.values("anio").annotate(total=Sum("visitas")).order_by("anio")
        visitas_por_mes = Visita.objects.values("mes").annotate(total=Sum("visitas")).order_by("mes")

        return JsonResponse({
            "visitas_totales": visitas_totales or 0,
            "visitas_por_anio": list(visitas_por_anio),
            "visitas_por_mes": list(visitas_por_mes),
        }, status=HTTPStatus.OK)
