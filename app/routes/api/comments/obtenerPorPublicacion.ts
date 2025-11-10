import { LoaderFunctionArgs } from "react-router";

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

    // TODO: Implementar servicio para obtener comentarios por publicación
    // const comments = await getCommentsByPublicationService(id_publicacion, cookie);

    // Por ahora, retornar array vacío
    const comments: any[] = [];

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
        message: "Error al obtener comentarios",
      },
      { status: 500 }
    );
  }
}
