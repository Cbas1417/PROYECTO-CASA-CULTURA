from django.urls import path
from .views import Dashboard, Detalle, estadisticas

urlpatterns = [
    path('', Dashboard.as_view()),
    path('<int:id>/', Detalle.as_view()),
    path('estadisticas/', estadisticas.as_view()),  # <-- nuevo endpoint
]
