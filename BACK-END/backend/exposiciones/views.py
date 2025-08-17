from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Exposicion
from .serializers import ExposicionSerializer
from django.http import Http404

class ExposicionList(APIView):
    def get(self, request):
        exposiciones = Exposicion.objects.order_by('-id')
        serializer = ExposicionSerializer(exposiciones, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = ExposicionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExposicionDetail(APIView):
    def get_object(self, pk):
        try:
            return Exposicion.objects.get(pk=pk)
        except Exposicion.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        exposicion = self.get_object(pk)
        serializer = ExposicionSerializer(exposicion, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        exposicion = self.get_object(pk)
        serializer = ExposicionSerializer(exposicion, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        exposicion = self.get_object(pk)
        exposicion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
