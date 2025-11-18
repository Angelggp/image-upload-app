from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import Image

class ImageSerializer(DocumentSerializer):
    """Serializer para el modelo Image"""
    id = serializers.UUIDField(read_only=True)
    
    class Meta:
        model = Image
        fields = '__all__'
        read_only_fields = ['id', 'uploaded_at']

class ImageUploadSerializer(serializers.Serializer):
    """Serializer para validar la subida de archivos"""
    file = serializers.ImageField(required=True)
    
    def validate_file(self, value):
        """Validar tipo y tamaño del archivo"""
        
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                'Solo se permiten archivos JPG, PNG o GIF.'
            )
        
        # Validar tamaño (2MB máximo)
        max_size = 2 * 1024 * 1024 
        if value.size > max_size:
            raise serializers.ValidationError(
                'El archivo no debe superar los 2MB.'
            )
        
        return value