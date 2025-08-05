from django.db import models

class Visita(models.Model):
    mes = models.CharField(max_length=20)
    anio = models.IntegerField()
    visitas = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.mes} {self.anio}: {self.visitas} visitas"
