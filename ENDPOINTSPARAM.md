# API Endpoints - Zoolip

Documentación completa de todos los endpoints REST de la aplicación con detalles de request y response.

---

## 🔐 Autenticación (`/api/auth`)

### POST `/api/auth/login`
Iniciar sesión en el sistema.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Inicio de sesion exitoso"
}
```
*Cookie: `AUTH_TOKEN` (httpOnly, secure, 90 min)*

**Response (Error):**
```json
{
  "status": "error",
  "httpCode": 400/401/500,
  "message": "Descripción del error"
}
```

---

### POST `/api/auth/register`
Registrar un nuevo usuario.

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "rol": "string"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Usuario registrado correctamente"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

---

### POST `/api/auth/admin/register`
Registrar un nuevo administrador.

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "rol": "string"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Administrador registrado"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

---

### POST `/api/auth/logout`
Cerrar sesión (requiere cookie AUTH_TOKEN).

**Request:** Body vacío `{}`

**Response (200 OK):**
```text
"Logout success"
```

**Response (Error):**
```text
"Logout fallido: Token inválido o no encontrado"
```

---

### GET `/api/auth/me`
Obtener información del usuario autenticado (requiere cookie AUTH_TOKEN).

**Request:** Sin parámetros

**Response (200 OK):**
```json
{
  "id": 123,
  "username": "string",
  "email": "string",
  "rol": "string"
}
```

**Response (Error):**
- `400 Bad Request` - Token no proporcionado
- `204 No Content` - Usuario no encontrado
- `403 Forbidden` - Token inválido

---

### GET `/api/auth/accounts`
Obtener todas las cuentas de usuario (requiere cookie AUTH_TOKEN).

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id": 123,
    "username": "string",
    "email": "string",
    "rol": "string"
  }
]
```

**Response (Error):**
- `400 Bad Request` - Token no proporcionado
- `204 No Content` - No hay usuarios

---

## 🐾 Mascotas (`/api/mascotas`)

### POST `/api/mascotas/aniadir`
Añadir una nueva mascota.

**Request:**
```json
{
  "tamanio": "PEQUENIO|MEDIANO|GRANDE",
  "estadoAdopcion": "ADOPTADO|DISPONIBLE|EN_PROCESO",
  "estadoSalud": "SALUDABLE|ENFERMO|CONVALECIENTE",
  "edad": 0,
  "raza": "string",
  "especie": "string",
  "id_institucion": {
    "id_institucion": 123
  }
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Mascota añadida correctamente"
}
```

---

### POST `/api/mascotas/actualizar`
Actualizar información de una mascota.

**Request:**
```json
{
  "id": 123,
  "tamanio": "PEQUENIO|MEDIANO|GRANDE",
  "estadoAdopcion": "ADOPTADO|DISPONIBLE|EN_PROCESO",
  "estadoSalud": "SALUDABLE|ENFERMO|CONVALECIENTE",
  "edad": 0,
  "raza": "string",
  "especie": "string",
  "id_institucion": {
    "id_institucion": 123
  }
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Mascota actualizada"
}
```

---

### POST `/api/mascotas/eliminar`
Eliminar una mascota.

**Request:**
```json
{
  "id": 123
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Mascota eliminada"
}
```

---

