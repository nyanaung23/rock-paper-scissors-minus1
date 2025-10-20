#!/bin/bash

set -e

echo "Starting Rock Paper Scissors Backend..."

export PORT=${PORT:-8000}
echo "Using PORT: $PORT"

echo "Checking Django configuration..."
python manage.py check

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Running database migrations..."
python manage.py migrate

echo "Starting Daphne server on port $PORT..."
exec daphne -b 0.0.0.0 -p $PORT rps_online.asgi:application
