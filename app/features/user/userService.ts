import { UserUpdateRequest, UserResponse } from "./types";

/**
 * Servicio para operaciones de usuarios
 * Ajusta las rutas del backend si es necesario (BASE_USER_URL)
 */
const BASE_USER_URL =
  process.env.BASE_USER_URL || "http://localhost:3050/api/usuario/";

/**
 * Actualiza la información de un usuario
 * @param user - Datos actualizados del usuario (debe incluir id)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function updateUserService(
  user: UserUpdateRequest,
  cookie: string
): Promise<UserResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_USER_URL}actualizar`, {
      method: "PUT",
      headers: hd,
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar usuario");
    }

    return data;
  } catch (err) {
    console.error("Update user error:", err);
    throw err;
  }
}

/**
 * Elimina un usuario del sistema
 * @param id - ID del usuario a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deleteUserService(
  id: number,
  cookie: string
): Promise<UserResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_USER_URL}eliminar`, {
      method: "DELETE",
      headers: hd,
      body: JSON.stringify(id),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar usuario");
    }

    return data;
  } catch (err) {
    console.error("Delete user error:", err);
    throw err;
  }
}

/**
 * Obtiene todos los usuarios del sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de usuarios
 * @throws Error si falla la petición
 */
export async function getAllUsersService(cookie?: string): Promise<any[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    if (cookie) hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_USER_URL}obtenerTodos`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Error al obtener usuarios");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all users error:", err);
    throw err;
  }
}

/**
 * Busca usuarios por query (username, email, nombre)
 * @param query - Texto de búsqueda
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de usuarios que coinciden
 * @throws Error si falla la petición
 */
export async function searchUsersService(
  query: string,
  cookie: string
): Promise<any[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    console.log(`🔍 Buscando usuarios con query: "${query}"`);

    const res = await fetch(
      `${BASE_USER_URL}buscar?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: hd,
      }
    );

    console.log(`📥 Status de búsqueda: ${res.status}`);

    if (!res.ok) {
      const text = await res.text();
      let errorMessage = "Error al buscar usuarios";
      try {
        const errorData = text ? JSON.parse(text) : {};
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      console.log("⚠️ Respuesta vacía del servidor");
      return [];
    }

    const data = JSON.parse(text);
    console.log(`✅ Usuarios encontrados: ${data.length}`);
    return data;
  } catch (err) {
    console.error("❌ Search users error:", err);
    throw err;
  }
}
