import { ActionFunctionArgs } from "react-router";
import { createCommentService } from "~/features/post/comments/commentService";
import { CommentCreateRequest } from "~/features/post/comments/types";
import { field, getUserFieldFromCookie } from "~/lib/authUtil";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  if(!cookie) return Response.json({status: "error", message: "No hay cookie"}, {status: 401});

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
  formData.get("")

  const commentValidation = commentCreateValidation(data, userIdFromCookie);

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
    id_publicacion: {
      id_publicacion: commentValidation.comment.id_publicacion,
    },
    id_usuario: {
      id: Number(userIdFromCookie),
    },
    contenido: commentValidation.comment.contenido,
    fecha_comentario: new Date().toISOString(),
  } as CommentCreateRequest;

  const commentRes = await createCommentService(commentRequest, cookie!);

  console.log("Create comment response:", commentRes);

  return Response.json(
    { status: "success", message: "Comentario creado con éxito" },
    { status: commentRes.httpCode }
  );
}

function commentCreateValidation(data: any, userId: string) {
  if (!data) {
    return {
      status: "error",
      message: "Unexpected error, no hay datos",
    };
  }

  try {
    const commentData = {
      id_publicacion: Number(data.id_publicacion),
      contenido: data.contenido as string,
    };

    if (!commentData.id_publicacion) {
      return {
        status: "error",
        message: "El ID de la publicación es requerido",
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
