from django.db import models

class Exposicion(models.Model):
    titulo = models.CharField(max_length=200,blank=True, null=True)
    autor = models.CharField(max_length=200,blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to="exposiciones/",blank=True, null=True)
    video = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.titulo} - {self.autor}"
