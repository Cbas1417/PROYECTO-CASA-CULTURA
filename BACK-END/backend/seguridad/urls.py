from django.urls import path
from .views import *

urlpatterns = [
    path('seguridad/registro',class1.as_view()),
    # path('inventario/put_delete/<int:id>',class2.as_view()),
]