### GET `/api/mascotas/obtenerTodas`
Obtener todas las mascotas.

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id": 123,
    "tamanio": "string",
    "estadoAdopcion": "string",
    "estadoSalud": "string",
    "edad": 0,
    "raza": "string",
    "especie": "string"
  }
]
```

---

### GET `/api/mascotas/obtenerPorId`
Obtener mascota por ID.

**Request:** `?id=123` (query param)

**Response (200 OK):**
```json
{
  "id": 123,
  "tamanio": "string",
  "estadoAdopcion": "string",
  "estadoSalud": "string",
  "edad": 0,
  "raza": "string",
  "especie": "string"
}
```

---

## 📝 Publicaciones (`/api/publicacion`)

### POST `/api/publicacion/crear`
Crear una nueva publicación.

**Request:**
```json
{
  "id_usuario": {
    "id": 123
  },
  "topico": "string",
  "contenido": "string",
  "likes": 0,
  "fecha_pregunta": "2024-01-01T10:00:00"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Publicación creada"
}
```

---

### POST `/api/publicacion/actualizar`
Actualizar una publicación.

**Request:**
```json
{
  "id_publicacion": 123,
  "topico": "string",
  "contenido": "string",
  "likes": 0,
  "fecha_edicion": "2024-01-01T10:00:00"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Publicación actualizada"
}
```

---

### DELETE `/api/publicacion/eliminar`
Eliminar una publicación.

**Request:**
```json
123
```
*(Long id)*

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Publicación eliminada"
}
```

---

### GET `/api/publicacion/obtenerTodas`
Obtener todas las publicaciones.

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id_publicacion": 123,
    "topico": "string",
    "contenido": "string",
    "likes": 0,
    "fecha_pregunta": "2024-01-01T10:00:00",
    "fecha_edicion": "2024-01-01T10:00:00",
    "fecha_duda_resuelta": "2024-01-01T10:00:00"
  }
]
```

---

### GET `/api/publicacion/obtenerPorId`
Obtener publicación por ID.

**Request:**
```json
123
```
*(Long id en body)*

**Response (200 OK):**
```json
{
  "id_publicacion": 123,
  "topico": "string",
  "contenido": "string",
  "likes": 0
}
```

---

### GET `/api/publicacion/obtenerPublicacionesPublicas`
Obtener publicaciones públicas (últimas 10).

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id_publicacion": 123,
    "topico": "string",
    "contenido": "string",
    "nombreUsuario": "string",
    "likes": 0,
    "fecha_pregunta": "2024-01-01 10:00:00",
    "fecha_duda_resuelta": null,
    "fecha_edicion": null
  }
]
```

---

### GET `/api/publicacion/obtenerFavUsuario`
Obtener publicaciones favoritas de un usuario.

**Request:** `?id_usuario=123` (query param)

**Response (200 OK):**
```json
[
  {
    "id_publicacion": 123,
    "topico": "string",
    "contenido": "string",
    "nombreUsuario": "string",
    "likes": 0,
    "fecha_pregunta": "2024-01-01 10:00:00",
    "fecha_duda_resuelta": null,
    "fecha_edicion": null
  }
]
```

---

### POST `/api/publicacion/putPublicacionFav`
Agregar publicación a favoritos de usuario.

**Request:** `?id_publicacion=123&id_usuario=456` (query params)

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Publicacion añadida a favoritos"
}
```

---

### DELETE `/api/publicacion/deletePublicacionFav`
Eliminar publicación de favoritos de usuario.

**Request:** `?id_publicacion=123&id_usuario=456` (query params)

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Publicacion eliminada de favoritos"
}
```

---

## 👤 Usuarios (`/api/usuario`)

### PUT `/api/usuario/actualizar`
Actualizar información del usuario.

**Request:**
```json
{
  "id": 123,
  "nombre": "string",
  "email": "string",
  "rol": "string",
  "imagen_url": "string",
  "biografia": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Usuario actualizado"
}
```

---

### DELETE `/api/usuario/eliminar`
Eliminar un usuario.

**Request:**
```json
123
```
*(Long id en body)*

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "El usuario se ha eliminado correctamente"
}
```

---

## 💬 Comentarios (`/api/comentario`)

### POST `/api/comentario/crear`
Crear un comentario.

**Request:**
```json
{
  "id_publicacion": {
    "id_publicacion": 123
  },
  "id_usuario": {
    "id": 456
  },
  "contenido": "string",
  "fecha_comentario": "2024-01-01T10:00:00"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Comentario creado"
}
```

---

### POST `/api/comentario/actualizar`
Actualizar un comentario.

**Request:**
```json
{
  "id_comentario": 123,
  "contenido": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Comentario actualizado"
}
```

---

### DELETE `/api/comentario/eliminar`
Eliminar un comentario.

**Request:**
```json
{
  "id_comentario": 123
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Comentario eliminado"
}
```

---

### GET `/api/comentario/obtenerTodos`
Obtener todos los comentarios.

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id_comentario": 123,
    "contenido": "string",
    "fecha_comentario": "2024-01-01T10:00:00"
  }
]
```

