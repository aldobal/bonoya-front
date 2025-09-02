# Etapa de build
FROM node:20.19.0-alpine AS builder

# Crear usuario no-root para mejor seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Establecer directorio de trabajo
WORKDIR /app

# Cambiar propiedad del directorio
RUN chown -R appuser:appgroup /app

# Instalar Angular CLI globalmente (como root)
RUN npm install -g @angular/cli@20.0.3

# Cambiar a usuario no-root
USER appuser

# Copiar archivos de configuración primero (optimización de caché)
COPY --chown=appuser:appgroup package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar el resto de los archivos
COPY --chown=appuser:appgroup . .

# Build con optimizaciones y usando la configuración de producción
RUN npm run build:prod

# Etapa final - usar nginx como imagen base
FROM nginx:1.25.4-alpine

# Copiar los archivos compilados
COPY --from=builder /app/dist/untitled/browser /usr/share/nginx/html

# Copiar la configuración de nginx
COPY docker/nginx-simple.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# El comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]