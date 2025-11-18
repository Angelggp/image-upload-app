from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.http import Http404
from mongoengine.errors import DoesNotExist
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import logging
import cloudinary
import cloudinary.api

from .models import Image
from .serializers import ImageSerializer, ImageUploadSerializer
from .utils import save_uploaded_file, delete_uploaded_file

logger = logging.getLogger(__name__)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    """
    Endpoint para subir una imagen
    
    POST /api/images/upload/
    Body: multipart/form-data con 'file'
    """
    # Validar conexión a MongoDB antes de procesar
    try:
        # Intenta una operación simple para verificar la conexión
        Image.objects.first()
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"MongoDB no está conectado: {str(e)}")
        return Response(
            {'error': 'Base de datos no disponible. No se puede procesar la imagen en este momento.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        logger.error(f"Error al verificar conexión a MongoDB: {str(e)}")
        return Response(
            {'error': 'Error al verificar conexión con la base de datos'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    serializer = ImageUploadSerializer(data=request.data)
    
    if serializer.is_valid():
        uploaded_file = serializer.validated_data['file']
        file_url = None
        filename = None
        
        try:
            # Guardar archivo en Cloudinary
            file_url, filename = save_uploaded_file(uploaded_file)
            
            # Crear documento en MongoDB
            image = Image(
                filename=filename,
                original_filename=uploaded_file.name,
                file_url=file_url,
                file_size=uploaded_file.size,
                content_type=uploaded_file.content_type
            )
            image.save()
            
            logger.info(f"Imagen subida exitosamente: {filename}")
            
            return Response(
                ImageSerializer(image).data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error al subir imagen: {str(e)}")
            
            # Rollback: eliminar imagen de Cloudinary si se subió pero falló el guardado en BD
            if file_url and filename:
                try:
                    # Extrae el public_id (ajusta según tu lógica en save_uploaded_file)
                    public_id = filename.rsplit('.', 1)[0]  # Remueve la extensión
                    cloudinary.uploader.destroy(public_id)
                    logger.info(f"Rollback exitoso: imagen eliminada de Cloudinary ({public_id})")
                except Exception as cleanup_error:
                    logger.error(f"Error al hacer rollback en Cloudinary: {cleanup_error}")
            
            return Response(
                {'error': f'Error al procesar la imagen: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def download_image(request, image_id):
    """
    Endpoint para obtener URL de descarga de una imagen
    
    GET /api/images/download/<image_id>/
    """
    try:
        image = Image.objects.get(id=image_id)
        
        # Cloudinary devuelve URL directa
        return Response({
            'download_url': image.file_url,
            'filename': image.original_filename
        })
            
    except DoesNotExist:
        raise Http404("Imagen no encontrada")
    except Exception as e:
        logger.error(f"Error al obtener URL de descarga: {str(e)}")
        return Response(
            {'error': 'Error al obtener la imagen'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_image(request, image_id):
    """
    Endpoint para obtener información de una imagen
    
    GET /api/images/<image_id>/
    """
    try:
        image = Image.objects.get(id=image_id)
        return Response(ImageSerializer(image).data)
    except DoesNotExist:
        return Response(
            {'error': 'Imagen no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def list_images(request):
    """
    Endpoint para listar todas las imágenes (opcional)
    
    GET /api/images/
    """
    try:
        images = Image.objects.all()
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error al listar imágenes: {str(e)}")
        return Response(
            {'error': 'Error al obtener las imágenes'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
def delete_image(request, image_id):
    """
    Endpoint para eliminar una imagen (opcional)
    
    DELETE /api/images/<image_id>/
    """
    try:
        image = Image.objects.get(id=image_id)
        
        # Eliminar archivo de Cloudinary
        delete_uploaded_file(image.filename)
        
        # Eliminar documento de MongoDB
        image.delete()
        
        logger.info(f"Imagen eliminada: {image.filename}")
        
        return Response(
            {'message': 'Imagen eliminada exitosamente'},
            status=status.HTTP_204_NO_CONTENT
        )
    except DoesNotExist:
        return Response(
            {'error': 'Imagen no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error al eliminar imagen: {str(e)}")
        return Response(
            {'error': 'Error al eliminar la imagen'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """
    Endpoint para verificar que todos los servicios estén funcionando
    
    GET /api/images/health/
    """
    from pymongo import MongoClient
    from django.conf import settings
    
    health_status = {
        'status': 'unknown',
        'cloudinary': {},
        'mongodb': {},
        'timestamp': None
    }
    
    try:
        # Verificar Cloudinary
        config = settings.CLOUDINARY_STORAGE
        
        health_status['cloudinary']['configured'] = bool(
            config.get('CLOUD_NAME') and 
            config.get('API_KEY') and 
            config.get('API_SECRET')
        )
        
        # Ping a Cloudinary
        try:
            result = cloudinary.api.ping()
            health_status['cloudinary']['connected'] = True
            health_status['cloudinary']['status'] = result.get('status', 'ok')
        except Exception as e:
            health_status['cloudinary']['connected'] = False
            health_status['cloudinary']['error'] = str(e)
        
        # Verificar MongoDB
        try:
            count = Image.objects.count()
            health_status['mongodb']['connected'] = True
            health_status['mongodb']['images_count'] = count
        except Exception as e:
            health_status['mongodb']['connected'] = False
            health_status['mongodb']['error'] = str(e)
        
        # Status general
        if (health_status['cloudinary'].get('connected') and 
            health_status['mongodb'].get('connected')):
            health_status['status'] = 'healthy'
        else:
            health_status['status'] = 'unhealthy'
        
        from datetime import datetime
        health_status['timestamp'] = datetime.utcnow().isoformat()
        
        status_code = status.HTTP_200_OK if health_status['status'] == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
        
        return Response(health_status, status=status_code)
        
    except Exception as e:
        return Response(
            {
                'status': 'error',
                'error': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )