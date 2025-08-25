from django.urls import path
from .views import *

urlpatterns = [
    path('seguridad/registro',class1.as_view()),
    path('seguridad/verificacion/<str:token>',class2.as_view()),
    path('seguridad/login',class3.as_view()),
    path('seguridad/recuperar', RecuperarPassword.as_view()),
    path('seguridad/reset-password/<str:token>', ResetPassword.as_view()),
]