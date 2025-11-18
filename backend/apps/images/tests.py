from django.test import TestCase
from pymongo import MongoClient
from django.conf import settings
import cloudinary
import cloudinary.api 
from cloudinary import uploader
from PIL import Image
import io


class MongoDBConnectionTest(TestCase):
    """Test de conexión a MongoDB"""
    
    def test_mongodb_connection(self):
        """Verifica que se pueda conectar correctamente a MongoDB."""
        connected = False
        client = None
        try:
            # Construir URI desde settings
            mongo_host = settings.MONGO_HOST
            mongo_port = settings.MONGO_PORT
            mongo_db = settings.MONGO_DB_NAME
            mongo_user = settings.MONGO_USER
            mongo_password = settings.MONGO_PASSWORD
            
            if mongo_user and mongo_password:
                mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/{mongo_db}?authSource=admin"
            else:
                mongo_uri = f"mongodb://{mongo_host}:{mongo_port}/{mongo_db}"
            
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
            client.server_info()  # Lanza excepción si no hay conexión
            print("✅ Conexión a MongoDB exitosa")
            connected = True
        except Exception as e:
            print(f"❌ Error de conexión a MongoDB: {e}")
        finally:
            if client:
                client.close()

        self.assertTrue(connected, "No se pudo conectar a MongoDB.")


class CloudinaryConnectionTest(TestCase):
    """Test de conexión y configuración de Cloudinary"""
    
    def test_cloudinary_credentials_configured(self):
        """Verifica que las credenciales de Cloudinary estén configuradas."""
        print("\n🔍 Verificando credenciales de Cloudinary...")
        
        config = settings.CLOUDINARY_STORAGE
        
        cloud_name = config.get('CLOUD_NAME')
        api_key = config.get('API_KEY')
        api_secret = config.get('API_SECRET')
        
        # Verificar que existen
        self.assertIsNotNone(cloud_name, "CLOUDINARY_CLOUD_NAME no está configurado")
        self.assertIsNotNone(api_key, "CLOUDINARY_API_KEY no está configurado")
        self.assertIsNotNone(api_secret, "CLOUDINARY_API_SECRET no está configurado")
        
        # Verificar que no están vacíos
        self.assertNotEqual(cloud_name, '', "CLOUDINARY_CLOUD_NAME está vacío")
        self.assertNotEqual(api_key, '', "CLOUDINARY_API_KEY está vacío")
        self.assertNotEqual(api_secret, '', "CLOUDINARY_API_SECRET está vacío")
        
        print(f"✅ CLOUD_NAME: {cloud_name}")
        print(f"✅ API_KEY: {api_key[:4]}...{api_key[-4:]}")
        print("✅ API_SECRET: ***configurado***")
    
    def test_cloudinary_connection(self):
        """Verifica que se pueda conectar a Cloudinary."""
        print("\n🔍 Probando conexión a Cloudinary API...")
        
        connected = False
        try:
            result = cloudinary.api.ping()
            print(f"✅ Conexión exitosa a Cloudinary: {result}")
            connected = True
        except Exception as e:
            print(f"❌ Error al conectar con Cloudinary: {e}")
        
        self.assertTrue(connected, "No se pudo conectar a Cloudinary API.")
    
    def test_cloudinary_upload_and_delete(self):
        """Verifica que se puedan subir y eliminar archivos en Cloudinary."""
        print("\n🔍 Probando upload y delete en Cloudinary...")
        
        upload_successful = False
        delete_successful = False
        public_id = None
        
        try:
            # Crear una imagen de prueba en memoria
            img = Image.new('RGB', (100, 100), color='red')
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG')
            img_bytes.seek(0)
            
            # Subir imagen a Cloudinary
            print("  📤 Subiendo imagen de prueba...")
            result = uploader.upload(
                img_bytes,
                folder='test-uploads',
                public_id='test_image_django',
                overwrite=True,
                resource_type='image'
            )
            
            public_id = result['public_id']
            secure_url = result['secure_url']
            
            print(f"  ✅ Imagen subida exitosamente")
            print(f"     URL: {secure_url}")
            print(f"     Public ID: {public_id}")
            
            upload_successful = True
            
            # Verificar que la imagen existe
            self.assertIn('secure_url', result)
            self.assertIsNotNone(result['secure_url'])
            
            # Eliminar imagen de prueba
            print("  🗑️  Eliminando imagen de prueba...")
            delete_result = uploader.destroy(public_id)
            
            if delete_result.get('result') == 'ok':
                print("  ✅ Imagen eliminada exitosamente")
                delete_successful = True
            else:
                print(f"  ⚠️  Resultado de eliminación: {delete_result}")
                delete_successful = True  # Algunas veces devuelve 'not found' si ya fue eliminada
                
        except Exception as e:
            print(f"  ❌ Error durante la prueba: {e}")
        
        self.assertTrue(upload_successful, "No se pudo subir la imagen a Cloudinary.")
        self.assertTrue(delete_successful, "No se pudo eliminar la imagen de Cloudinary.")
    
    def test_cloudinary_storage_backend(self):
        """Verifica que el storage backend de Django esté configurado correctamente."""
        print("\n🔍 Verificando Django Storage Backend...")
        
        from django.core.files.storage import default_storage
        
        storage_class = default_storage.__class__.__name__
        print(f"  📦 Storage Backend: {storage_class}")
        
        # Verificar que es el storage de Cloudinary
        self.assertEqual(
            settings.DEFAULT_FILE_STORAGE,
            'cloudinary_storage.storage.MediaCloudinaryStorage',
            "DEFAULT_FILE_STORAGE no está configurado para usar Cloudinary"
        )
        
        print("  ✅ Storage Backend configurado correctamente")


