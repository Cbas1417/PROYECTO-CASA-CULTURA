from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

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

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
