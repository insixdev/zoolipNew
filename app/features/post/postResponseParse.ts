import { Post } from "~/components/community/indexCommunity/PostCard";
import { PublicationGetResponse, PublicationPublicGetResponse } from "./types";
import { formatTimestamp } from "~/lib/formatTimestamp";
import { getUserByIdService } from "~/features/user/userService";

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

// Cache para evitar llamadas múltiples por usuario
const userImageCache = new Map<number, string | null>();

// Versión con cookie que obtiene imagenUrl del usuario
export async function postParseResponseWithUserImages(
  posts: PublicationPublicGetResponse[],
  cookie?: string
) {
  try {
    // Validar que post sea un array
    if (!Array.isArray(posts)) {
      console.error("[PARSER] Input is not an array:", posts);
      return postParseResponse(posts); // Fallback a versión sin imágenes
    }

    const newPosts: Post[] = [];

    for (const post of posts) {
      // Filtrar posts inválidos
      if (!post || typeof post !== "object") {
        console.warn("[PARSER] Invalid post object:", post);
        continue;
      }

      // Soportar tanto snake_case como camelCase
      const postId = (post as any).id_publicacion || (post as any).idPublicacion;
      if (!postId) {
        console.warn("[PARSER] Post without id:", post);
        continue;
      }

      // Procesar post
      try {
        const parsedPost = await parsePostWithUserImage(post, cookie);
        newPosts.push(parsedPost);
      } catch (err) {
        console.warn("[PARSER] Error parsing individual post, using fallback:", err);
        // Si falla, usar parseado básico sin imagen del usuario
        const p = post as any;
        const postId = p.id_publicacion || p.idPublicacion;
        const imageUrl = p.imagen_url || p.imagenUrl || null;
        const fechaEdicion = normalizeDate(p.fecha_edicion || p.fechaEdicion || "");
        const fechaPregunta = normalizeDate(p.fecha_pregunta || p.fechaPregunta || fechaEdicion);
        const fechaCreacion = fechaPregunta || fechaEdicion;
        const fechaDudaResuelta = normalizeDate(p.fecha_duda_resuelta || p.fechaDudaResuelta || "");
        const publicationType = p.tipo || p.Tipo || "PUBLICACION";
        
        newPosts.push({
          id: postId || 0,
          topico: p.topico ?? "Sin título",
          content: p.contenido ?? "",
          likes: p.likes ?? 0,
          fecha_creacion: fechaCreacion,
          fecha_edicion: fechaEdicion,
          fecha_duda_resuelta: fechaDudaResuelta,
          isSaved: false,
          isLiked: false,
          shares: 0,
          comments: p.cantidadComentarios ?? p.cantidad_comentarios ?? 0,
          author: {
            username: p.nombreUsuario || p.nombre_usuario || "Usuario",
            avatar: null,
            id: p.id_usuario || p.idUsuario || undefined,
            role: p.rolUsuario || p.rol_usuario || undefined,
          },
          type: imageUrl ? "image" : "text",
          image: imageUrl || undefined,
          publicationType: publicationType,
        });
      }
    }

    const postsConImagen = newPosts.filter((p) => p.image).length;
    console.log(
      `[PARSER] Parsed ${newPosts.length} posts (${postsConImagen} with images)`
    );
    return newPosts;
  } catch (err) {
    console.error("[PARSER] Error parsing publications with user images, using basic parser:", err);
    return postParseResponse(posts); // Fallback completo
  }
}

// Función auxiliar para parsear un post individual
async function parsePostWithUserImage(
  post: PublicationPublicGetResponse,
  cookie?: string
): Promise<Post> {
  // Soportar tanto snake_case como camelCase del backend
  const p = post as any;
  const postId = p.id_publicacion || p.idPublicacion;

  // Obtener la URL de la imagen si existe
  const imageUrl = p.imagen_url || p.imagenUrl || null;

  // Normalizar fechas
  const fechaEdicion = normalizeDate(p.fecha_edicion || p.fechaEdicion || "");
  const fechaPregunta = normalizeDate(p.fecha_pregunta || p.fechaPregunta || fechaEdicion);
  const fechaCreacion = fechaPregunta || fechaEdicion;
  const fechaDudaResuelta = normalizeDate(
    p.fecha_duda_resuelta || p.fechaDudaResuelta || ""
  );

  // Normalizar tipo de publicación
  const publicationType = p.tipo || p.Tipo || "PUBLICACION";

  // Obtener la imagen del autor
  let avatarUrl = p.imagenUrl || p.imagen_url || p.imagen_usuario || p.imagenUsuario || null;

  // Si no hay avatar pero tenemos ID del usuario y cookie, intentar obtener del servicio
  const userId = p.id_usuario || p.idUsuario;
  if (!avatarUrl && userId && cookie) {
    try {
      if (!userImageCache.has(userId)) {
        const userData = await getUserByIdService(userId, cookie);
        userImageCache.set(userId, userData.imagen_url || userData.imagenUrl || null);
      }
      avatarUrl = userImageCache.get(userId) || null;
    } catch (err) {
      console.warn(`[PARSER] Could not fetch user ${userId} image:`, err);
    }
  }

  // Si no tiene extensión, agregar .png por defecto
  if (avatarUrl && !avatarUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    avatarUrl += ".png";
  }

  // Si la URL es relativa (empieza con /), asegurar que tenga /upload/
  let avatarDisplay = null;
  if (avatarUrl) {
    avatarDisplay = avatarUrl;
    if (avatarDisplay.startsWith("/") && !avatarDisplay.startsWith("/upload/")) {
      avatarDisplay = `/upload/${avatarDisplay}`;
    }
  }

  return {
    id: postId || 0,
    topico: p.topico ?? "Sin título",
    content: p.contenido ?? "",
    likes: p.likes ?? 0,
    fecha_creacion: fechaCreacion,
    fecha_edicion: fechaEdicion,
    fecha_duda_resuelta: fechaDudaResuelta,
    isSaved: false,
    isLiked: false,
    shares: 0,
    comments: p.cantidadComentarios ?? p.cantidad_comentarios ?? 0,
    author: {
      username: p.nombreUsuario || p.nombre_usuario || "Usuario",
      avatar: avatarDisplay,
      id: userId || undefined,
      role: p.rolUsuario || p.rol_usuario || undefined,
    },
    type: imageUrl ? "image" : "text",
    image: imageUrl || undefined,
    publicationType: publicationType,
  };
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

        // Obtener la imagen del autor - priorizar imagenUrl (del usuario) primero
        let avatarUrl = p.imagenUrl || p.imagen_url || p.imagen_usuario || p.imagenUsuario || null;
        
        // Si no tiene extensión, agregar .png por defecto
        if (avatarUrl && !avatarUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          avatarUrl += ".png";
        }
        
        // Si la URL es relativa (empieza con /), asegurar que tenga /upload/
        let avatarDisplay = null;
        if (avatarUrl) {
          avatarDisplay = avatarUrl;
          if (avatarDisplay.startsWith("/") && !avatarDisplay.startsWith("/upload/")) {
            avatarDisplay = `/upload/${avatarDisplay}`;
          }
        }

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
            avatar: avatarDisplay,
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