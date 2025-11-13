import {
  PublicationCreateRequest,
  PublicationUpdateRequest,
  PublicationResponse,
  PublicationGetResponse,
  PublicationPublicGetResponse,
} from "./types";
import { handleFetchResponse } from "~/lib/tokenErrorHandler";

/** URL base del backend de publicaciones */
const BASE_PUBLICATION_URL = "http://localhost:3050/api/publicacion/";

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
    console.log("jsonpublication", JSON.stringify(publication));

    const res = await fetch(`${BASE_PUBLICATION_URL}crear`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(publication),
    });

    return await handleFetchResponse<PublicationResponse>(res);
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

    return await handleFetchResponse<PublicationResponse>(res);
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

    return await handleFetchResponse<PublicationResponse>(res);
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

    return await handleFetchResponse<PublicationGetResponse>(res);
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

    return await handleFetchResponse<PublicationGetResponse[]>(res);
  } catch (err) {
    console.error("Get all publications error:", err);
    throw err;
  }
}

/**
 * Obtiene publicaciones favoritas de un usuario
 * @param userId - ID del usuario
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de publicaciones favoritas
 * @throws Error si falla la petición
 */
export async function getFavPublicationsService(
  userId: number,
  cookie: string
): Promise<PublicationGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(
      `${BASE_PUBLICATION_URL}obtenerFavUsuario?id_usuario=${userId}`,
      {
        method: "GET",
        headers: hd,
      }
    );

    return await handleFetchResponse<PublicationGetResponse[]>(res);
  } catch (err) {
    console.error("Get fav publications error:", err);
    throw err;
  }
}

/**
 * Agrega una publicación a favoritos
 * @param publicationId - ID de la publicación
 * @param userId - ID del usuario
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function addFavPublicationService(
  publicationId: number,
  userId: number,
  cookie: string
): Promise<PublicationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(
      `${BASE_PUBLICATION_URL}putPublicacionFav?id_publicacion=${publicationId}&id_usuario=${userId}`,
      {
        method: "POST",
        headers: hd,
      }
    );

    return await handleFetchResponse<PublicationResponse>(res);
  } catch (err) {
    console.error("Add fav publication error:", err);
    throw err;
  }
}

/**
 * Elimina una publicación de favoritos
 * @param publicationId - ID de la publicación
 * @param userId - ID del usuario
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function removeFavPublicationService(
  publicationId: number,
  userId: number,
  cookie: string
): Promise<PublicationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(
      `${BASE_PUBLICATION_URL}deletePublicacionFav?id_publicacion=${publicationId}&id_usuario=${userId}`,
      {
        method: "DELETE",
        headers: hd,
      }
    );

    return await handleFetchResponse<PublicationResponse>(res);
  } catch (err) {
    console.error("Remove fav publication error:", err);
    throw err;
  }
}

/**
 * Obtiene publicaciones públicas (últimas 10)
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de publicaciones públicas
 * @throws Error si falla la petición
 */
export async function getAllPublicPublicationsService(
  cookie: string
): Promise<PublicationPublicGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Cookie", cookie);
    hd.append("Content-Type", "application/json");

    console.log(
      "Fetching public publications from:",
      `${BASE_PUBLICATION_URL}obtenerPublicacionesPublicas`
    );

    const res = await fetch(
      `${BASE_PUBLICATION_URL}obtenerPublicacionesPublicas`,
      {
        method: "GET",
        headers: hd,
      }
    );

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);

    // Verificar si la respuesta tiene contenido
    const text = await res.text();
    console.log("Response text length:", text.length);

    if (!res.ok) {
      let errorMessage = "Error al obtener publicaciones públicas";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Si la respuesta está vacía, devolver array vacío
    if (!text || text.trim() === "") {
      console.log("Empty response, returning empty array");
      return [];
    }

    const data = JSON.parse(text);
    console.log(
      "Parsed data length:",
      Array.isArray(data) ? data.length : "not array"
    );
    return data;
  } catch (err) {
    console.error("Get public publications error:", err);
    throw err;
  }
}
