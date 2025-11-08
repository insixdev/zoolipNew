# Etapa 1: Instalar dependencias de desarrollo
FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 2: Instalar solo dependencias de producción
FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Etapa 3: Build de la aplicación
FROM node:20-alpine AS build-env
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=development-dependencies-env /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 4: Imagen final de producción
FROM node:20-alpine AS production
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copiar archivos necesarios
COPY package.json package-lock.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

# Cambiar ownership de archivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 5173

# Comando de inicio
CMD ["npm", "run", "start"]