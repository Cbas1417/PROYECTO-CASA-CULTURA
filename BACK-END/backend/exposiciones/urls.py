from django.urls import path
from .views import ExposicionList, ExposicionDetail

urlpatterns = [
    path('exposiciones/', ExposicionList.as_view(), name="exposiciones-list"),
    path('exposiciones/<int:pk>/', ExposicionDetail.as_view(), name="exposiciones-detail"),
]
