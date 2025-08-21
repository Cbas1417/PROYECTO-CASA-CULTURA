from django.db import models
from autoslug import AutoSlugField
from usuarios.models import Usuario

# Create your models here.

class Programa(models.Model):
    foto_programa=models.ImageField(upload_to='prog_forma/')
    titulo=models.CharField(max_length=100,null=True)
    slug = AutoSlugField(populate_from='titulo')
    descripcion=models.TextField(null=True)
    usuarios = models.ManyToManyField(Usuario, blank=True, related_name='programas')
    
    def __str__(self):
        return self.titulo

    class meta:
        db_table='programa'
        verbose_name='Programa'
        verbose_name_plural='Programas'     