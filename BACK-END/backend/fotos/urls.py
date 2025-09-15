from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("fotos/", FotosListCreate.as_view(), name="fotos-list-create"),
    path("fotos/<int:id>/", FotosDetail.as_view(), name="fotos-detail"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)