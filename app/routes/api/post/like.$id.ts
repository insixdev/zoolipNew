import type { ActionFunctionArgs } from "react-router";

export async function action({ request, params }: ActionFunctionArgs) {
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
    // Obtener el body para saber si es like o unlike
    const formData = await request.formData();
    const action = formData.get("action")?.toString() || "toggle";
    const isLiked = formData.get("isLiked") === "true";

    const { getAllPublicPublicationsService, updatePublicationService } =
      await import("~/features/post/postService");

    console.log(
      `[LIKE] Buscando publicacion ID: ${id}, action: ${action}, isLiked: ${isLiked}`
    );

    // Obtener publicaciones y buscar la específica
    const allPosts = await getAllPublicPublicationsService(cookieHeader);
    const post = allPosts.find(
      (p) =>
        p.id_publicacion === parseInt(id) || p.idPublicacion === parseInt(id)
    );

    if (!post) {
      console.log("[LIKE] ERROR: Publicacion no encontrada");
      return Response.json(
        { error: "Publicación no encontrada" },
        { status: 404 }
      );
    }

    console.log(`[LIKE] Post encontrado:`, {
      id: post.id_publicacion,
      tipo: post.tipo,
      likes: post.likes,
      idUsuario: post.idUsuario,
    });

    // Calcular nuevo número de likes basado en el estado
    let newLikes = post.likes;
    if (isLiked) {
      // Ya tenía like, entonces quitarlo
      newLikes = Math.max(0, post.likes - 1);
      console.log(`[LIKE] Quitando like: ${post.likes} -> ${newLikes}`);
    } else {
      // No tenía like, entonces agregarlo
      newLikes = post.likes + 1;
      console.log(`[LIKE] Agregando like: ${post.likes} -> ${newLikes}`);
    }

    // Actualizar con el nuevo contador de likes
    // IMPORTANTE: Incluir TODOS los campos para no perder datos
    const updatedPublication = {
      id_publicacion: parseInt(id),
      topico: post.topico,
      contenido: post.contenido,
      likes: newLikes,
      fecha_edicion: new Date().toISOString(),
      // Preservar el tipo de publicación (CONSULTA, POST, etc.)
      ...(post.tipo && { tipo: post.tipo }),
      // Preservar el usuario
      ...(post.idUsuario && {
        id_usuario: { id: post.idUsuario },
      }),
    };

    console.log(`[LIKE] Actualizando publicación:`, updatedPublication);

    await updatePublicationService(updatedPublication, cookieHeader);

    console.log(`[LIKE] Like actualizado exitosamente`);

    // Solo devolver el contador de likes, NO el estado isLiked
    // El frontend maneja isLiked con localStorage
    return Response.json({
      success: true,
      likes: newLikes,
    });
  } catch (error) {
    console.error("[LIKE] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return Response.json({
      success: false,
      error: errorMessage,
      message: "Error al actualizar like",
    });
  }
}
