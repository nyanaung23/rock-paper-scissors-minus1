#!/bin/bash

# Exit on any error
set -e

echo "Starting Rock Paper Scissors Backend..."

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Start the server
echo "Starting Daphne server..."
exec daphne -b 0.0.0.0 -p $PORT rps_online.asgi:application