---

### GET `/api/comentario/obtenerPorId`
Obtener comentario por ID.

**Request:** `?id_comentario=123` (query param)

**Response (200 OK):**
```json
{
  "id_comentario": 123,
  "contenido": "string",
  "fecha_comentario": "2024-01-01T10:00:00"
}
```

---

## 💰 Donaciones (`/api/donacion`)

### POST `/api/donacion/crear`
Crear una donación.

**Request:**
```json
{
  "status": "PENDIENTE|COMPLETADA|CANCELADA",
  "monto": 100.50,
  "fecha_inicio": "2024-01-01T10:00:00",
  "id_usuario": {
    "id": 123
  },
  "id_institucion": {
    "id_institucion": 456
  }
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Donación creada"
}
```

---

### POST `/api/donacion/actualizar`
Actualizar una donación.

**Request:**
```json
{
  "id_donacion": 123,
  "status": "COMPLETADA",
  "monto": 100.50
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Donación actualizada"
}
```

---

### DELETE `/api/donacion/eliminar`
Eliminar una donación.

**Request:**
```json
{
  "id_donacion": 123
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Donación eliminada"
}
```

---

### GET `/api/donacion/obtenerTodas`
Obtener todas las donaciones.

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id_donacion": 123,
    "status": "COMPLETADA",
    "monto": 100.50,
    "fecha_inicio": "2024-01-01T10:00:00"
  }
]
```

---

### GET `/api/donacion/obtenerPorId`
Obtener donación por ID.

**Request:** `?idDonacion=123` (query param)

**Response (200 OK):**
```json
{
  "id_donacion": 123,
  "status": "COMPLETADA",
  "monto": 100.50,
  "fecha_inicio": "2024-01-01T10:00:00"
}
```

---

## 🏥 Instituciones (`/api/institucion`)

### POST `/api/institucion/agregar`
Agregar una institución.

**Request:**
```json
{
  "id_usuario": {
    "id": 123
  },
  "nombre": "string",
  "tipo": "REFUGIO|VETERINARIA|PROTECTORA",
  "email": "string",
  "descripcion": "string",
  "horario_inicio": "09:00:00",
  "horario_fin": "18:00:00"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Institución agregada"
}
```

---

### POST `/api/institucion/actualizar`
Actualizar una institución.

**Request:**
```json
{
  "id_institucion": 123,
  "nombre": "string",
  "tipo": "REFUGIO|VETERINARIA|PROTECTORA",
  "email": "string",
  "descripcion": "string",
  "horario_inicio": "09:00:00",
  "horario_fin": "18:00:00"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Institución actualizada"
}
```

---

### POST `/api/institucion/eliminar`
Eliminar una institución.

**Request:**
```json
123
```
*(Long id)*

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Institución eliminada"
}
```

---

