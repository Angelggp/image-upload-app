import os
import uuid
from django.core.files.storage import default_storage
from django.conf import settings

def save_uploaded_file(uploaded_file):
    """
    Guarda el archivo en Cloudinary usando Django Storage
    Retorna: (file_url, filename)
    """
    # Generar nombre único
    ext = os.path.splitext(uploaded_file.name)[1].lower()
    filename = f"{uuid.uuid4()}{ext}"
    
    # Guardar usando el storage por defecto (Cloudinary)
    # Django-cloudinary-storage maneja todo automáticamente
    saved_path = default_storage.save(f'image-uploads/{filename}', uploaded_file)
    
    # Obtener URL pública
    file_url = default_storage.url(saved_path)
    
    return file_url, filename


import cloudinary.uploader

def delete_uploaded_file(filename):
    """
    Elimina un archivo de Cloudinary explícitamente.
    """
    try:
        public_id = f"image-uploads/{os.path.splitext(filename)[0]}"
        result = cloudinary.uploader.destroy(public_id)
        if result.get("result") in ["ok", "not_found"]:
            return True
    except Exception as e:
        print(f"Error al eliminar archivo: {str(e)}")
    return False
