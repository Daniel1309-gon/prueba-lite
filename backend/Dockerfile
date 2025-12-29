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

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false

# 1. Creamos una carpeta base para todo el proyecto
WORKDIR /app

# 2. Instalamos dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir poetry

# 3. Copiamos PRIMERO el dominio (porque el backend depende de él)
#    Copiamos todo lo de dominio a /app/dominio
COPY dominio /app/dominio

# 4. Copiamos los archivos de configuración del backend
#    Los ponemos en /app/backend
COPY backend/pyproject.toml backend/README.md* /app/backend/

# 5. Cambiamos el directorio de trabajo al backend para instalar
WORKDIR /app/backend

# 6. Instalamos. 
#    Como estamos en /app/backend, la ruta "../domain" del pyproject.toml
#    apuntará correctamente a /app/domain que copiamos en el paso 3.
RUN poetry install --no-interaction --no-ansi --no-root

# 7. Copiamos el resto del código del backend
COPY backend /app/backend

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]