import type { Comment } from "~/components/community/comentarios/CommentItem";
import type { CommentGetResponse } from "./types";
import { formatTimestamp } from "~/lib/formatTimestamp";

/**
 * Parsea la respuesta del backend de comentarios al formato del frontend
 * @param comments - Array de comentarios del backend
 * @returns Array de comentarios parseados para el frontend
 */
export function parseCommentsResponse(
  comments: CommentGetResponse[]
): Comment[] {
  try {
    // Validar entrada
    if (!comments) {
      console.warn("[COMMENT PARSE] Comments is null or undefined");
      return [];
    }
    
    if (!Array.isArray(comments)) {
      console.error("[COMMENT PARSE] Input is not an array:", comments);
      return [];
    }
    
    if (comments.length === 0) {
      console.log("[COMMENT PARSE] No comments to parse");
      return [];
    }

    const parsedComments: Comment[] = comments
      .filter((c) => {
        if (!c || typeof c !== "object") {
          console.warn("[COMMENT PARSE] Invalid comment object:", c);
          return false;
        }
        // Soportar tanto snake_case como camelCase
        const commentId =
          (c as any).id_comentario || (c as any).idComentario || c.idComentario;
        if (!commentId) {
          console.warn("[COMMENT PARSE] Comment without id:", c);
          return false;
        }
        // Validar que al menos tenga contenido
        if (!c.contenido) {
          console.warn("[COMMENT PARSE] Comment without content:", c);
          return false;
        }
        return true;
      })
      .map((comment) => {
        const c = comment as any;

        // Obtener el ID del comentario
        const commentId = c.id_comentario || c.idComentario || 0;

        // Obtener el nombre del usuario (soportar tanto nombreUsuario como nombre_usuario)
        const userName = c.nombreUsuario || c.nombre_usuario || c.name || c.nombre || "Usuario";

        // Obtener el ID del usuario (puede ser null o no venir del backend)
        // Si no viene, intentar generar uno basado en el hash del nombre de usuario
        let userId = c.id_usuario || c.idUsuario || null;
        
        if (!userId && userName && userName !== "Usuario") {
          // Generar un pseudo-ID basado en el nombre para poder navegar al perfil
          // (aunque sea diferente al real, al menos permite intentar navegar)
          const hash = userName.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
          }, 0);
          userId = Math.abs(hash) % 100000; // ID pseudo dentro de rango razonable
          console.log(`[COMMENT PARSE] Generated pseudo userId ${userId} for ${userName}`);
        }

        // Obtener el rol del usuario (puede ser null)
        const userRole = c.rolUsuario || c.rol_usuario || null;

        // Obtener la imagen del usuario
        let avatarUrl = c.imagen_usuario || c.imagenUsuario || c.imagen_url || c.imagenUrl || null;
        
        // Si no tiene extensión, agregar .png por defecto
        if (avatarUrl && !avatarUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          avatarUrl += ".png";
        }
        
        // Si la URL es relativa (empieza con /upload/), dejarla así
        // Si es relativa pero no tiene /upload/, agregar el prefijo
        let avatarDisplay: string | null = null;
        if (avatarUrl) {
          if (avatarUrl.startsWith("/") && !avatarUrl.startsWith("/upload/")) {
            avatarDisplay = `/upload/${avatarUrl}`;
          } else {
            avatarDisplay = avatarUrl;
          }
        }

        // Log para debug - ver qué datos llegan del backend
        console.log(`[COMMENT PARSE] Comment ${commentId}:`, {
          userName,
          userId,
          userRole,
          avatarUrl,
          hasCookie: !!c.id_usuario,
        });

        // Crear el comentario parseado
        const parsedComment: Comment = {
          id: commentId.toString(),
          content: c.contenido || "",
          author: {
            name: userName,
            username: userName.toLowerCase(),
            avatar: avatarDisplay,
            // Incluir userId si existe (necesario para navegar al perfil)
            ...(userId !== null && userId !== undefined && { userId }),
            // Solo incluir role si no es null
            ...(userRole !== null && { role: userRole }),
          },
          timestamp: c.fecha_comentario
            ? formatTimestamp(c.fecha_comentario)
            : "Ahora",
          likes: 0, // Por ahora no hay likes en comentarios
          isLiked: false,
        };

        return parsedComment;
      });

    console.log(`[COMMENT PARSE] Total parsed: ${parsedComments.length} comments successfully`);
    if (parsedComments.length > 0) {
      console.log(`[COMMENT PARSE] First comment:`, JSON.stringify(parsedComments[0], null, 2));
    }
    return parsedComments;
  } catch (err) {
    console.error("Error al parsear comentarios:", err);
    return [];
  }
}


