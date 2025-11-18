# Create your models here.

from mongoengine import Document, StringField, IntField, DateTimeField, UUIDField
from datetime import datetime
import uuid

class Image(Document):
    """Modelo de imagen usando MongoEngine"""
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    filename = StringField(required=True, max_length=255)
    original_filename = StringField(required=True, max_length=255)
    file_url = StringField(required=True, max_length=500)
    file_size = IntField(required=True)  # en bytes
    content_type = StringField(required=True, max_length=50)
    uploaded_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'db_alias': 'default',
        'collection': 'images',
        'ordering': ['-uploaded_at'],
        'indexes': [
            'uploaded_at',
            'filename'
        ]
    }
    
    def __str__(self):
        return self.original_filename