from django.urls import path
from .views import *

urlpatterns = [
    path('usuarios/get_post',class1.as_view()),
    path('usuarios/put_delete/<int:id>',class2.as_view()),
]


