from django.contrib import admin

# Register your models here.

from django.contrib import admin
from mongoengine import Document
from .models import Image


class ImageAdmin(admin.ModelAdmin):
    """Configuración del admin para el modelo Image"""
    
    # Campos a mostrar en la lista
    list_display = ['id', 'original_filename', 'file_size_mb', 'content_type', 'uploaded_at']
    
    # Campos de búsqueda
    search_fields = ['original_filename', 'filename']
    
    # Filtros laterales
    list_filter = ['content_type', 'uploaded_at']
    
    # Ordenamiento por defecto
    ordering = ['-uploaded_at']
    
    # Campos de solo lectura
    readonly_fields = ['id', 'filename', 'file_url', 'file_size', 'content_type', 'uploaded_at', 'image_preview']
    
    # Campos a mostrar en el formulario
    fields = ['image_preview', 'original_filename', 'file_url', 'file_size', 'content_type', 'uploaded_at']
    
    def file_size_mb(self, obj):
        """Mostrar tamaño en MB"""
        return f"{obj.file_size / (1024 * 1024):.2f} MB"
    file_size_mb.short_description = 'Tamaño'
    
    def image_preview(self, obj):
        """Mostrar preview de la imagen"""
        from django.utils.html import format_html
        if obj.file_url:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px;" />',
                obj.file_url
            )
        return "Sin imagen"
    image_preview.short_description = 'Preview'
    
    def has_add_permission(self, request):
        """Deshabilitar la opción de agregar desde el admin"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Deshabilitar la opción de editar"""
        return False


# MongoEngine usa un registro diferente
# No podemos usar admin.site.register() directamente
# Tenemos que crear una vista personalizada o usar django-mongoengine-admin

# Como alternativa simple, podemos hacer esto:
try:
    # Intentar registrar para que aparezca en el admin
    # Nota: Esto puede no funcionar perfectamente con MongoEngine
    from django.contrib import admin as django_admin
    
    # Crear un proxy para poder registrarlo
    class ImageProxy:
        class Meta:
            verbose_name = "Imagen"
            verbose_name_plural = "Imágenes"
            app_label = 'images'
    
    # No registramos directamente porque MongoEngine no es compatible con Django Admin por defecto
    # En su lugar, usaremos la API REST para el panel de administración
    
except Exception as e:
    print(f"No se pudo registrar en el admin: {e}")