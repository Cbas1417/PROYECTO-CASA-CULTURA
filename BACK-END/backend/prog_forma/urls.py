from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from .views import ProgramasListCreateView, ProgramasUpdateDeleteView, InscripcionPrograma


urlpatterns = [
    path('prog_forma/get_post',class1.as_view()),
    path('prog_forma/put_delete/<int:id>',class2.as_view()),
    path('programas/<int:id>/inscribir/', InscripcionPrograma.as_view(), name='programa_inscribir'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)