#!/bin/bash

# Exit on any error
set -e

echo "Starting Rock Paper Scissors Backend..."

# Set default PORT if not provided
export PORT=${PORT:-8000}
echo "Using PORT: $PORT"

# Check Django configuration
echo "Checking Django configuration..."
python manage.py check

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Start the server
echo "Starting Daphne server on port $PORT..."
exec daphne -b 0.0.0.0 -p $PORT rps_online.asgi:application
