from django.urls import path
from .views import UsuarioView, UsuarioDetailView, UsuarioByUserView

urlpatterns = [
    path('usuarios/', UsuarioView.as_view()),  # GET y POST
    path('usuarios/<int:id>/', UsuarioDetailView.as_view()),  # PUT y DELETE
    path("usuarios/by-user/<int:user_id>/", UsuarioByUserView.as_view()),
]

