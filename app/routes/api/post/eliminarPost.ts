import { ActionFunctionArgs } from "react-router";
import { deletePublicationService } from "~/features/post/postService";
import { field, getUserFieldFromCookie } from "~/lib/authUtil";

// Action para eliminar post
export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  if (!cookie) {
    return Response.json(
      {
        status: "error",
        message: "Cookie no encontrada",
      },
      { status: 401 }
    );
  }
  const userIdFromCookie = getUserFieldFromCookie(cookie, field.id);

  if (!userIdFromCookie) {
    return Response.json(
      {
        status: "error",
        message: "Usuario no autenticado",
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const id_publicacion = formData.get("id_publicacion");

    // Validar que tenga ID
    if (!id_publicacion) {
      return Response.json(
        {
          status: "error",
          message: "El ID de la publicación es requerido",
        },
        { status: 400 }
      );
    }

    // Convertir a número
    const publicacionId = Number(id_publicacion);

    if (isNaN(publicacionId)) {
      return Response.json(
        {
          status: "error",
          message: "El ID de la publicación debe ser un número válido",
        },
        { status: 400 }
      );
    }

    console.log("Eliminando publicación:", publicacionId);

    // Llamar al servicio de eliminación
    const postRes = await deletePublicationService(publicacionId, cookie);

    console.log("Delete response:", postRes);

    return Response.json(
      { status: "success", message: "Publicación eliminada con éxito" },
      { status: postRes.httpCode }
    );
  } catch (err) {
    console.error("Error al eliminar publicación:", err);
    return Response.json(
      {
        status: "error",
        message: `Error al eliminar la publicación: ${err}`,
      },
      { status: 500 }
    );
  }
}
