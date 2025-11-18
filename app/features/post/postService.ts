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

    console.log("[SERVICE] Creando publicacion:", {
      tipo: publication.tipo,
      topico: publication.topico,
      tiene_imagen: !!publication.imagen_url,
      imagen_url: publication.imagen_url,
    });
    console.log("[SERVICE] PERRRA:", publication );

    const res = await fetch(`${BASE_PUBLICATION_URL}crear`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(publication),
    });

    console.log("[SERVICE] Respuesta del backend:", res.status, res.statusText);

    return await handleFetchResponse<PublicationResponse>(res);
  } catch (err) {
    console.error("[SERVICE] Error al crear publicacion:", err);
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

    const url = `${BASE_PUBLICATION_URL}obtenerPorId?id_publicacion=${id}`;
    console.log(`[POST] Fetching publication from: ${url}`);
    console.log(`[POST] Full cookie: ${cookie}`);
    console.log(`[POST] Headers:`, {
      "Content-Type": hd.get("Content-Type"),
      Cookie: hd.get("Cookie"),
    });

    const res = await fetch(url, {
      method: "GET",
      headers: hd,
    });

    console.log(`[POST] Response status: ${res.status} ${res.statusText}`);

    // Si obtenemos 403, intentar obtener desde el endpoint público
    if (res.status === 403) {
      console.log(
        "[POST] 403 error, trying to fetch from public endpoint instead"
      );
      const publicRes = await fetch(
        `${BASE_PUBLICATION_URL}obtenerPublicacionesPublicas`,
        {
          method: "GET",
          headers: hd,
        }
      );

      if (publicRes.ok) {
        const allPosts = await publicRes.json();
        const post = allPosts.find((p: any) => p.id_publicacion === id);
        if (post) {
          console.log("[POST] Found post in public endpoint");
          return post;
        }
      }
    }

    return await handleFetchResponse<PublicationGetResponse>(res);
  } catch (err) {
    console.error("[POST] Get publication by id error:", err);
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
 * Obtiene publicaciones con paginación
 * @param lastPublicationId - ID de la última publicación visible (para cargar las siguientes). Si es 0, obtiene las primeras.
 * @param cookie - Cookie de autenticación (opcional)
 * @returns Promise con array de publicaciones
 * @throws Error si falla la petición
 */
export async function getPublicationsWithPaginationService(
  lastPublicationId: number = 1,
  cookie?: string
): Promise<PublicationPublicGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");

    // Solo agregar cookie si está disponible
    if (cookie) {
      hd.append("Cookie", cookie);
    }

    // El backend requiere el parámetro id_publicacion
    // Si es 0, usar 1 para empezar desde el principio
    const startId = lastPublicationId <= 0 ? 1 : lastPublicationId;
    const url = `${BASE_PUBLICATION_URL}obtenerTodas?id_publicacion=${startId}`;

    console.log(
      "[POST SERVICE] Fetching publications from:",
      url,
      `(starting from ID: ${startId})`,
      cookie ? "(with auth)" : "(public)"
    );

    const res = await fetch(url, {
      method: "GET",
      headers: hd,
    });

    console.log("[POST SERVICE] Response status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      let errorMessage = "Error al obtener publicaciones";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      console.error("[POST SERVICE] Error:", errorMessage);
      // Devolver array vacío en lugar de lanzar error
      return [];
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      console.log("[POST SERVICE] Empty response, returning empty array");
      return [];
    }

    const data = JSON.parse(text);
    const postsCount = Array.isArray(data) ? data.length : 0;
    console.log(`[POST SERVICE] Cargadas ${postsCount} publicaciones`);

    if (Array.isArray(data) && data.length > 0) {
      const postsConImagen = data.filter(
        (p: any) => p.imagen_url || p.imagenUrl
      ).length;
      console.log(
        `[POST SERVICE] ${postsConImagen} publicaciones tienen imagen`
      );

      // Log de las primeras 3 publicaciones con imagen
      data
        .filter((p: any) => p.imagen_url || p.imagenUrl)
        .slice(0, 3)
        .forEach((p: any) => {
          console.log(
            `[POST SERVICE] Post ${p.id_publicacion || p.idPublicacion} imagen:`,
            p.imagen_url || p.imagenUrl
          );
        });
    }

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[POST SERVICE] Get publications error:", err);
    // Devolver array vacío en lugar de lanzar error para no romper la UI
    return [];
  }
}

/**
 * Obtiene publicaciones públicas (últimas 10)
 * @param cookie - Cookie de autenticación (opcional, el endpoint es público)
 * @returns Promise con array de publicaciones públicas
 * @throws Error si falla la petición
 */
export async function getAllPublicPublicationsService(
  cookie?: string
): Promise<PublicationPublicGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");

    // Solo agregar cookie si está disponible
    if (cookie) {
      hd.append("Cookie", cookie);
    }

    console.log(
      "[POST SERVICE] Fetching public publications from:",
      `${BASE_PUBLICATION_URL}obtenerPublicacionesPublicas`,
      cookie ? "(with auth)" : "(public)"
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
    console.log("Parsed data:", data);

    if (Array.isArray(data) && data.length > 0) {
      console.log(JSON.stringify(data[0], null, 2));
      // Log específico para imagen_url
      data.forEach((post: any) => {
        if (post.imagen_url || post.imagenUrl) {
          console.log(
            `📷 [SERVICE] Post ${post.idPublicacion || post.id_publicacion} tiene imagen_url:`,
            post.imagen_url || post.imagenUrl
          );
        }
      });
    }

    return data;
  } catch (err) {
    console.error("Get public publications error:", err);
    throw err;
  }
}

/**
 * Obtiene todas las publicaciones de un usuario específico
 * @param userId - ID del usuario
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de publicaciones del usuario
 * @throws Error si falla la petición
 */
export async function getPublicationsByUserService(
  userId: number,
  cookie: string
): Promise<PublicationPublicGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Cookie", cookie);
    hd.append("Content-Type", "application/json");

    const url = `${BASE_PUBLICATION_URL}obtenerPorUsuario?id_usuario=${userId}`;
    console.log(`[POST SERVICE] Fetching user publications from: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: hd,
    });

    console.log(`[POST SERVICE] Response status: ${res.status}`);

    // Si no hay publicaciones, devolver array vacío
    if (res.status === 204 || !res.ok) {
      console.log(`[POST SERVICE] No publications found for user ${userId}`);
      return [];
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      console.log("[POST SERVICE] Empty response, returning empty array");
      return [];
    }

    const data = JSON.parse(text);
    console.log(
      `[POST SERVICE] User publications loaded: ${Array.isArray(data) ? data.length : 0}`
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[POST SERVICE] Get user publications error:", err);
    // Devolver array vacío en lugar de lanzar error
    return [];
  }
}

/**
 * Obtiene todas las publicaciones del usuario autenticado actual
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de publicaciones del usuario actual
 * @throws Error si falla la petición
 */
export async function getCurrentUserPublicationsService(
  cookie: string
): Promise<PublicationPublicGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Cookie", cookie);
    hd.append("Content-Type", "application/json");

    const url = `${BASE_PUBLICATION_URL}obtenerPorUsuarioCurrent`;

    const res = await fetch(url, {
      method: "GET",
      headers: hd,
    });

    if (res.status === 204 || !res.ok) {
      return [];
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      return [];
    }

    const data = JSON.parse(text);

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[POST SERVICE] Get current user publications error:", err);
    return [];
  }
}
