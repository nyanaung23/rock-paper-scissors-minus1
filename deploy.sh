#!/bin/bash

# Rock Paper Scissors Backend Deployment Script
# This script helps deploy the backend to Railway

set -e

echo "🚀 Rock Paper Scissors Backend Deployment Script"
echo "================================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Please install it first:"
    echo "   npm install -g @railway/cli"
    echo "   or visit: https://docs.railway.app/develop/cli"
    exit 1
fi

echo "✅ Railway CLI found"

# Check if we're logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please login first:"
    echo "   railway login"
    exit 1
fi

echo "✅ Logged in to Railway"

# Check if we're in the correct directory
if [ ! -f "Dockerfile" ] || [ ! -f "railway.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ In correct project directory"

# Check if backend directory exists and has required files
if [ ! -d "backend" ] || [ ! -f "backend/manage.py" ]; then
    echo "❌ Backend directory or manage.py not found"
    exit 1
fi

echo "✅ Backend directory structure verified"

# Test Django setup locally
echo "🔍 Testing Django setup..."
cd backend
source venv/bin/activate 2>/dev/null || echo "⚠️  Virtual environment not found, using system Python"

# Check Django configuration
python manage.py check
echo "✅ Django configuration is valid"

# Run migrations
echo "🔄 Running database migrations..."
python manage.py migrate
echo "✅ Database migrations completed"

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput
echo "✅ Static files collected"

cd ..

echo ""
echo "🎯 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Make sure your environment variables are set in Railway:"
echo "   - DJANGO_SECRET_KEY (generate with: python -c \"from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())\")"
echo "   - DEBUG=False"
echo "   - ALLOWED_HOSTS=your-domain.com,*.railway.app"
echo ""
echo "2. Deploy to Railway:"
echo "   railway up"
echo ""
echo "3. Check deployment status:"
echo "   railway status"
echo ""
echo "4. View logs:"
echo "   railway logs"
echo ""
echo "5. Open your deployed app:"
echo "   railway open"
echo ""
echo "🔗 Health check endpoint: /api/health/"
echo "🔗 WebSocket endpoint: /ws/rps/{room_code}/"
echo ""
echo "Happy deploying! 🎉"
