from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from http import HTTPStatus
from .models import *

class class1(APIView):
    def get(self,request):
        pass