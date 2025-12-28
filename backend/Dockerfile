# backend/Dockerfile
#FROM python:3.12-slim

# Evita que Python genere archivos .pyc y fuerza la salida a la consola
#ENV PYTHONDONTWRITEBYTECODE 1
#ENV PYTHONUNBUFFERED 1

#WORKDIR /app

# Instalamos dependencias del sistema necesarias para PostgreSQL y otros
#RUN apt-get update && apt-get install -y \
#    build-essential \
 #   libpq-dev \
  #  netcat-traditional \
   # && rm -rf /var/lib/apt/lists/*

# Copiamos los requerimientos primero (para aprovechar el caché de Docker)
#COPY requirements.txt /app/
#RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiamos el resto del código
#COPY . /app/

# Este comando se ejecutará por defecto (lo sobreescribiremos en docker-compose si es necesario)
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]




# Usamos una imagen base ligera de Python
FROM python:3.12-slim

# Evita archivos .pyc y buffer de salida
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Desactiva la creación de venv de Poetry (no es necesario dentro del contenedor)
ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg2 y reportlab
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar Poetry
RUN pip install --no-cache-dir poetry

# Copiar archivos de configuración primero (para aprovechar caché de Docker)
COPY pyproject.toml poetry.lock /app/

# Instalar dependencias (sin interacción y sin dev-dependencies si es producción)
RUN poetry install --no-interaction --no-ansi --no-root

# Copiar el resto del código
COPY . /app/

EXPOSE 8000

# Comando por defecto
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]