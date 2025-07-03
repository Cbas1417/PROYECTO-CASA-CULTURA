from django.urls import path
from .views import Exposicions, ExposicionDetalle

urlpatterns = [
    path('', Exposicions.as_view(), name='lista_crear_exposiciones'),
    path('<int:id>/', ExposicionDetalle.as_view(), name='detalle_actualizar_eliminar_exposicion'),
]
# ese name en si es como opcional, sirve para redireccionar