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
    console.log("👥 [USER SERVICE] Fetching all users from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("👥 [USER SERVICE] Response status:", response.status);

    if (response.status === 204) {
      console.log("👥 [USER SERVICE] No users found (204)");
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("👥 [USER SERVICE] Error response:", errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("👥 [USER SERVICE] Users loaded:", data.length);
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
 * Actualiza un usuario
 */
export async function updateUserService(
  user: Partial<UsuarioDTO>,
  cookie: string
): Promise<any> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/update`, {
      method: "POST",
      headers,
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar usuario");
    }

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
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
