from django.db import models

class Exposicion(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=200)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to="exposiciones/")
    video = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.titulo} - {self.autor}"
