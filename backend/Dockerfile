# backend/Dockerfile
FROM python:3.12-slim

# Evita que Python genere archivos .pyc y fuerza la salida a la consola
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instalamos dependencias del sistema necesarias para PostgreSQL y otros
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copiamos los requerimientos primero (para aprovechar el caché de Docker)
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiamos el resto del código
COPY . /app/

# Este comando se ejecutará por defecto (lo sobreescribiremos en docker-compose si es necesario)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]