from django.urls import path
from . import views

app_name = 'images'

urlpatterns = [
    path('health/', views.health_check, name='health-check'),
    path('', views.list_images, name='list-images'),
    path('upload/', views.upload_image, name='upload-image'),
    path('<uuid:image_id>/', views.get_image, name='get-image'),
    path('download/<uuid:image_id>/', views.download_image, name='download-image'),
    path('delete/<uuid:image_id>/', views.delete_image, name='delete-image'),
]