### GET `/api/institucion/obtenerTodas`
Obtener todas las instituciones.

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id_institucion": 123,
    "nombre": "string",
    "tipo": "REFUGIO",
    "email": "string",
    "descripcion": "string",
    "horario_inicio": "09:00:00",
    "horario_fin": "18:00:00"
  }
]
```

---

### GET `/api/institucion/obtenerPorId`
Obtener institución por ID.

**Request:** `?id=123` (query param)

**Response (200 OK):**
```json
{
  "id_institucion": 123,
  "nombre": "string",
  "tipo": "REFUGIO",
  "email": "string",
  "descripcion": "string",
  "horario_inicio": "09:00:00",
  "horario_fin": "18:00:00"
}
```

---

## 👨‍⚕️ Veterinarios (`/api/veterinario`)

### POST `/api/veterinario/crear`
Crear un veterinario.

**Request:**
```json
{
  "nombre": "string",
  "id_institucion": {
    "id_institucion": 123
  }
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Veterinario creado"
}
```

---

### POST `/api/veterinario/actualizar`
Actualizar un veterinario.

**Request:**
```json
{
  "id_veterinario": 123,
  "nombre": "string",
  "id_institucion": {
    "id_institucion": 456
  }
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Veterinario actualizado"
}
```

---

### DELETE `/api/veterinario/eliminar`
Eliminar un veterinario.

**Request:**
```json
123
```
*(Long id)*

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Veterinario eliminado"
}
```

---

