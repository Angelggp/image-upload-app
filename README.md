# Image Upload App 🖼️

**Descripción**

Este proyecto es un ejercicio implementado a partir de un reto de **https://devchallenges.io**. Es una aplicación full‑stack para subir, almacenar y descargar imágenes:
- Backend: Django + Django REST Framework + MongoDB (MongoEngine) + Cloudinary.
- Frontend: Next.js + TypeScript.
- Validaciones: solo JPG/PNG/GIF y tamaño máximo 2MB.

---

## ⚙️ Requisitos

- Node.js (recomendado >= 18)
- npm o yarn
- Python 3.10+
- MongoDB (local o Atlas)
- Cuenta y credenciales de Cloudinary

---

## Instalación y ejecución (Windows)

### Backend
1. Abrir PowerShell en `backend/`.
2. Crear y activar entorno virtual:
   ```powershell
   python -m venv venv
   & .\venv\Scripts\Activate.ps1
   ```
3. Instalar dependencias:
   ```powershell
   pip install -r requirements.txt
   ```
4. Crear un archivo `.env` en `backend/` con las variables indicadas más abajo.
5. Ejecutar migraciones y levantar el servidor:
   ```powershell
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend
1. Abrir terminal en `frontend/`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear `.env.local` con la variable `NEXT_PUBLIC_API_URL` (ej.: `http://localhost:8000/api`).
4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## Variables de entorno importantes

Backend (`backend/.env`) — ejemplos:
```
DJANGO_SECRET_KEY=tu_secret
DEBUG=True
MONGO_USE_ATLAS=False
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=image_upload_db
# Si usas Atlas, en su lugar define MONGO_URI
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Tests

Se añadieron tests para verificar conexiones y el flujo de integración. Comandos principales (desde `backend/`):

- Ejecutar todos los tests:
  ```bash
  python manage.py test apps.images
  ```
- Ejecutar tests específicos (ej.: Cloudinary o MongoDB):
  ```bash
  python manage.py test apps.images.CloudinaryConnectionTest
  python manage.py test apps.images.MongoDBConnectionTest
  python manage.py test apps.images.IntegrationTest
  ```

Los tests comprueban: conexión a MongoDB, credenciales y subida/eliminación en Cloudinary, y un test de integración para el flujo completo.

---

## Notas importantes

- En producción: usa `DEBUG=False`, configura `ALLOWED_HOSTS` y variables seguras (no subir `.env` al repo).
- Si usas Cloudinary, verifica límites/retención y configura las credenciales correctamente.
- Se implementa rollback: si se sube a Cloudinary pero falla el guardado en la BD, se intenta eliminar el archivo subido.
- Endpoints principales disponibles bajo `http://<host>/api/images/` (upload, list, get, download, delete, health).

---

## Archivos de ejemplo (.env) ✅
He añadido archivos de ejemplo para facilitar la configuración:

- `backend/.env.example` — copia a `backend/.env` y completa los valores.
- `frontend/.env.local.example` — copia a `frontend/.env.local` y completa el valor `NEXT_PUBLIC_API_URL`.

**Importante:** no subas los archivos con credenciales reales al repositorio; añade `backend/.env` y `frontend/.env.local` a tu `.gitignore`.

---
<img width="1907" height="1037" alt="Captura de pantalla 2026-01-12 132248" src="https://github.com/user-attachments/assets/78011c13-0cc3-4550-9e0b-fb6f2f6e84ec" />



