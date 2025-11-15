// Servicio para gestión de usuarios

export type UsuarioDTO = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_registro?: string;
  activo?: boolean;
};

const BASE_URL = process.env.BASE_AUTH_URL || "http://localhost:3050/api/auth";

/**
 * Obtiene todos los usuarios (accounts)
 */
export async function getAllUsersService(
  cookie: string
): Promise<UsuarioDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const url = `${BASE_URL}/accounts`.replace(/([^:]\/)\/+/g, "$1");

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("👥 [USER SERVICE] Error fetching users:", error);
    throw error;
  }
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserByIdService(
  id: number,
  cookie: string
): Promise<UsuarioDTO> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/user/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
}

/**
 * Tipo para actualizar usuario
 */
export type UpdateUserRequest = {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
  imagen_url?: string;
  biografia?: string;
};

/**
 * Actualiza la información de un usuario
 * @param userData - Datos del usuario a actualizar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 */
export async function updateUserService(
  userData: UpdateUserRequest,
  cookie: string
): Promise<{ status: string; httpCode: number; message: string }> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const url = "http://localhost:3050/api/usuario/actualizar";

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("👤 [USER SERVICE] Error updating user:", error);
    throw error;
  }
}

/**
 * Elimina un usuario
 */
export async function deleteUserService(
  id: number,
  cookie: string
): Promise<any> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/delete/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar usuario");
    }

    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Obtiene información pública de un usuario por ID
 * Este endpoint es público y no requiere autenticación
 * @param userId - ID del usuario
 * @returns Promise con los datos del usuario
 */
export async function getPublicUserByIdService(
  userId: number
): Promise<UsuarioDTO> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const url = `http://localhost:3050/api/usuario/getUsuarioById?id_usuario=${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching public user by id:", error);
    throw error;
  }
}
