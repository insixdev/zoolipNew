// Servicio para gestión de usuarios

export type UsuarioDTO = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_registro?: string;
  activo?: boolean;
};

const BASE_URL = typeof process !== 'undefined' && process.env.BASE_AUTH_URL 
  ? process.env.BASE_AUTH_URL 
  : "http://localhost:3050/api/auth";

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
    console.error("USER SERVICE Error fetching users:", error);
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
    console.log("IDD", id);
    headers.append("Cookie", cookie);

    const response = await fetch(`http://localhost:3050/api/usuario/getUsuarioById?id_usuario=${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Procesar imagenUrl para agregar .png si no tiene extensión
    if (data.imagenUrl && !data.imagenUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      data.imagenUrl += ".png";
    }
    
    // Convertir imagenUrl a imagen_url para consistencia
    if (data.imagenUrl && !data.imagen_url) {
      data.imagen_url = data.imagenUrl;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
}

/**
 * Tipo para actualizar usuario
 * El ID y rol se obtienen del token, no se envían en el body
 * Todos los campos son opcionales - solo se envían los que tienen valor
 */
export type UpdateUserRequest = {
  nombre?: string;
  email?: string;
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

    const url = "http://localhost:3050/api/auth/updateCurrentUser";
    
    console.log("[USER SERVICE] Enviando a backend:", {
      url,
      userData,
      hasImagenUrl: !!userData.imagen_url,
      imagenUrlValue: userData.imagen_url,
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
    });

    console.log("[USER SERVICE] Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.body}`);
    }

    const data = await response.json();
    console.log("[USER SERVICE] Response data:", data);
    return data;
  } catch (error) {
    console.error("USER SERVICE Error updating user:", error);
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
 * Obtiene los primeros 5 usuarios
 * Endpoint: GET /get5Usuarios
 */
export async function get5UsersService(cookie: string): Promise<UsuarioDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const url = `http://localhost:3050/api/usuario/get5Usuarios`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (response.status === 204 || response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("USER SERVICE Error fetching 5 users:", error);
    throw error;
  }
}

/**
 * Obtiene usuarios con límite basado en un ID de usuario
 * Endpoint: GET /getUsuarios?id_usuario={id}
 */
export async function getUsersWithLimitService(
  userId: number,
  cookie: string
): Promise<UsuarioDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const url = `http://localhost:3050/api/usuario/getUsuarios?id_usuario=${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (response.status === 204 || response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("USER SERVICE Error fetching users with limit:", error);
    throw error;
  }
}

/**
 * Obtiene el usuario administrador de una institución
 * Endpoint: GET /getUsuarioByIdInstitucion?id_institucion={id}
 */
export async function getUserByInstitutionIdService(
  institutionId: number,
  cookie: string
): Promise<UsuarioDTO> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const url = `http://localhost:3050/api/usuario/getUsuarioByIdInstitucion?id_institucion=${institutionId}`;

    console.log("[USER SERVICE] Fetching user by institution:", url);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("[USER SERVICE] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[USER SERVICE] Error response:", errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[USER SERVICE] User data received:", data);
    console.log("[USER SERVICE] DTO fields:", {
      id: data.id,
      nombre: data.nombre,
      rol: data.rol,
      email: data.email,
      biografia: data.biografia,
      imagenUrl: data.imagenUrl,
    });
    
    // Procesar imagenUrl para agregar .png si no tiene extensión
    if (data.imagenUrl && !data.imagenUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      data.imagenUrl += ".png";
    }
    
    // Convertir imagenUrl a imagen_url para consistencia
    if (data.imagenUrl && !data.imagen_url) {
      data.imagen_url = data.imagenUrl;
    }
    
    return data;
  } catch (error) {
    console.error("[USER SERVICE] Error fetching user by institution:", error);
    throw error;
  }
}