from django.db import models

class Exposicion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    tiempo = models.CharField(max_length=100)  # 30 minutos o así 

    def __str__(self):
        return self.nombre
    
    class meta:
        db_table='exposicion'
        verbose_name='Exposicion'
        verbose_name_plural='Exposiciones' 







