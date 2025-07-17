from django.db import models
from autoslug import AutoSlugField

# Create your models here.

from django.db import models

class Usuario(models.Model):
    tipos_documento= [
        ('cc', 'Cédula de Ciudadanía'),
        ('ti', 'Tarjeta de Identidad'),
        ('ce', 'Cédula de Extranjería'),
        ('pas', 'Pasaporte'),
        ('nit', 'NIT'),
    ]

    tipo_documento = models.CharField(max_length=3,choices=tipos_documento,default='cc', blank=False, null=False)
    numero_documento= models.CharField(max_length=100, blank=False, null=False,verbose_name="Numero de documento")
    nombre= models.CharField(max_length=50, blank=False, null=False, verbose_name="Nombre de usuario")
    slug = AutoSlugField(populate_from='nombre', null=True)
    fecha_nacimiento=models.DateField(blank=False, null=False, verbose_name="Fecha de nacimiento")
    correo=models.EmailField(blank=False, null=False)
    telefono=models.CharField(max_length=20, blank=False, null=False)
    contraseña = models.CharField(max_length=100, blank=False, null=False)

    def __str__(self):
        return f"{self.nombre} ({self.tipo_documento})"
    

    class Meta:
        db_table='usuario'
        verbose_name='Usuario'
        verbose_name_plural='Usuarios'