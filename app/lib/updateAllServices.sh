#!/bin/bash
# Script para actualizar todos los servicios con manejo de errores mejorado

echo "Actualizando servicios con manejo de errores mejorado..."

# Lista de archivos de servicios a actualizar
services=(
  "app/features/post/postService.ts"
  "app/features/post/comments/commentService.ts"
  "app/features/chat/chatService.ts"
  "app/features/donacion/donationService.ts"
  "app/features/atencion/atencionService.ts"
  "app/features/entities/institucion/institutionService.ts"
  "app/features/entities/institucion/institutionSolicitudService.ts"
  "app/features/entities/veterinarios/veterinarianService.ts"
  "app/features/admin/adminService.ts"
)

echo "Servicios a actualizar: ${#services[@]}"
for service in "${services[@]}"; do
  if [ -f "$service" ]; then
    echo "✓ $service"
  else
    echo "✗ $service (no encontrado)"
  fi
done
