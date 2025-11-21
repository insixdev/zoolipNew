import type { LoaderFunctionArgs } from "react-router";
import { getAllPublicPublicationsService } from "~/features/post/postService";
import { postParseResponseWithUserImages } from "~/features/post/postResponseParse";

/**
 * Endpoint para refrescar la lista de publicaciones
 * Se usa después de crear un nuevo post para recargar la lista completa
 * GET /api/community/postsRefresh
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  try {
    console.log("[POSTS REFRESH] Recargando publicaciones...");

    // Obtener todas las publicaciones públicas
    const fetchedPosts = await getAllPublicPublicationsService(
      cookie || undefined
    );

    console.log("[POSTS REFRESH] Posts del backend:", fetchedPosts.length);
    console.log(
      "[POSTS REFRESH] Backend posts con imagen_url:",
      fetchedPosts.filter((p: any) => p.imagen_url || p.imagenUrl).length
    );

    // Parsear las publicaciones con imágenes de usuario
    const parsedPosts = await postParseResponseWithUserImages(fetchedPosts, cookie || undefined);

    console.log("[POSTS REFRESH] Posts parseados:", parsedPosts.length);
    console.log(
      "[POSTS REFRESH] Parsed posts con imagen:",
      parsedPosts.filter((p: any) => p.image).length
    );

    // Filtrar solo publicaciones (no consultas)
    const publicacionesOnly = parsedPosts.filter(
      (post: any) => post.publicationType !== "CONSULTA"
    );

    console.log(
      `[POSTS REFRESH] Recargas completada: ${publicacionesOnly.length} posts`
    );

    // Log detallado de posts con imagen
    const withImages = publicacionesOnly.filter((p: any) => p.image);
    console.log(
      `[POSTS REFRESH] Posts con imagen final: ${withImages.length}`,
      withImages.slice(0, 3).map((p: any) => ({ id: p.id, image: p.image, type: p.type }))
    );

    return Response.json({
      status: "success",
      posts: publicacionesOnly,
      count: publicacionesOnly.length,
    });
  } catch (error) {
    console.error("[POSTS REFRESH] Error recargando posts:", error);
    return Response.json(
      {
        status: "error",
        message: `Error al recargar publicaciones: ${error}`,
        posts: [],
      },
      { status: 500 }
    );
  }
}
