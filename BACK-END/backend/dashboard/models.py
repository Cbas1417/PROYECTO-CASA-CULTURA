from django.db import models
from usuarios.models import Usuario

class DashboardVisita(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    mes = models.CharField(max_length=20)
    anio = models.IntegerField()
    visitas = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.mes} {self.anio}: {self.visitas} visitas"
    
    class meta:
        db_table='dashboard'
        verbose_name='Dashboard'
        verbose_name_plural='Dashboards' 
