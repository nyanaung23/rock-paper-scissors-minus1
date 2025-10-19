#!/bin/bash
echo "Starting Django ASGI server with daphne..."
exec daphne -b 0.0.0.0 -p $PORT rps_online.asgi:application
