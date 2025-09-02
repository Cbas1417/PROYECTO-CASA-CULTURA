from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Exposicion
from .serializers import ExposicionSerializer
from django.http import JsonResponse, Http404
from .models import Exposicion
from http import HTTPStatus

# Create your views here.
class class1(APIView):

    def get(self,request):
        data=Exposicion.objects.order_by('-id').all()
        serializer=ExposicionSerializer(data, many=True, context={'request': request})
        return JsonResponse ({"data":serializer.data})
    
    def post(self, request):
        titulo = request.data.get('titulo')
        autor = request.data.get('autor')
        descripcion = request.data.get('descripcion')
        imagen = request.FILES.get('imagen')
        video = request.data.get('video')

        if not titulo or not autor or not descripcion:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)

        if not imagen:
            return JsonResponse({"Estado": "Error", "Mensaje": "Tiene que haber una imagen"}, status=HTTPStatus.BAD_REQUEST)

        try:
            nuevo = Exposicion.objects.create(
                                                titulo=titulo,
                                                autor=autor,
                                                descripcion=descripcion,
                                                imagen=imagen,
                                                video=video
            )
            return JsonResponse({"Estado": "Ok", "Mensaje": "Registro creado correctamente"})
        except Exception as e:
            return JsonResponse({"Estado": "Error", "Mensaje": str(e)}, status=HTTPStatus.BAD_REQUEST)

class class2(APIView):

    def put(self,request,id):
        titulo = request.data.get('titulo')
        autor = request.data.get('autor')
        descripcion = request.data.get('descripcion')
        imagen = request.FILES.get('imagen')
        video = request.data.get('video')
        try:
            producto = Exposicion.objects.get(id=id)
        except:
            raise Http404("Producto no encontrado")
        
        if not titulo or not autor or not descripcion:
            return JsonResponse({"Estado": "Error", "Mensaje": "Todos los campos tiene  que estar llenos"}, status=HTTPStatus.BAD_REQUEST)
        
        
        producto.titulo=titulo
        producto.autor=autor
        producto.descripcion=descripcion
        producto.video=video
        
        if imagen:
            if producto.imagen:
                producto.imagen.delete(save=False)
            producto.imagen = imagen
        
        try:
            producto.save()
            return JsonResponse({"Estado":"Ok","Mensaje":"Se modifico el elemento correctamente"},
                status=HTTPStatus.OK)
        except Exposicion.DoesNotExist:
            raise Http404

    def delete(self,request,id):
        try:
            Exposicion.objects.filter(id=id).delete()
            return JsonResponse({"estado":"ok","mensaje":"eliminado correctamente"},status=HTTPStatus.OK)
        
        except Exposicion.DoesNotExist:
            raise Http404