from django.urls import path
from .views import SlideView, SlideDetalle

urlpatterns = [
    path('', SlideView.as_view()),
    path('<int:id>/', SlideDetalle.as_view()),
]