### GET `/api/veterinario/obtenerTodos`
Obtener todos los veterinarios.

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "id_veterinario": 123,
    "nombre": "string"
  }
]
```

---

### GET `/api/veterinario/obtenerPorId`
Obtener veterinario por ID.

**Request:** `?id_veterinario=123` (query param)

**Response (200 OK):**
```json
{
  "id_veterinario": 123,
  "nombre": "string"
}
```

---

## 🩺 Atenciones (`/api/atencion`)

### POST `/api/atencion/empezar`
Iniciar una atención.

**Request:**
```json
{
  "diagnostico": {
    "id_diagnostico": 123
  },
  "veterinario": {
    "id_veterinario": 456
  },
  "mascota": {
    "id": 789
  },
  "fecha_inicio": "2024-01-01T10:00:00",
  "motivo_consulta": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Atención iniciada"
}
```

---

### POST `/api/atencion/actualizar`
Actualizar una atención.

**Request:**
```json
{
  "id": {
    "idDiagnostico": 123,
    "idVeterinario": 456,
    "idMascota": 789
  },
  "motivo_consulta": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Atención actualizada"
}
```

---

### DELETE `/api/atencion/eliminar`
Eliminar una atención.

**Request:**
```json
{
  "id": {
    "idDiagnostico": 123,
    "idVeterinario": 456,
    "idMascota": 789
  }
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Atención eliminada"
}
```

---

### POST `/api/atencion/completar`
Completar una atención.

**Request:**
```json
{
  "id": {
    "idDiagnostico": 123,
    "idVeterinario": 456,
    "idMascota": 789
  },
  "fecha_final": "2024-01-01T18:00:00"
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Atención completada"
}
```

---

### GET `/api/atencion/obtenerTodas`
Obtener todas las atenciones.

**Request:** Sin parámetros

**Response (200 OK):**
```json
[
  {
    "fecha_inicio": "2024-01-01T10:00:00",
    "fecha_final": "2024-01-01T18:00:00",
    "motivo_consulta": "string"
  }
]
```

---

### GET `/api/atencion/obtenerPorId`
Obtener atención por ID compuesto.

**Request:**
```json
{
  "idDiagnostico": 123,
  "idVeterinario": 456,
  "idMascota": 789
}
```

**Response (200 OK):**
```json
{
  "fecha_inicio": "2024-01-01T10:00:00",
  "fecha_final": "2024-01-01T18:00:00",
  "motivo_consulta": "string"
}
```

---

## 💬 Chat (`/api/chat`)

### POST `/api/chat/crearChat`
Crear un chat.

**Request:**
```json
{
  "id_chat": 123,
  "nombreChat": "string",
  "usuario": {
    "id": 456
  },
  "administrador": {
    "id": 789
  }
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Chat creado"
}
```

---

### DELETE `/api/chat/eliminarChat`
Eliminar un chat.

**Request:**
```json
{
  "id_chat": 123
}
```

**Response:**
```json
{
  "status": "success",
  "httpCode": 200,
  "message": "Chat eliminado"
}
```

---

### GET `/api/chat/obtenerChatsPorUsuario`
Obtener chats de un usuario.

**Request:** `?id_usuario=123` (query param)

**Response (200 OK):**
```json
[
  {
    "id_chat": 123,
    "nombreChat": "string"
  }
]
```

---

### GET `/api/chat/obtenerMensajesPorChat`
Obtener mensajes de un chat.

**Request:** `?id_chat=123` (query param)

**Response (200 OK):**
```json
[
  {
    "id_mensaje": 123,
    "contenido": "string",
    "fecha_envio": "2024-01-01T10:00:00"
  }
]
```

---

## 🔌 WebSocket

### WebSocket `/chat/**`
Conexión WebSocket para chat en tiempo real.

**Conexión:**
```
ws://localhost:8080/chat/{chat_name}
```

**Headers requeridos:**
- `Cookie: AUTH_TOKEN` (autenticación JWT)

**Uso:**
- Envía mensajes de texto para ser entregados a todos los usuarios conectados en ese chat
- Los mensajes se distribuyen a todas las sesiones en el mismo chat

---

### WebSocket `/post/**`
Conexión WebSocket para búsqueda de publicaciones en tiempo real.

**Conexión:**
```
ws://localhost:8080/post/{canal}
```

**Headers requeridos:**
- `Cookie: AUTH_TOKEN` (autenticación JWT)

**Uso:**
- Envía contenido como búsqueda para obtener publicaciones coincidentes
- Retorna lista de publicaciones que coinciden con el contenido de búsqueda
- Los resultados se envían al cliente que realizó la búsqueda

**Message Response:**
```json
[
  {
    "id_publicacion": 123,
    "topico": "string",
    "contenido": "string",
    "nombreUsuario": "string",
    "likes": 0,
    "fecha_pregunta": "2024-01-01 10:00:00",
    "fecha_duda_resuelta": null,
    "fecha_edicion": null
  }
]
```

---

## 📊 Resumen

- **Total de controladores**: 10
- **Total de endpoints REST**: 55
- **Total de WebSocket**: 2
- **Base URL**: `/api`

## 🔗 Recursos

- [AuthController](src/main/java/com/surrogate/Zoolip/controllers/Auth/AuthController.java)
- [MascotaController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/MascotaController.java)
- [PublicacionController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/PublicacionController.java)
- [UsuarioController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/UsuarioController.java)
- [ComentarioController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/ComentarioController.java)
- [DonacionController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/DonacionController.java)
- [InstitucionController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/InstitucionController.java)
- [VeterinarioController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/VeterinarioController.java)
- [AtencionController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/AtencionController.java)
- [ChatController](src/main/java/com/surrogate/Zoolip/controllers/Bussines/ChatController.java)

---

## 📌 Notas Importantes

1. **Autenticación**: Los endpoints de `/api/auth/me`, `/api/auth/accounts` y `/api/auth/logout` requieren la cookie `AUTH_TOKEN`. WebSockets requieren cookie de autenticación en el handshake.
2. **Content-Type**: La mayoría de los endpoints POST/DELETE esperan `application/json`.
3. **Códigos HTTP**: Revisa el campo `httpCode` en las respuestas para determinar el estado de la operación.
4. **Fechas**: Formato ISO 8601 (`YYYY-MM-DDTHH:mm:ss`) o con espacios (`YYYY-MM-dd HH:mm:ss`).
5. **IDs relacionales**: Algunos endpoints requieren objetos anidados con IDs de entidades relacionadas.
6. **Usuario**: Ahora soporta campos adicionales como `imagen_url` (URL de foto de perfil) y `biografia` (descripción personal).
7. **Publicaciones**: Incluyen tipo (PUBLICACION|CONSULTA) e `imagen_url`. Las publicaciones de tipo CONSULTA no pueden tener imágenes.
8. **Favoritos**: Las publicaciones pueden ser marcadas como favoritas por usuarios usando los endpoints `putPublicacionFav` y `deletePublicacionFav`.
9. **Búsqueda en tiempo real**: Usa WebSocket `/post/**` para buscar publicaciones por contenido en tiempo real.
