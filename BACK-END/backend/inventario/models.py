from django.db import models
from autoslug import AutoSlugField
from exposiciones.models import Exposicion
from usuarios.models import Usuario

# Create your models here.

class Inventario(models.Model):
    exposicion = models.ForeignKey(Exposicion, on_delete=models.SET_NULL, null=True, blank=True)
    imagen=models.ImageField(upload_to='inventario/', null=True, blank=True)
    nombre=models.CharField(max_length=100,null=True)
    slug = AutoSlugField(populate_from='nombre')
    cantidad=models.IntegerField(null=True)
    descripcion=models.TextField(null=True)
    creado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.nombre
    
    class meta:
        db_table='inventario'
        verbose_name='Inventario'
        verbose_name_plural='inventarios'