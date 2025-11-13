import type { ActionFunctionArgs } from "react-router";
import { updatePublicationService } from "~/features/post/postService";
import type { PublicationUpdateRequest } from "~/features/post/types";

/**
 * Endpoint flexible para actualizar un post
 * Permite actualizar cualquier campo: likes, contenido, topico, etc.
 * Solo actualiza los campos que se envíen en el body
 */
export async function action({ request }: ActionFunctionArgs) {
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
    const body = await request.json();

    // Validar que tenga ID
    if (!body.id_publicacion) {
      return Response.json(
        {
          status: "error",
          message: "El ID de la publicación es requerido",
        },
        { status: 400 }
      );
    }

    // Construir el objeto de actualización solo con los campos enviados
    const updateData: PublicationUpdateRequest = {
      id_publicacion: body.id_publicacion,
    };

    // Agregar campos opcionales si están presentes
    if (body.topico !== undefined) {
      updateData.topico = body.topico;
    }

    if (body.contenido !== undefined) {
      updateData.contenido = body.contenido;
    }

    if (body.likes !== undefined) {
      updateData.likes = body.likes;
    }

    // Siempre actualizar fecha de edición
    updateData.fecha_edicion = new Date().toISOString();

    console.log("Actualizando post con datos:", updateData);

    const result = await updatePublicationService(updateData, cookie);

    return Response.json(
      {
        status: "success",
        message: "Publicación actualizada con éxito",
        data: result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al actualizar publicación:", err);
    return Response.json(
      {
        status: "error",
        message: "Error al actualizar publicación",
      },
      { status: 500 }
    );
  }
}
