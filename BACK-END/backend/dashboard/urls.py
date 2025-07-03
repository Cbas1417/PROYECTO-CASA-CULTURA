from django.urls import path
from .views import DashboardAPIView, DashboardDetalleAPIView

urlpatterns = [
    path('dashboard/get_post', DashboardAPIView.as_view()),
    path('dashboard/put_delete/<int:id>', DashboardDetalleAPIView.as_view()),
]
