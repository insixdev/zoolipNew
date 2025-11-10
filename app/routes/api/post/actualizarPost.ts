import { ActionFunctionArgs } from "react-router";
import { updatePublicationService } from "~/features/post/postService";
import { PublicationUpdateRequest } from "~/features/post/types";
import { field, getUserFieldFromCookie } from "~/lib/authUtil";

// Action para actualizar post
export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  if(!cookie) {
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

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const postValidation = postUpdateValidation(data);

  if (!postValidation.post) {
    return Response.json(
      {
        status: postValidation.status,
        message: postValidation.message,
      },
      { status: 400 }
    );
  }

  console.log("postValidation", postValidation);

  const postRequest = {
    id_publicacion: postValidation.post.id_publicacion,
    topico: postValidation.post.topico,
    contenido: postValidation.post.contenido,
    likes: postValidation.post.likes,
    fecha_edicion: new Date().toISOString(),
  } as PublicationUpdateRequest;

  const postRes = await updatePublicationService(postRequest, cookie);

  console.log("Update response:", postRes);

  return Response.json(
    { status: "success", message: "Publicación actualizada con éxito" },
    { status: postRes.httpCode }
  );
}

function postUpdateValidation(data: any) {
  if (!data) {
    return {
      status: "error",
      message: "Unexpected error, no hay datos",
    };
  }

  try {
    const postData = data as PublicationUpdateRequest;

    // Validar que tenga ID
    if (!postData.id_publicacion) {
      return {
        status: "error",
        message: "El ID de la publicación es requerido",
      };
    }

    // Validar contenido
    if (!postData.topico || postData.topico.length === 0) {
      return {
        status: "error",
        message: "El tópico es requerido",
      };
    }

    if (!postData.contenido || postData.contenido.length === 0) {
      return {
        status: "error",
        message: "El contenido es requerido",
      };
    }

    return {
      status: "success",
      message: "Post validado con éxito",
      post: postData,
    };
  } catch (err) {
    return {
      status: "error",
      message: `Error en procesar los datos de la publicación, error: ${err}`,
    };
  }
}
