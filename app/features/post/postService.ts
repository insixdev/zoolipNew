import {
  PublicationCreateRequest,
  PublicationUpdateRequest,
  PublicationResponse,
  PublicationGetResponse,
} from "./types";

/** URL base del backend de publicaciones */
const BASE_PUBLICATION_URL =
  process.env.BASE_PUBLICATION_URL || "http://localhost:3050/api/publicacion/";

/**
 * Crea una nueva publicación en el foro
 * @param publication - Datos de la publicación a crear
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function createPublicationService(
  publication: PublicationCreateRequest,
  cookie: string
): Promise<PublicationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PUBLICATION_URL}crear`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(publication),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al crear publicación");
    }

    return data;
  } catch (err) {
    console.error("Create publication error:", err);
    throw err;
  }
}

/**
 * Actualiza una publicación existente
 * @param publication - Datos actualizados de la publicación (debe incluir id_publicacion)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function updatePublicationService(
  publication: PublicationUpdateRequest,
  cookie: string
): Promise<PublicationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PUBLICATION_URL}actualizar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(publication),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar publicación");
    }

    return data;
  } catch (err) {
    console.error("Update publication error:", err);
    throw err;
  }
}

/**
 * Elimina una publicación del sistema
 * @param id - ID de la publicación a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deletePublicationService(
  id: number,
  cookie: string
): Promise<PublicationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PUBLICATION_URL}eliminar`, {
      method: "DELETE",
      headers: hd,
      body: JSON.stringify(id),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar publicación");
    }

    return data;
  } catch (err) {
    console.error("Delete publication error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de una publicación por su ID
 * @param id - ID de la publicación a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos de la publicación
 * @throws Error si falla la petición o no se encuentra la publicación
 */
export async function getPublicationByIdService(
  id: number,
  cookie: string
): Promise<PublicationGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PUBLICATION_URL}obtenerPorId`, {
      method: "GET",
      headers: hd,
      body: JSON.stringify(id),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener publicación");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get publication by id error:", err);
    throw err;
  }
}

/**
 * Obtiene todas las publicaciones del sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de publicaciones
 * @throws Error si falla la petición
 */
export async function getAllPublicationsService(
  cookie: string
): Promise<PublicationGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PUBLICATION_URL}obtenerTodas`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener publicaciones");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all publications error:", err);
    throw err;
  }
}