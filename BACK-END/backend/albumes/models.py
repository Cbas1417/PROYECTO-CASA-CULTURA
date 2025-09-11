from django.db import models
from autoslug import AutoSlugField

# Create your models here.

class Album(models.Model):
    titulo = models.CharField(max_length=100, null=False, blank=False)

    class Meta:
        db_table='album'
        verbose_name='Album'
        verbose_name_plural='Albumes'