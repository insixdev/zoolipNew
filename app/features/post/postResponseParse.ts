import { Post } from "~/components/community/indexCommunity/PostCard";
import { PublicationGetResponse, PublicationPublicGetResponse } from "./types";

// parsear de publicacion response del backend prinicipal
// a los datos que se manejan en ssr/2servidor
export function postParseResponse(post: PublicationPublicGetResponse[]) {
  try {
    // Validar que post sea un array
    if (!Array.isArray(post)) {
      console.error("postParseResponse: input is not an array", post);
      return [];
    }

    //TODO: llenar de fomra smart los datos
    const newPosts: Post[] = post
      .filter((p) => {
        // Filtrar posts inválidos
        if (!p || typeof p !== "object") {
          console.warn("Invalid post object:", p);
          return false;
        }
        // Soportar tanto snake_case como camelCase
        const postId = (p as any).id_publicacion || (p as any).idPublicacion;
        if (!postId) {
          console.warn("Post without id:", p);
          return false;
        }
        return true;
      })
      .map((post) => {
        // Soportar tanto snake_case como camelCase del backend
        const p = post as any;
        const postId = p.id_publicacion || p.idPublicacion;

        // Obtener la URL de la imagen si existe
        const imageUrl = p.imagen_url || p.imagenUrl || null;

        // Log detallado para debug
        if (p.tipo === "PUBLICACION") {
          console.log(`[PARSER] Post ${postId}:`, {
            tipo: p.tipo,
            tiene_campo_imagen_url: "imagen_url" in p || "imagenUrl" in p,
            valor_imagen_url: imageUrl,
            topico: p.topico,
          });

          // Advertencia si es PUBLICACION pero no tiene el campo imagen_url
          if (!("imagen_url" in p) && !("imagenUrl" in p)) {
            console.warn(
              `[PARSER] ADVERTENCIA: Post ${postId} tipo PUBLICACION no tiene campo imagen_url en la respuesta del backend`
            );
          }
        }

        const postFront: Post = {
          id: postId || 0,
          topico: p.topico ?? "Sin título",
          content: p.contenido ?? "",
          likes: p.likes ?? 0,
          fecha_creacion:
            p.fecha_pregunta || p.fechaPregunta || new Date().toISOString(),
          fecha_edicion: p.fecha_edicion || p.fechaEdicion || "",
          fecha_duda_resuelta:
            p.fecha_duda_resuelta || p.fechaDudaResuelta || "",
          isSaved: false,
          isLiked: false,
          shares: 0,
          // Leer el número de comentarios del backend
          comments: p.cantidadComentarios ?? p.cantidad_comentarios ?? 0,
          author: {
            username: p.nombreUsuario || p.nombre_usuario || "Usuario",
            avatar: "https://i.pravatar.cc/150?img=" + (postId || 1),
            id: p.id_usuario || p.idUsuario || undefined,
            role: p.rolUsuario || p.rol_usuario || undefined,
          },
          // Si tiene imagen, tipo "image", sino "text"
          type: imageUrl ? "image" : "text",
          image: imageUrl || undefined,
          publicationType: p.tipo, // Tipo de publicación (CONSULTA, PUBLICACION, o null)
        };

        if (imageUrl) {
          console.log(`[PARSER] Post ${postId} parseado con imagen:`, {
            type: postFront.type,
            image: postFront.image,
          });
        }

        return postFront;
      });

    const postsConImagen = newPosts.filter((p) => p.image).length;
    console.log(
      `[PARSER] Parseados ${newPosts.length} posts (${postsConImagen} con imagen)`
    );
    return newPosts;
  } catch (err) {
    console.error("[PARSER] Error al parsear publicaciones:", err);
    // En lugar de lanzar error, devolver array vacío
    return [];
  }
}
