from django.db import models

class Slide(models.Model):
    imagen = models.ImageField(upload_to='slides/')

    def __str__(self):
        return f"Slide {self.id}"
    
    class meta:
        db_table='slide'
        verbose_name='Slide'
        verbose_name_plural='Slides' 



