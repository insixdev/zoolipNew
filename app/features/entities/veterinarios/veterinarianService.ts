import {
  VeterinarianCreateRequest,
  VeterinarianUpdateRequest,
  VeterinarianResponse,
  VeterinarianGetResponse,
} from "./types";

/** URL base del backend de veterinarios */
const BASE_VETERINARIAN_URL =
  process.env.BASE_VETERINARIAN_URL || "http://localhost:3050/api/veterinario/";

/**
 * Crea un nuevo veterinario en el sistema
 * @param veterinarian - Datos del veterinario a crear
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function createVeterinarianService(
  veterinarian: VeterinarianCreateRequest,
  cookie: string
): Promise<VeterinarianResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_VETERINARIAN_URL}crear`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(veterinarian),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al crear veterinario");
    }

    return data;
  } catch (err) {
    console.error("Create veterinarian error:", err);
    throw err;
  }
}

/**
 * Actualiza un veterinario existente
 * @param veterinarian - Datos actualizados del veterinario (debe incluir id_veterinario)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function updateVeterinarianService(
  veterinarian: VeterinarianUpdateRequest,
  cookie: string
): Promise<VeterinarianResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_VETERINARIAN_URL}actualizar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(veterinarian),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar veterinario");
    }

    return data;
  } catch (err) {
    console.error("Update veterinarian error:", err);
    throw err;
  }
}

/**
 * Elimina un veterinario del sistema
 * @param id - ID del veterinario a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deleteVeterinarianService(
  id: number,
  cookie: string
): Promise<VeterinarianResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_VETERINARIAN_URL}eliminar`, {
      method: "DELETE",
      headers: hd,
      body: JSON.stringify(id),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar veterinario");
    }

    return data;
  } catch (err) {
    console.error("Delete veterinarian error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de un veterinario por su ID
 * @param id - ID del veterinario a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos del veterinario
 * @throws Error si falla la petición o no se encuentra el veterinario
 */
export async function getVeterinarianByIdService(
  id: number,
  cookie: string
): Promise<VeterinarianGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(
      `${BASE_VETERINARIAN_URL}obtenerPorId?id_veterinario=${id}`,
      {
        method: "GET",
        headers: hd,
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener veterinario");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get veterinarian by id error:", err);
    throw err;
  }
}

/**
 * Obtiene todos los veterinarios registrados en el sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de veterinarios
 * @throws Error si falla la petición
 */
export async function getAllVeterinariansService(
  cookie: string
): Promise<VeterinarianGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_VETERINARIAN_URL}obtenerTodos`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener veterinarios");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all veterinarians error:", err);
    throw err;
  }
}
