from django.contrib import admin
from .models import Exposicion

@admin.register(Exposicion)
class ExposicionAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "autor", "video")
    search_fields = ("titulo", "autor")
    list_filter = ("autor",)
