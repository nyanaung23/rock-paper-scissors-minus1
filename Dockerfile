FROM python:3.11-slim

WORKDIR /app

# Install system dependencies and upgrade pip in one layer
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY backend/ .

# Make start script executable and collect static files
RUN chmod +x start.sh \
    && python manage.py collectstatic --noinput

# Expose port
EXPOSE $PORT

# Use the start script
CMD ["./start.sh"]