import { MessageCircle, Loader2 } from "lucide-react";
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useFetcher,
  useRevalidator,
} from "react-router";
import { HacerPregunta } from "~/components/community/consultas/HacerPregunta";
import { Pregunta } from "~/components/community/consultas/Pregunta";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { getAllPublicPublicationsService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse";
import { useEffect, useRef, useState } from "react";

import type { Comment } from "~/components/community/comentarios/CommentItem";
import {
  getUserCommentLikes,
  addCommentLike,
  removeCommentLike,
  getUserLikes,
  addLike,
  removeLike,
} from "~/lib/likeStorage";

const ITEMS_PER_PAGE = 10;

// Loader para obtener solo las consultas
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  console.log("[CONSULTAS LOADER] Cookie:", cookie ? "present" : "not present");

  try {
    // Usar el endpoint público para la carga inicial (últimas 10)
    console.log("[CONSULTAS LOADER] Fetching initial public publications...");
    const fetchedPosts = await getAllPublicPublicationsService(
      cookie || undefined
    );
    console.log(
      "[CONSULTAS LOADER] Total posts fetched:",
      fetchedPosts?.length || 0
    );

    const allPosts = postParseResponse(fetchedPosts);
    console.log("[CONSULTAS LOADER] Total posts parsed:", allPosts.length);

    // Filtrar solo consultas
    // Solo mostramos posts con tipo explícito "CONSULTA"
    const consultasOnly = allPosts.filter(
      (post) => post.publicationType === "CONSULTA"
    );

    console.log("[CONSULTAS LOADER] Total posts:", allPosts.length);
    console.log("[CONSULTAS LOADER] Consultas filtered:", consultasOnly.length);

    // Los posts ya vienen con el contador de comentarios del backend
    // Retornar todas las consultas encontradas
    return {
      consultas: consultasOnly,
      hasMore: consultasOnly.length >= 10, // Si hay 10 o más, probablemente hay más en el servidor
    };
  } catch (error) {
    console.error("[CONSULTAS LOADER] Error:", error);
    return { consultas: [], hasMore: false };
  }
}

