import { ActionFunctionArgs } from "react-router";
import { updateCommentService } from "~/features/post/comments/commentService";
import { CommentUpdateRequest } from "~/features/post/comments/types";
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

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const commentValidation = commentUpdateValidation(data);

  if (!commentValidation.comment) {
    return Response.json(
      {
        status: commentValidation.status,
        message: commentValidation.message,
      },
      { status: 400 }
    );
  }

  console.log("commentValidation", commentValidation);

  const commentRequest = {
    id_comentario: commentValidation.comment.id_comentario,
    contenido: commentValidation.comment.contenido,
  } as CommentUpdateRequest;

  const commentRes = await updateCommentService(commentRequest, cookie!);

  console.log("Update comment response:", commentRes);

  return Response.json(
    { status: "success", message: "Comentario actualizado con éxito" },
    { status: commentRes.httpCode }
  );
}

function commentUpdateValidation(data: any) {
  if (!data) {
    return {
      status: "error",
      message: "Unexpected error, no hay datos",
    };
  }

  try {
    const commentData = {
      id_comentario: Number(data.id_comentario),
      contenido: data.contenido as string,
    };

    if (!commentData.id_comentario) {
      return {
        status: "error",
        message: "El ID del comentario es requerido",
      };
    }

    if (!commentData.contenido || commentData.contenido.length === 0) {
      return {
        status: "error",
        message: "El contenido del comentario es requerido",
      };
    }

    return {
      status: "success",
      message: "Comentario validado con éxito",
      comment: commentData,
    };
  } catch (err) {
    return {
      status: "error",
      message: `Error en procesar los datos del comentario, error: ${err}`,
    };
  }
}
