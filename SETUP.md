# Configuración Rápida de Zoolip

## 🚀 Inicio Rápido (5 minutos)

### 1. Configurar JWT_SECRET (OBLIGATORIO)

```bash
# Copiar archivo de configuración
cp .env.example .env
```

**Edita el archivo `.env` y cambia:**

```bash
# ANTES:
JWT_SECRET=your-super-secure-jwt-secret-here

# DESPUÉS (usa tu propio secreto):
JWT_SECRET=MiSecreto-Zoolip-2024-SuperSeguro-Desarrollo
```

### 2. Verificar Backend

Asegúrate de que tu backend esté corriendo en:

```
http://localhost:3050/api/auth/
```

### 3. Elegir método de desarrollo

#### Opción A: Desarrollo Local

```bash
npm install
npm run dev
```

#### Opción B: Docker (Recomendado)

```bash
./dev.sh
# O
make dev
```

## 🔐 Sobre JWT_SECRET

### ¿Qué es?

El JWT_SECRET es una clave secreta que se usa para firmar y verificar tokens de autenticación.

### ¿Dónde configurarlo?

1. **Desarrollo local**: Archivo `.env`
2. **Docker**: Ya configurado en `docker-compose.dev.yml`
3. **Producción**: Variable de entorno del servidor

### Ejemplos de JWT_SECRET seguros:

```bash
# Para desarrollo
JWT_SECRET=Zoolip-Dev-2024-MiSecreto-Local

# Para producción (más complejo)
JWT_SECRET=Zoolip2024!Prod#SuperSeguro$Token&Auth*2024
```

### Reglas para JWT_SECRET:

- ✅ Mínimo 32 caracteres
- ✅ Incluye letras, números y símbolos
- ✅ Único para cada entorno (dev/prod)
- ❌ No uses valores por defecto
- ❌ No lo compartas públicamente

## 🛠️ Solución de Problemas

### Error: "JWT_SECRET environment variable is required"

```bash
# Verifica que .env existe
ls -la .env

# Verifica el contenido
cat .env | grep JWT_SECRET

# Si no existe, créalo
cp .env.example .env
```

### Docker usa JWT_SECRET diferente al de mi .env

**Problema**: En los logs ves un JWT_SECRET diferente al que pusiste en `.env`

**Causa**: `docker-compose.dev.yml` tenía JWT_SECRET hardcodeado en `environment:`

**Solución**:

```bash
# 1. Verifica tu .env
cat .env | grep JWT_SECRET

# 2. El docker-compose.dev.yml ya está corregido para usar .env
# 3. Reinicia Docker para cargar cambios
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up

# O usa el script
./dev.sh
```

### Error de conexión al backend

```bash
# Verifica que el backend esté corriendo
curl http://localhost:3050/api/auth/

# Si no responde, inicia tu backend
# O cambia la URL en .env:
BASE_AUTH_URL=http://tu-backend-url/api/auth/
```

## 📁 Archivos de Configuración

```
├── .env                    # Tu configuración (NO subir a git)
├── .env.example           # Plantilla de configuración
├── docker-compose.dev.yml # Configuración Docker
└── vite.config.ts         # Configuración del servidor
```

## 🚀 ¡Listo!

Una vez configurado el JWT_SECRET, tu aplicación estará disponible en:

- **Local**: http://localhost:5173
- **Docker**: http://localhost:5173

¿Problemas? Revisa `DOCKER-DEV.md` para más detalles.
