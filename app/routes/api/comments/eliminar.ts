import { ActionFunctionArgs } from "react-router";
import { deleteCommentService } from "~/features/post/comments/commentService";
import { field, getUserFieldFromCookie } from "~/lib/authUtil";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");
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
    const id_comentario = formData.get("id_comentario");

    if (!id_comentario) {
      return Response.json(
        {
          status: "error",
          message: "El ID del comentario es requerido",
        },
        { status: 400 }
      );
    }

    const comentarioId = Number(id_comentario);

    if (isNaN(comentarioId)) {
      return Response.json(
        {
          status: "error",
          message: "El ID del comentario debe ser un número válido",
        },
        { status: 400 }
      );
    }

    console.log("Eliminando comentario:", comentarioId);

    const commentRes = await deleteCommentService(comentarioId, cookie!);

    console.log("Delete comment response:", commentRes);

    return Response.json(
      { status: "success", message: "Comentario eliminado con éxito" },
      { status: commentRes.httpCode }
    );
  } catch (err) {
    console.error("Error al eliminar comentario:", err);
    return Response.json(
      {
        status: "error",
        message: `Error al eliminar el comentario: ${err}`,
      },
      { status: 500 }
    );
  }
}
