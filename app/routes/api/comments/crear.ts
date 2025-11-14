import { ActionFunctionArgs } from "react-router";
import { createCommentService } from "~/features/post/comments/commentService";
import { CommentCreateRequest } from "~/features/post/comments/types";
import { field, getUserFieldFromCookie } from "~/lib/authUtil";

export async function action({ request }: ActionFunctionArgs) {
  console.log("🔴 [ENDPOINT] Request method:", request.method);

  const cookie = request.headers.get("Cookie");

  if (!cookie)
    return Response.json(
      { status: "error", message: "No hay cookie" },
      { status: 401 }
    );

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
  console.log("🔴 [ENDPOINT] FormData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(`🔴 [ENDPOINT]   ${key}:`, value);
  }

  const data = {
    id_publicacion: formData.get("id_publicacion"),
    contenido: formData.get("contenido"),
  };
  console.log("🔴 [ENDPOINT] Parsed data:", data);

  const commentValidation = commentCreateValidation(data, userIdFromCookie);
  console.log("🔴 [ENDPOINT] Validation result:", commentValidation);

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
  console.log(
    "🔴 [ENDPOINT] Calling createCommentService with:",
    commentRequest
  );

  try {
    const commentRes = await createCommentService(commentRequest, cookie!);
    console.log("🔴 [ENDPOINT] Create comment SUCCESS:", commentRes);

    return Response.json(
      {
        status: "success",
        message: "Comentario creado con éxito",
        data: commentRes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔴 [ENDPOINT] Error creating comment:", error);
    return Response.json(
      {
        status: "error",
        message: "Error al crear comentario: " + error,
      },
      { status: 500 }
    );
  }
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
