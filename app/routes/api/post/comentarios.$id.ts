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

    console.log(`Obteniendo comentarios para publicación ID: ${id}`);

    const commentsFromBackend = await getCommentsByPublicationService(
      parseInt(id),
      cookieHeader
    );

    console.log(
      `Comentarios obtenidos del backend: ${commentsFromBackend.length}`
    );

    // Parsear los comentarios al formato del frontend
    const comments = parseCommentsResponse(commentsFromBackend);

    console.log(`Comentarios parseados: ${comments.length}`);

    return Response.json({ comments });
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    // Si el backend tiene un error, devolver array vacío sin error 500
    // para que la UI no se rompa
    console.log(
      "Devolviendo array vacío de comentarios debido al error del backend"
    );
    return Response.json({
      comments: [],
      warning: errorMessage,
    });
  }
}