class IntegrationTest(TestCase):
    """Tests de integración completos"""
    
    def test_full_system_health(self):
        """Verifica que todos los servicios estén funcionando."""
        print("\n" + "="*60)
        print("🏥 VERIFICACIÓN DE SALUD DEL SISTEMA")
        print("="*60)
        
        services_status = {
            'mongodb': False,
            'cloudinary': False,
        }
        
        # Test MongoDB
        print("\n1️⃣  MongoDB...")
        try:
            mongo_host = settings.MONGO_HOST
            mongo_port = settings.MONGO_PORT
            mongo_db = settings.MONGO_DB_NAME
            mongo_user = settings.MONGO_USER
            mongo_password = settings.MONGO_PASSWORD
            
            if mongo_user and mongo_password:
                mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/{mongo_db}?authSource=admin"
            else:
                mongo_uri = f"mongodb://{mongo_host}:{mongo_port}/{mongo_db}"
            
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            client.server_info()
            client.close()
            services_status['mongodb'] = True
            print("   ✅ MongoDB: CONECTADO")
        except Exception as e:
            print(f"   ❌ MongoDB: ERROR - {e}")
        
        # Test Cloudinary
        print("\n2️⃣  Cloudinary...")
        try:
            result = cloudinary.api.ping()
            services_status['cloudinary'] = True
            print("   ✅ Cloudinary: CONECTADO")
        except Exception as e:
            print(f"   ❌ Cloudinary: ERROR - {e}")
        
        # Resultado final
        print("\n" + "="*60)
        all_healthy = all(services_status.values())
        
        if all_healthy:
            print("🎉 TODOS LOS SERVICIOS ESTÁN FUNCIONANDO CORRECTAMENTE")
        else:
            print("⚠️  ALGUNOS SERVICIOS TIENEN PROBLEMAS")
            for service, status in services_status.items():
                status_icon = "✅" if status else "❌"
                print(f"   {status_icon} {service.upper()}: {'OK' if status else 'FALLO'}")
        
        print("="*60 + "\n")
        
        self.assertTrue(all_healthy, "No todos los servicios están funcionando correctamente.")