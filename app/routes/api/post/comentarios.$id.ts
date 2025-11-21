import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const { id } = params;

  if (!cookieHeader) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!id) {
    return Response.json(
      { error: "ID de publicación requerido" },
      { status: 400 }
    );
  }

  try {
    const { getCommentsByPublicationService } = await import(
      "~/features/post/comments/commentService"
    );
    const { parseCommentsResponse } = await import(
      "~/features/post/comments/commentResponseParse"
    );

    console.log(`[COMMENTS API] Obteniendo comentarios para publicación ID: ${id}`);

    let commentsFromBackend: any[];
    try {
      commentsFromBackend = await getCommentsByPublicationService(
        parseInt(id),
        cookieHeader
      );
    } catch (serviceError) {
      console.error(
        `[COMMENTS API] Error del servicio al obtener comentarios: ${serviceError}`
      );
      // Si falla el servicio, retornar array vacío pero no error
      return Response.json({
        comments: [],
        warning: `Servicio de comentarios no disponible: ${serviceError instanceof Error ? serviceError.message : String(serviceError)}`,
      });
    }

    if (!Array.isArray(commentsFromBackend)) {
      console.warn(
        `[COMMENTS API] Respuesta no es un array:`,
        commentsFromBackend
      );
      commentsFromBackend = [];
    }

    console.log(
      `[COMMENTS API] Comentarios obtenidos del backend: ${commentsFromBackend.length}`
    );

    // Parsear los comentarios al formato del frontend
    const comments = parseCommentsResponse(commentsFromBackend);

    console.log(`[COMMENTS API] Comentarios parseados: ${comments.length}`);
    if (comments.length > 0) {
      console.log(`[COMMENTS API] Primer comentario:`, JSON.stringify(comments[0], null, 2));
    }

    return Response.json({ comments });
  } catch (error) {
    console.error("[COMMENTS API] Error obteniendo comentarios:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    // Si el backend tiene un error, devolver array vacío sin error 500
    // para que la UI no se rompa
    console.log(
      "[COMMENTS API] Devolviendo array vacío de comentarios debido al error del backend"
    );
    return Response.json({
      comments: [],
      warning: errorMessage,
    });
  }
}
