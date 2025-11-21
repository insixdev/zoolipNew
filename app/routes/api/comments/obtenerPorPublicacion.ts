import { LoaderFunctionArgs } from "react-router";
import { getCommentsByPublicationService } from "~/features/post/comments/commentService";
import { parseCommentsResponse } from "~/features/post/comments/commentResponseParse";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      {
        status: "error",
        message: "No hay cookie de autenticación",
      },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const id_publicacion = url.searchParams.get("id_publicacion");

    if (!id_publicacion) {
      return Response.json(
        {
          status: "error",
          message: "El ID de la publicación es requerido",
        },
        { status: 400 }
      );
    }

    console.log(`[API] Obteniendo comentarios para publicación ${id_publicacion}`);

    const commentsFromBackend = await getCommentsByPublicationService(
      parseInt(id_publicacion),
      cookie
    );

    console.log(`[API] Comentarios obtenidos: ${commentsFromBackend.length}`);

    // Parsear los comentarios al formato del frontend
    const comments = parseCommentsResponse(commentsFromBackend);

    console.log(`[API] Comentarios parseados: ${comments.length}`);

    return Response.json(
      {
        status: "success",
        comments,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    return Response.json(
      {
        status: "error",
        message: "Error al obtener comentarios: " + (err instanceof Error ? err.message : String(err)),
        comments: [],
      },
      { status: 500 }
    );
  }
}
