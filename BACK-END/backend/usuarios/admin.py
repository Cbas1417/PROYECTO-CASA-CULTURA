from django.contrib import admin

# Register your models here.

from usuarios.models import Usuario

class UsuarioAdmin(admin.ModelAdmin):
    list_display=("nombre","numero_documento","correo")#para escojer que campos quiero ver en el admin
    search_fields=("nombre","correo")#crear un registro de busqueda segun estos campos


admin.site.register(Usuario,UsuarioAdmin)