export default function CommunityConsultas() {
  const { user } = useSmartAuth();
  const loaderData = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  console.log("[CONSULTAS COMPONENT] Loader data:", {
    consultasCount: loaderData?.consultas?.length || 0,
    hasMore: loaderData?.hasMore,
    isPublic: loaderData?.isPublic,
  });

  // Helper para sincronizar consultas con localStorage
  const syncConsultasWithLikes = (consultasToSync: any[]) => {
    const userLikes = getUserLikes();
    return consultasToSync.map((consulta) => ({
      ...consulta,
      isLiked: userLikes.has(consulta.id),
    }));
  };

  const [displayedConsultas, setDisplayedConsultas] = useState(() => {
    return syncConsultasWithLikes(loaderData?.consultas ?? []);
  });
  const [hasMore, setHasMore] = useState(true); // Siempre true al inicio
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreFetcher = useFetcher();
  const likeFetcher = useFetcher();

  // Estados para comentarios
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const getByIdFetcher = useFetcher();
  const createCommentFetcher = useFetcher();
  const lastRequestedCommentsPostId = useRef<string | null>(null);
  const lastCommentedPostId = useRef<string | null>(null);

  // PostId que está cargando comentarios
  const commentsLoadingPostId =
    getByIdFetcher.state === "loading"
      ? lastRequestedCommentsPostId.current
      : null;

  // Sincronizar consultas cuando cambian desde el loader
  useEffect(() => {
    if (loaderData?.consultas && loaderData.consultas.length > 0) {
      setDisplayedConsultas(syncConsultasWithLikes(loaderData.consultas));
      setHasMore(loaderData.hasMore);
    }
  }, [loaderData?.consultas]);

  // Manejar la respuesta del fetcher de cargar más
  useEffect(() => {
    if (loadMoreFetcher.data && loadMoreFetcher.state === "idle") {
      const response = loadMoreFetcher.data as any;

      console.log("[LOAD MORE] Response received:", response);

      // Si el token es inválido, limpiar todo y redirigir al login
      if (response.status === "error" && response.code === "INVALID_TOKEN") {
        console.log(
          "[LOAD MORE] Token inválido, limpiando sesión y redirigiendo al login..."
        );
        localStorage.clear();
        window.location.href = "/login?redirectTo=/community/consultas";
        return;
      }

      if (response.status === "success" && response.posts) {
        // Parsear las publicaciones si es necesario
        const parsedPosts = Array.isArray(response.posts)
          ? response.posts
          : postParseResponse(response.posts);

        // Filtrar solo consultas
        const newConsultas = parsedPosts.filter(
          (post: any) => post.publicationType === "CONSULTA"
        );

        console.log(
          "[LOAD MORE] Nuevas consultas cargadas:",
          newConsultas.length
        );
        console.log(
          "[LOAD MORE] Tipos de posts:",
          parsedPosts.map((p: any) => ({ id: p.id, type: p.publicationType }))
        );

        if (newConsultas.length > 0) {
          // Filtrar duplicados - solo agregar consultas que no existan ya
          setDisplayedConsultas((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const uniqueNewConsultas = newConsultas.filter(
              (consulta: any) => !existingIds.has(consulta.id)
            );

            console.log("[LOAD MORE] IDs existentes:", Array.from(existingIds));
            console.log(
              "[LOAD MORE] IDs nuevos:",
              newConsultas.map((c: any) => c.id)
            );
            console.log(
              "[LOAD MORE] Consultas únicas a agregar:",
              uniqueNewConsultas.length
            );

            if (uniqueNewConsultas.length === 0) {
              console.log(
                "[LOAD MORE] Todas las consultas ya estaban cargadas"
              );
              return prev;
            }

            // Sincronizar nuevas consultas con likes de localStorage
            const syncedNewConsultas =
              syncConsultasWithLikes(uniqueNewConsultas);
            return [...prev, ...syncedNewConsultas];
          });

          // Si recibimos menos de 3 consultas, probablemente no hay más
          setHasMore(newConsultas.length >= 3);
        } else {
          console.log("[LOAD MORE] No se encontraron más consultas");
          setHasMore(false);
        }
      } else {
        console.log("[LOAD MORE] Respuesta inesperada del servidor:", response);
        setHasMore(false);
      }

      setIsLoading(false);
    }
  }, [loadMoreFetcher.data, loadMoreFetcher.state]);

  // Cargar más consultas desde el backend
  const handleLoadMore = () => {
    if (isLoading || !hasMore || displayedConsultas.length === 0) {
      console.log("[LOAD MORE] Skipping:", {
        isLoading,
        hasMore,
        length: displayedConsultas.length,
      });
      return;
    }

    setIsLoading(true);

    // Obtener el ID de la última consulta visible
    const lastConsulta = displayedConsultas[displayedConsultas.length - 1];
    const lastId = lastConsulta.id;

    console.log("[LOAD MORE] Cargando más consultas desde ID:", lastId);

    // Llamar al endpoint con el ID de la última consulta
    loadMoreFetcher.load(`/api/post/obtenerTodas?lastId=${lastId}`);
  };

  const parseConsultaContent = (content: string) => {
    // Buscar la primera línea como título (hasta el primer salto de línea o punto)
    const lines = content.split("\n");

    if (lines.length > 1) {
      // Si hay múltiples líneas, la primera es el título
      return {
        title: lines[0].trim(),
        description: lines.slice(1).join("\n").trim(),
      };
    } else {
      // Si es una sola línea, buscar el primer punto o tomar los primeros 100 caracteres
      const firstSentenceEnd = content.indexOf(".");
      if (firstSentenceEnd > 0 && firstSentenceEnd < 150) {
        return {
          title: content.substring(0, firstSentenceEnd + 1).trim(),
          description: content.substring(firstSentenceEnd + 1).trim(),
        };
      } else {
        // Si no hay punto o es muy largo, tomar los primeros 100 caracteres como título
        return {
          title:
            content.substring(0, 100).trim() +
            (content.length > 100 ? "..." : ""),
          description:
            content.length > 100 ? content.substring(100).trim() : "",
        };
      }
    }
  };

  // Cargar comentarios cuando el fetcher trae data
  useEffect(() => {
    if (!getByIdFetcher.data) return;
    const maybeData: any = getByIdFetcher.data;
    const fetchedComments = maybeData?.comments ?? maybeData;

    if (!Array.isArray(fetchedComments)) return;

    const postId = lastRequestedCommentsPostId.current;
    if (!postId) return;

    console.log(
      `[CONSULTAS] Loaded ${fetchedComments.length} comments for consulta ${postId}`
    );

    // Sincronizar comentarios con likes de localStorage
    const userCommentLikes = getUserCommentLikes();
    const commentsWithLikes = fetchedComments.map((comment: Comment) => ({
      ...comment,
      isLiked: userCommentLikes.has(parseInt(comment.id)),
    }));

    setCommentsMap((prev) => ({
      ...(prev ?? {}),
      [postId]: commentsWithLikes,
    }));

    lastRequestedCommentsPostId.current = null;
  }, [getByIdFetcher.data]);

  // Recargar comentarios después de crear uno
  useEffect(() => {
    if (
      createCommentFetcher.state === "idle" &&
      createCommentFetcher.data?.status === "success" &&
      lastCommentedPostId.current
    ) {
      const postId = lastCommentedPostId.current;
      lastRequestedCommentsPostId.current = postId;
      getByIdFetcher.load(`/api/post/comentarios/${postId}`);
      lastCommentedPostId.current = null;
    }
  }, [createCommentFetcher.state, createCommentFetcher.data]);

  const handleLike = (consultaId: string) => {
    const consultaIdNum = parseInt(consultaId);
    const consulta = displayedConsultas.find(
      (c) => c.id?.toString() === consultaId
    );

    if (!consulta) {
      console.error("[LIKE] Consulta no encontrada:", consultaId);
      return;
    }

    // Leer el estado actual desde localStorage (fuente de verdad)
    const userLikes = getUserLikes();
    const wasLiked = userLikes.has(consultaIdNum);
    const newIsLiked = !wasLiked;

    console.log(`[LIKE] Consulta ${consultaId}:`, {
      wasLiked,
      newIsLiked,
      currentLikes: consulta.likes,
    });

    // Actualizar localStorage PRIMERO
    if (newIsLiked) {
      addLike(consultaIdNum);
    } else {
      removeLike(consultaIdNum);
    }

    // Actualizar UI optimistamente basado en localStorage
    setDisplayedConsultas((prev) =>
      prev.map((consulta) =>
        consulta.id?.toString() === consultaId
          ? {
              ...consulta,
              isLiked: newIsLiked,
              likes: newIsLiked ? consulta.likes + 1 : consulta.likes - 1,
            }
          : consulta
      )
    );

    // Enviar like al backend (solo para actualizar el contador)
    const formData = new FormData();
    formData.append("isLiked", wasLiked.toString());
    formData.append("action", "toggle");

    likeFetcher.submit(formData, {
      method: "post",
      action: `/api/post/like/${consultaId}`,
    });
  };

  const handleComment = (consultaId: string) => {
    console.log("Toggle comments for consulta:", consultaId);

    if (commentsMap[consultaId]) {
      console.log("Comments already loaded for consulta:", consultaId);
      return;
    }

    lastRequestedCommentsPostId.current = consultaId;
    getByIdFetcher.load(`/api/post/comentarios/${consultaId}`);
  };

  const handleAddComment = (consultaId: string, content: string) => {
    console.log("🔵 [CONSULTA] handleAddComment called!");
    console.log("🔵 [CONSULTA] ConsultaId:", consultaId);
    console.log("🔵 [CONSULTA] Content:", content);

    lastCommentedPostId.current = consultaId;

    const formData = new FormData();
    formData.append("id_publicacion", consultaId);
    formData.append("contenido", content);

    createCommentFetcher.submit(formData, {
      method: "post",
      action: "/api/comments/crear",
    });

    // Actualizar contador optimistamente
    setDisplayedConsultas((prev) =>
      prev.map((consulta) =>
        consulta.id?.toString() === consultaId
          ? { ...consulta, comments: consulta.comments + 1 }
          : consulta
      )
    );
  };

  const handleLikeComment = (consultaId: string, commentId: string) => {
    const commentIdNum = parseInt(commentId);
    const comment = commentsMap[consultaId]?.find((c) => c.id === commentId);

    if (!comment) {
      console.error("[LIKE] Comentario no encontrado:", commentId);
      return;
    }

    const wasLiked = comment.isLiked || false;

    let shouldUpdate = false;
    if (wasLiked) {
      shouldUpdate = removeCommentLike(commentIdNum);
    } else {
      shouldUpdate = addCommentLike(commentIdNum);
    }

    if (!shouldUpdate) {
      console.log(
        "[LIKE] Estado del comentario ya sincronizado, no se requiere actualización"
      );
      return;
    }

    // Actualizar UI optimistamente
    setCommentsMap((prev) => ({
      ...prev,
      [consultaId]: prev[consultaId]?.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      ),
    }));
  };

  // Convertir posts a formato de consulta para el componente Pregunta
  const consultasFormateadas = displayedConsultas.map((consulta) => {
    const { title, description } = parseConsultaContent(consulta.content);

    return {
      id: consulta.id.toString(),
      title: title,
      content: description,
      author: consulta.author.username,
      authorId: consulta.author.id, // ID del autor para link al perfil
      avatar: consulta.author.avatar,
      timestamp: consulta.fecha_creacion, // Pasar la fecha ISO completa
      responses: consulta.comments,
      likes: consulta.likes,
      isLiked: consulta.isLiked || false,
      category: consulta.topico,
    };
  });

  console.log(
    "🎨 [CONSULTAS COMPONENT] Consultas formateadas:",
    consultasFormateadas.length
  );

  return (
    <div className="mx-auto max-w-7xl md:pl-64 px-4 pt-8 pb-10">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl mb-4 shadow-md">
          <MessageCircle className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Consultas de la Comunidad
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Haz preguntas y comparte conocimientos con otros amantes de los
          animales
        </p>
      </div>

      {/* Nueva consulta - Solo para usuarios autenticados */}
      <AuthRoleComponent
        allowedRoles={[
          USER_ROLES.ADMIN,
          USER_ROLES.ADOPTANTE,
          USER_ROLES.USER,
          USER_ROLES.SYSTEM,
          USER_ROLES.VETERINARIA,
          USER_ROLES.REFUGIO,
        ]}
        fallback={
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl shadow-md border border-orange-200 p-8 mb-8 text-center">
            <MessageCircle className="mx-auto text-rose-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Inicia sesión para hacer preguntas
            </h3>
            <p className="text-gray-600 mb-6">
              Únete a nuestra comunidad para compartir tus dudas y ayudar a
              otros
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border-2 border-rose-500 text-rose-600 rounded-lg hover:bg-rose-50 transition-all font-semibold"
              >
                Registrarse
              </Link>
            </div>
          </div>
        }
      >
        <HacerPregunta
          onPostCreated={(newConsulta) => {
            console.log(" Nueva consulta creada, recargando página...");
            // Recargar la página para obtener datos actualizados
            window.location.reload();
          }}
        />
      </AuthRoleComponent>

      {/* Lista de consultas */}

      {/* Lista de consultas */}

      {user && consultasFormateadas.length > 0 ? (
        <>
          <div className="space-y-8">
            {consultasFormateadas.map((consulta) => (
              <Pregunta
                key={consulta.id}
                {...consulta}
                comments={commentsMap[consulta.id] || []}
                commentsLoading={commentsLoadingPostId === consulta.id}
                isSubmittingComment={
                  createCommentFetcher.state === "submitting"
                }
                onComment={handleComment}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onLike={handleLike}
              />
            ))}
          </div>

          {/* Botón para cargar más */}
          <div className="py-8 flex justify-center">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Cargando...
                  </>
                ) : (
                  <>Cargar más consultas</>
                )}
              </button>
            ) : (
              displayedConsultas.length > 0 && (
                <div className="text-center text-gray-500 text-sm">
                  No hay más consultas para mostrar
                </div>
              )
            )}
          </div>
        </>
      ) : (
        consultasFormateadas.length === 0 &&
        user && (
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl shadow-md text-black border border-orange-200 p-8 mb-8 text-center">
            <p>No hay consultas disponibles aún.</p>
            <p className="text-sm mt-2">
              ¡Sé el primero en hacer una pregunta!
            </p>
          </div>
        )
      )}

      {!user && (
        <div className="bg-gradient-to-br from-white to-rose-50 rounded-xl text-black shadow-sm p-8 mb-8 text-center">
          <p>Para ver las consultas debes iniciar sesión</p>
        </div>
      )}
    </div>
  );
}
