import { handleFetchResponse } from "~/lib/tokenErrorHandler";

/** URL base del backend de usuarios */
const BASE_USER_URL = "http://localhost:3050/api/usuario/";

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  email: string;
  imagen_url?: string;
  biografia?: string;
  fecha_registro?: string;
  // Agregar más campos según tu UsuarioDto
}

/**
 * Obtiene el perfil de un usuario por su ID
 * @param userId - ID del usuario
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos del usuario
 */
export async function getUserByIdService(
  userId: number,
  cookie: string
): Promise<UserProfile> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const url = `${BASE_USER_URL}getUsuarioById?id_usuario=${userId}`;
    console.log(`[USER] Fetching user profile from: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: hd,
    });

    console.log(`[USER] Response status: ${res.status}`);

    return await handleFetchResponse<UserProfile>(res);
  } catch (err) {
    console.error("[USER] Get user by id error:", err);
    throw err;
  }
}
