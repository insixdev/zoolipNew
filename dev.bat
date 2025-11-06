@echo off
echo  Iniciando entorno de desarrollo con Docker...

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  Docker no está corriendo. Por favor inicia Docker Desktop.
    pause
    exit /b 1
)

REM Construir y ejecutar el contenedor
echo  Construyendo imagen de desarrollo...
docker-compose -f docker-compose.dev.yml up --build

echo  Entorno de desarrollo iniciado!
echo  La aplicación estará disponible en: http://localhost:5173
echo  Hot reload está habilitado - los cambios se reflejarán automáticamente
echo  Para detener: Ctrl+C o 'docker-compose -f docker-compose.dev.yml down'
pause
