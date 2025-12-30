FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false
ENV PYTHONPATH=/app
# 1. Carpeta base
WORKDIR /app

# 2. Dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir poetry

# 3. Copiar dominio
COPY dominio /app/dominio

# 4. Copiar archivos de configuración del backend
COPY backend/pyproject.toml backend/README.md* /app/backend/

WORKDIR /app/backend

# 5. Instalar dependencias
RUN poetry install --no-interaction --no-ansi --no-root

# 6. Copiar backend completo
COPY backend /app/backend

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
