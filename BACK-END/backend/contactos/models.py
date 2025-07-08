from django.db import models

class Contacto(models.Model):
    nombre= models.CharField(max_length=100, blank=True, null=True)
    correo= models.CharField(max_length=100, blank=True, null=True)
    telefono= models.CharField(max_length=100, blank=True, null=True)
    mensaje=models.TextField()
    fecha=models.DateTimeField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre
    
    class Meta:
        db_table='contacto'
        verbose_name='contacto'
        verbose_name_plural='contactos'