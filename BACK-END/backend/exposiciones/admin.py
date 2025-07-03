from django.contrib import admin
from exposiciones.models import Exposicion

# Register your models here.

class ExposicionAdmin(admin.ModelAdmin):
    list_display=("nombre","tiempo")#para escojer que campos quiero ver en el admin
    search_fields=("nombre",)#crear un registro de busqueda segun estos campos


admin.site.register(Exposicion,ExposicionAdmin)