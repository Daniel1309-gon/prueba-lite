# frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copiamos package.json primero
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite (generalmente 5173)
EXPOSE 5173

# Comando para desarrollo
CMD ["npm", "run", "dev", "--", "--host"]