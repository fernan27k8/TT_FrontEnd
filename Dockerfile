# Usa una imagen base de Node para construir el proyecto
FROM node:16 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos necesarios para la instalación
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Usa una imagen más ligera para servir la aplicación
FROM nginx:alpine

# Copia los archivos estáticos generados al servidor NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Comando por defecto para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
