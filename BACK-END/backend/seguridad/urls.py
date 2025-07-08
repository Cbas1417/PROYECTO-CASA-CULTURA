from django.urls import path
from .views import *

urlpatterns = [
    path('seguridad/registro',class1.as_view()),
    #path('seguridad/verificacion/<int:token>',class2.as_view()),}
    path('seguridad/login',class3.as_view())
]

