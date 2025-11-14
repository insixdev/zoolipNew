import type { Comment } from "~/components/community/comentarios/CommentItem";
import type { CommentGetResponse } from "./types";

/**
 * Parsea la respuesta del backend de comentarios al formato del frontend
 * @param comments - Array de comentarios del backend
 * @returns Array de comentarios parseados para el frontend
 */
export function parseCommentsResponse(
  comments: CommentGetResponse[]
): Comment[] {
  try {
    if (!Array.isArray(comments)) {
      console.error("parseCommentsResponse: input is not an array", comments);
      return [];
    }

    const parsedComments: Comment[] = comments
      .filter((c) => {
        if (!c || typeof c !== "object") {
          console.warn("Invalid comment object:", c);
          return false;
        }
        // Soportar tanto snake_case como camelCase
        const commentId =
          (c as any).id_comentario || (c as any).idComentario || c.idComentario;
        if (!commentId) {
          console.warn("Comment without id:", c);
          return false;
        }
        return true;
      })
      .map((comment) => {
        const c = comment as any;

        // Obtener el ID del comentario
        const commentId = c.id_comentario || c.idComentario || 0;

        // Obtener el nombre del usuario
        const userName = c.nombreUsuario || c.nombre_usuario || "Usuario";

        // Crear el comentario parseado
        const parsedComment: Comment = {
          id: commentId.toString(),
          content: c.contenido || "",
          author: {
            name: userName,
            username: userName.toLowerCase(),
            avatar: `https://i.pravatar.cc/150?u=${userName}`,
          },
          timestamp: c.fecha_comentario
            ? formatTimestamp(c.fecha_comentario)
            : "Ahora",
          likes: 0, // Por ahora no hay likes en comentarios
          isLiked: false,
        };

        return parsedComment;
      });

    console.log(`Parsed ${parsedComments.length} comments successfully`);
    return parsedComments;
  } catch (err) {
    console.error("Error al parsear comentarios:", err);
    return [];
  }
}

/**
 * Formatea un timestamp a formato relativo (ej: "Hace 2 horas")
 */
function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  } catch (err) {
    return "Ahora";
  }
}
