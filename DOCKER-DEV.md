# Desarrollo Local con Docker

Este proyecto incluye configuración para desarrollo local usando Docker, lo que te permite tener un entorno consistente sin instalar Node.js localmente.
o otras dependencias de desarrollo

## Requisitos

### Opción 1: Docker Desktop

- Docker Desktop instalado y corriendo
- Git (para clonar el repositorio)

### Opción 2: Docker CLI (sin Desktop)

- Docker Engine instalado
- Docker Compose (plugin o standalone)
- Git (para clonar el repositorio)

### Instalación Docker CLI

```bash
# Ejecutar script de instalación automática
./install-docker.sh

# O instalar manualmente según tu sistema
# Linux (Ubuntu/Debian): sudo apt-get install docker.io docker-compose-plugin
# macOS: brew install docker docker-compose colima && colima start
```

## Configuración Inicial

### 1. Configurar Variables de Entorno

**IMPORTANTE**: Antes de iniciar el desarrollo, debes configurar el JWT_SECRET.

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar el archivo .env
nano .env  # o usa tu editor preferido
```

**En el archivo `.env`, cambia:**

```bash
# Cambia esta línea:
JWT_SECRET=your-super-secure-jwt-secret-here

# Por algo como:
JWT_SECRET=MiSecreto-Zoolip-2024-SuperSeguro-ParaDesarrollo
```

### 2. Verificar Backend

Asegúrate de que tu backend esté corriendo en `http://localhost:3050/api/auth/`

## Inicio Rápido

### Opción 1: Scripts automatizados

**Con Docker Compose (recomendado):**

```bash
./dev.sh                 # Linux/macOS (detecta automáticamente compose)
dev.bat                  # Windows
```

**Solo Docker CLI (sin Compose):**

```bash
./dev-docker-only.sh     # Linux/macOS
```

### Opción 2: Makefile

```bash
make dev                 # Iniciar desarrollo (detecta compose automáticamente)
make dev-build           # Reconstruir imagen
make dev-logs            # Ver logs
make dev-shell           # Abrir shell
```

### Opción 3: Comandos manuales

**Con Docker Compose:**

```bash
# Detectar comando disponible
docker-compose --version || docker compose version

# Usar el comando detectado
docker-compose -f docker-compose.dev.yml up --build
# O
docker compose -f docker-compose.dev.yml up --build
```

**Solo Docker CLI:**

```bash
# Construir imagen
docker build -f Dockerfile.dev -t zoolip-dev .

# Ejecutar contenedor
docker run -d --name zoolip-dev \
  -p 5173:5173 \
  -v "$(pwd):/app" \
  -v /app/node_modules \
  -e NODE_ENV=development \
  --env-file .env \
  zoolip-dev
```

## Características del Entorno de Desarrollo

- **Hot Reload**: Los cambios en el código se reflejan automáticamente gracias a vite
- **Puerto 5173**: La aplicación estará disponible en `http://localhost:5173`
- **Volúmenes montados**: Tu código local se sincroniza con el contenedor
- **Dependencias aisladas**: No necesitas Node.js instalado localmente
- **Entorno consistente**: Mismo Node.js 20 Alpine para todos los desarrolladores

## Comandos Útiles

### Detener el entorno

```bash
# Detener contenedores
docker-compose -f docker-compose.dev.yml down

# Detener y eliminar volúmenes
docker-compose -f docker-compose.dev.yml down -v
```

### Ejecutar comandos dentro del contenedor

```bash
# Abrir shell en el contenedor
docker-compose -f docker-compose.dev.yml exec app sh

# Ejecutar comandos npm
docker-compose -f docker-compose.dev.yml exec app npm run typecheck
docker-compose -f docker-compose.dev.yml exec app npm install nueva-dependencia
```

### Ver logs

```bash
# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.dev.yml logs -f app
```

### Limpiar todo

```bash
# Eliminar contenedores, redes, volúmenes e imágenes
docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans

# Limpiar cache de Docker
docker system prune -a
```

## Alternativas a Docker Desktop

### Linux

- **Docker Engine** (nativo): Instalación estándar del repositorio oficial
- **Podman**: Alternativa compatible con Docker
- **Containerd + nerdctl**: Motor de contenedores ligero

### macOS

