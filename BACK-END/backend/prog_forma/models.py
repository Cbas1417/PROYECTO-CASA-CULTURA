from django.db import models
from autoslug import AutoSlugField
from usuarios.models import Usuario

class Programa(models.Model):
    CATEGORIA_CHOICES = [
        ('ece', 'Artes escénicas'),
        ('visu', 'Artes visuales'),
    ]
    
    foto_programa = models.ImageField(upload_to='prog_forma/')
    titulo = models.CharField(max_length=100, null=True)
    slug = AutoSlugField(populate_from='titulo')
    descripcion = models.TextField(null=True)
    categoria = models.CharField(max_length=4, choices=CATEGORIA_CHOICES, default='ece')
    usuarios = models.ManyToManyField(Usuario, blank=True, related_name='programas')
    
    def __str__(self):
        return self.titulo

    class Meta:
        db_table = 'programa'
        verbose_name = 'Programa'
        verbose_name_plural = 'Programas'