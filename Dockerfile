FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose port
EXPOSE 8080

# Use Daphne for WebSocket support
CMD ["daphne", "-b", "0.0.0.0", "-p", "8080", "rps_online.asgi:application"]