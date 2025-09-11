from django.db import models
from autoslug import AutoSlugField
from albumes.models import Album

# Create your models here.

class Fotos(models.Model):
    album =  models.ForeignKey(Album, on_delete=models.CASCADE, null=False, blank=False)
    imagen = models.ImageField(upload_to='fotos_galeria/', null=False, blank=False)

    class Meta:
        db_table='foto'
        verbose_name='Foto'
        verbose_name_plural='Fotos'