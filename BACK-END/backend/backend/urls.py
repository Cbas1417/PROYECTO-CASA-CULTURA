from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('dashboard.urls')),
    path('api/v1/', include('exposiciones.urls')),
    path('api/v1/', include('inventario.urls')),
    path('api/v1/', include('prog_forma.urls')),
    path('api/v1/', include('slides.urls')),
    path('api/v1/', include('usuarios.urls')),
    path('api/v1/', include('seguridad.urls')),
]


