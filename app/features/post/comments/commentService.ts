import {
  CommentCreateRequest,
  CommentUpdateRequest,
  CommentDeleteRequest,
  CommentResponse,
  CommentGetResponse,
} from "./types";

/** URL base del backend de comentarios */
const BASE_COMMENT_URL =
  process.env.BASE_COMMENT_URL || "http://localhost:3050/api/comentario/";

/**
 * Crea un nuevo comentario en una publicación
 * @param comment - Datos del comentario a crear
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function createCommentService(
  comment: CommentCreateRequest,
  cookie: string
): Promise<CommentResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_COMMENT_URL}crear`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(comment),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al crear comentario");
    }

    return data;
  } catch (err) {
    console.error("Create comment error:", err);
    throw err;
  }
}

/**
 * Actualiza un comentario existente
 * @param comment - Datos actualizados del comentario (debe incluir id_comentario)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function updateCommentService(
  comment: CommentUpdateRequest,
  cookie: string
): Promise<CommentResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_COMMENT_URL}actualizar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(comment),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar comentario");
    }

    return data;
  } catch (err) {
    console.error("Update comment error:", err);
    throw err;
  }
}

/**
 * Elimina un comentario del sistema
 * @param commentId - ID del comentario a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deleteCommentService(
  commentId: number,
  cookie: string
): Promise<CommentResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_COMMENT_URL}eliminar`, {
      method: "DELETE",
      headers: hd,
      body: JSON.stringify({ id_comentario: commentId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar comentario");
    }

    return data;
  } catch (err) {
    console.error("Delete comment error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de un comentario por su ID
 * @param commentId - ID del comentario a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos del comentario
 * @throws Error si falla la petición o no se encuentra el comentario
 */
export async function getCommentByIdService(
  commentId: number,
  cookie: string
): Promise<CommentGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(
      `${BASE_COMMENT_URL}obtenerPorId?id_comentario=${commentId}`,
      {
        method: "GET",
        headers: hd,
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener comentario");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get comment by id error:", err);
    throw err;
  }
}

/**
 * Obtiene todos los comentarios del sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de comentarios
 * @throws Error si falla la petición
 */
export async function getAllCommentsService(
  cookie: string
): Promise<CommentGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_COMMENT_URL}obtenerTodos`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener comentarios");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all comments error:", err);
    throw err;
  }
}

/**
 * Obtiene todos los comentarios de una publicación específica
 * @param publicationId - ID de la publicación
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de comentarios de la publicación
 * @throws Error si falla la petición
 */
export async function getCommentsByPublicationService(
  publicationId: number,
  cookie: string
): Promise<CommentGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const url = `${BASE_COMMENT_URL}obtenerPorIdPublicacion?id_publicacion=${publicationId}`;
    console.log(`Fetching comments from: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: hd,
    });
    console.log(`Response status: ${res.status}`);

    // 204 No Content significa que no hay comentarios
    if (res.status === 204) {
      console.log("No hay comentarios (204 No Content)");
      return [];
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[COMMENT] Error response:", data);
      throw new Error(
        data.message ||
          data.error ||
          "Error al obtener comentarios de la publicación"
      );
    }

    const data = await res.json();
    console.log(`[COMMENT] Comments received:`, data);
    return data;
  } catch (err) {
    console.error(" Get comments by publication error:", err);
    throw err;
  }
}
