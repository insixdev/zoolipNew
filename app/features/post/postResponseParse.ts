import { Post } from "~/components/community/indexCommunity/PostCard";
import { PublicationGetResponse, PublicationPublicGetResponse } from "./types";
import { formatTimestamp } from "~/routes/community/buscar";

/**
 * Convierte una fecha a formato ISO string
 * Si es un timestamp numérico (ms), lo convierte a ISO string
 */
function normalizeDate(dateInput: any): string {
  if (!dateInput) return new Date().toISOString();

  // Si es un número (timestamp en ms), convertir a ISO string
  if (typeof dateInput === "number") {
    return new Date(dateInput).toISOString();
  }

  // Si es un string ISO, devolverlo tal cual
  if (typeof dateInput === "string" && dateInput.includes("T")) {
    return dateInput;
  }

  // Si es otro string, intentar parsear
  if (typeof dateInput === "string") {
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

// Parsear de publicación response del backend principal a los datos que se manejan en frontend
export function postParseResponse(post: PublicationPublicGetResponse[]) {
  try {
    // Validar que post sea un array
    if (!Array.isArray(post)) {
      console.error("[PARSER] Input is not an array:", post);
      return [];
    }

    const newPosts: Post[] = post
      .filter((p) => {
        // Filtrar posts inválidos
        if (!p || typeof p !== "object") {
          console.warn("[PARSER] Invalid post object:", p);
          return false;
        }
        // Soportar tanto snake_case como camelCase
        const postId = (p as any).id_publicacion || (p as any).idPublicacion;
        if (!postId) {
          console.warn("[PARSER] Post without id:", p);
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

        // Normalizar fechas: usar fechaEdicion como principal (es la que siempre tiene valor)
        // Caer a fechaPregunta como fallback
        const fechaEdicion = normalizeDate(p.fecha_edicion || p.fechaEdicion || "");
        const fechaPregunta = normalizeDate(p.fecha_pregunta || p.fechaPregunta || fechaEdicion);
        const fechaCreacion = fechaPregunta || fechaEdicion; // Usar la que tenga valor
        const fechaDudaResuelta = normalizeDate(p.fecha_duda_resuelta || p.fechaDudaResuelta || "");

        // Log detallado para debug - TODOS los posts
        console.log(`[PARSER] Post ${postId}:`, {
          tipo: p.tipo,
          tipo_existente: !!p.tipo,
          tiene_imagen: "imagen_url" in p || "imagenUrl" in p,
          imagen_url: imageUrl,
          topico: p.topico,
          timestamp_formateado: formatTimestamp(fechaCreacion),
        });

        // Advertencia si tipo es null o undefined
        if (!p.tipo) {
          console.warn(
            `[PARSER] WARNING: Post ${postId} tiene tipo null/undefined (será filtrado como no-CONSULTA)`
          );
        }

        // Advertencia si es PUBLICACION pero no tiene imagen
        if (p.tipo === "PUBLICACION" && !("imagen_url" in p) && !("imagenUrl" in p)) {
          console.warn(
            `[PARSER] WARNING: Post ${postId} type PUBLICACION has no imagen_url field`
          );
        }

        // Normalizar tipo de publicación - si no viene, por defecto es PUBLICACION
        const publicationType = p.tipo || p.Tipo || "PUBLICACION";

        const postFront: Post = {
          id: postId || 0,
          topico: p.topico ?? "Sin título",
          content: p.contenido ?? "",
          likes: p.likes ?? 0,
          fecha_creacion: fechaCreacion, // Siempre usar fecha_pregunta como fecha de creación
          fecha_edicion: fechaEdicion,
          fecha_duda_resuelta: fechaDudaResuelta,
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
          publicationType: publicationType, // Tipo de publicación (CONSULTA o PUBLICACION)
        };

        if (imageUrl) {
          console.log(`[PARSER] Post ${postId} parsed with image:`, {
            type: postFront.type,
            image: postFront.image,
          });
        }

        return postFront;
      });

    const postsConImagen = newPosts.filter((p) => p.image).length;
    console.log(
      `[PARSER] Parsed ${newPosts.length} posts (${postsConImagen} with images)`
    );
    return newPosts;
  } catch (err) {
    console.error("[PARSER] Error parsing publications:", err);
    // Return empty array instead of throwing error
    return [];
  }
}