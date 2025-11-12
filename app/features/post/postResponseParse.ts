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
        const postFront: Post = {
          id: p.id_publicacion || p.idPublicacion || 0,
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
          comments: 0, // getComentarioById
          author: {
            username: p.nombreUsuario || p.nombre_usuario || "Usuario",
            avatar:
              "https://i.pravatar.cc/150?img=" +
              (p.id_publicacion || p.idPublicacion || 1),
          },
          type: "text", // por ahora
        };
        return postFront;
      });

    console.log(`Parsed ${newPosts.length} posts successfully`);
    return newPosts;
  } catch (err) {
    console.error("Error al parsear la publicacion", err);
    // En lugar de lanzar error, devolver array vacío
    return [];
  }
}
