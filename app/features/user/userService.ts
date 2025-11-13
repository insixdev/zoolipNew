import { UserUpdateRequest, UserResponse } from "./types";
import { handleFetchResponse } from "~/lib/tokenErrorHandler";

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

    return await handleFetchResponse<UserResponse>(res);
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

    return await handleFetchResponse<UserResponse>(res);
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

    return await handleFetchResponse<any[]>(res);
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

    const text = await res.text();
    if (!text || text.trim() === "") {
      console.log("⚠️ Respuesta vacía del servidor");
      return [];
    }

    const data = JSON.parse(text);

    if (!res.ok) {
      const errorMessage =
        data.error || data.message || "Error al buscar usuarios";
      const error = new Error(errorMessage);
      (error as any).data = data;
      throw error;
    }

    console.log(`✅ Usuarios encontrados: ${data.length}`);
    return data;
  } catch (err) {
    console.error("❌ Search users error:", err);
    throw err;
  }
}