- **Colima**: Motor ligero y rápido (`brew install colima`)
- **Rancher Desktop**: Interfaz gráfica alternativa
- **OrbStack**: Alternativa moderna y rápida
- **Lima**: Máquinas virtuales Linux ligeras

### Windows

- **Docker Engine en WSL2**: Instalación nativa en WSL
- **Rancher Desktop**: Alternativa multiplataforma
- **Podman Desktop**: Interfaz gráfica para Podman

## Estructura de Archivos Docker

```
├── Dockerfile.dev          # Dockerfile para desarrollo
├── docker-compose.dev.yml  # Configuración de Docker Compose
├── .dockerignore           # Archivos a ignorar en el build
├── dev.sh                 # Script con detección automática de compose
├── dev-docker-only.sh     # Script solo Docker CLI
├── dev.bat                # Script de inicio para Windows
├── install-docker.sh      # Instalador automático de Docker CLI
└── DOCKER-DEV.md          # Esta documentación
```

## Solución de Problemas

### El hot reload no funciona

- Asegúrate de que los volúmenes estén montados correctamente
- En algunos sistemas, puedes necesitar `CHOKIDAR_USEPOLLING=true` (ya incluido)

### Puerto 5173 ocupado

```bash
# Cambiar el puerto en docker-compose.dev.yml
ports:
  - "5174:5173"  # Usar puerto 5174 localmente
```

### Problemas de permisos

```bash
# En Linux, si tienes problemas de permisos
sudo chown -R $USER:$USER .
```

### Reinstalar dependencias

```bash
# Eliminar node_modules y reinstalar
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up
```

### JWT_SECRET no se carga desde .env

Si ves en los logs que se usa un JWT_SECRET diferente al de tu .env:

```bash
# 1. Verifica que .env existe y tiene tu JWT_SECRET
cat .env | grep JWT_SECRET

# 2. Asegúrate de que docker-compose.dev.yml NO tenga JWT_SECRET en environment:
# ❌ MAL:
# environment:
#   - JWT_SECRET=valor-hardcodeado

# ✅ BIEN:
# env_file:
#   - .env

# 3. Reinicia el contenedor para cargar los cambios
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```

## Variables de Entorno

### Configuración Automática

El proyecto incluye configuración automática de variables de entorno:

- **`.env`** - Variables para desarrollo local
- **`.env.example`** - Plantilla con todas las variables disponibles
- **`docker-compose.dev.yml`** - Variables específicas para Docker

### Variables Importantes

#### JWT_SECRET (REQUERIDO)

El JWT_SECRET es crucial para la seguridad de tu aplicación. Debes configurarlo en:

**Archivo `.env` (para desarrollo local):**

```bash
# Edita el archivo .env en la raíz del proyecto
JWT_SECRET=tu-secreto-super-seguro-para-desarrollo-2024
```

**Docker Compose:**

```yaml
# En docker-compose.dev.yml - NO definir JWT_SECRET aquí
# Se carga automáticamente desde tu archivo .env
env_file:
  - .env
```

**Para producción:**

```bash
# Variable de entorno del sistema
export JWT_SECRET="tu-secreto-super-seguro-para-produccion"

# O en Docker
docker run -e JWT_SECRET="tu-secreto-super-seguro" ...
```

#### Backend URL

```bash
# URL del backend de autenticación
BASE_AUTH_URL=http://localhost:3050/api/auth/
```

### Configurar JWT_SECRET

1. **Copia el archivo de ejemplo:**

   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env`:**

   ```bash
   # Cambia esta línea en .env:
   JWT_SECRET=tu-secreto-personalizado-muy-seguro-2024
   ```

3. **Para producción, usa una cadena más segura:**
   - Mínimo 32 caracteres
   - Incluye letras, números y símbolos
   - Ejemplo: `JWT_SECRET=Zoolip2024!MiSecreto#SuperSeguro$ParaProduccion`

## Desarrollo vs Producción

- **Desarrollo** (`Dockerfile.dev`): Incluye devDependencies, hot reload, volúmenes montados
- **Producción** (`Dockerfile`): Optimizado, multi-stage build, solo dependencias de producción

Para producción, usa el Dockerfile original:

```bash
docker build -t zoolip-prod .
docker run -p 5173:5173 zoolip-prod
```
