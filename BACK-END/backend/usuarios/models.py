from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth.models import User

# Create your models here.

from django.db import models

class Usuario(models.Model):
    tipos_documento = [
        ('cc', 'Cédula de Ciudadanía'),
        ('ti', 'Tarjeta de Identidad'),
        ('ce', 'Cédula de Extranjería'),
        ('pas', 'Pasaporte'),
        ('nit', 'NIT'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil",blank=True, null=True)
    tipo_documento = models.CharField(max_length=3, choices=tipos_documento, default='cc')
    numero_documento = models.CharField(max_length=100, verbose_name="Número de documento")
    nombre = models.CharField(max_length=50, verbose_name="Nombre de usuario")
    slug = AutoSlugField(populate_from='nombre', unique=True, blank=True, null=True)
    fecha_nacimiento = models.DateField(verbose_name="Fecha de nacimiento")
    correo = models.EmailField()
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.nombre} ({self.tipo_documento})"

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'