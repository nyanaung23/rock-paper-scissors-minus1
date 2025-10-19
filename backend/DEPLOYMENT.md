# Backend Deployment Guide

## Environment Variables Required

Set these environment variables in your deployment platform (Railway, Heroku, etc.):

### Required Variables:
- `DJANGO_SECRET_KEY`: A secure secret key for Django (generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `DEBUG`: Set to `False` for production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts (e.g., `your-domain.com,*.railway.app`)

### Optional Variables:
- `DATABASE_URL`: Database connection string (Railway provides this automatically)
- `REDIS_URL`: Redis connection string (if using Redis for channels)

### CORS Configuration:
Update the following in `settings.py` with your frontend URLs:
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`

## Deployment Steps

1. Ensure all dependencies are in `requirements.txt`
2. Run migrations: `python manage.py migrate`
3. Collect static files: `python manage.py collectstatic --noinput`
4. Start the server using the Procfile

## Health Check

The backend provides a health check endpoint at `/api/health/` that returns:
```json
{"status": "ok", "message": "Backend is running"}
```

## WebSocket Support

The backend supports WebSocket connections for real-time game functionality.
WebSocket URL pattern: `/ws/rps/{room_code}/`
