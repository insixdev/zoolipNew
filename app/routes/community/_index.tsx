import { useState, useEffect, useRef } from "react";
import {
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
} from "react-router";
import TrendingSection from "~/components/community/TrendingSection";
import FeedTabs from "~/components/community/FeedTabs";
import CreatePostCard from "~/components/community/indexCommunity/CreatePostCard";
import PostsList from "~/components/community/indexCommunity/PostsList";
import LoadMoreButton from "~/components/community/indexCommunity/LoadMoreButton";
import type { Post } from "~/components/community/indexCommunity/PostCard";
import type { Comment } from "~/components/community/comentarios/CommentItem";
import { getAllPublicPublicationsService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";
import {
  getUserLikes,
  getUserCommentLikes,
  addLike,
  removeLike,
  addCommentLike,
  removeCommentLike,
  hasCommentLike,
} from "~/lib/likeStorage";
const POSTS_PER_PAGE = 5; // Número de posts a mostrar por página

// loader para cargar las post inciciales
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  console.log("[COMMUNITY LOADER] Cookie:", cookie ? "present" : "not present");

  try {
    console.log("[COMMUNITY LOADER] Fetching initial public publications...");
    // Usar el endpoint público para la carga inicial (últimas 10)
    const fetchedPost = await getAllPublicPublicationsService(
      cookie || undefined
    );

    const posts: Post[] = postParseResponse(fetchedPost);

    console.log(
      "LER Posts types:",
      posts.map((p) => ({ id: p.id, type: p.publicationType }))
    );

    // Obtener el número de comentarios para cada post
    const { getCommentsByPublicationService } = await import(
      "~/features/post/comments/commentService"
    );

    // Filtrar solo publicaciones (no consultas)
    // Mostramos posts con tipo "PUBLICACION" o null (asumiendo que son publicaciones)
    // Solo excluimos posts con tipo explícito "CONSULTA"
    const publicacionesOnly = posts.filter(
      (post) => post.publicationType !== "CONSULTA"
    );

    console.log("[COMMUNITY LOADER] Total posts:", posts.length);
    console.log(
      "[COMMUNITY LOADER] Publicaciones only:",
      publicacionesOnly.length
    );
    console.log(
      "[COMMUNITY LOADER] Post types:",
      posts.map((p) => ({ id: p.id, type: p.publicationType }))
    );

    const postsWithCommentCount = await Promise.all(
      publicacionesOnly.map(async (post) => {
        try {
          const comments = await getCommentsByPublicationService(
            post.id,
            cookie
          );
          return { ...post, comments: comments.length };
        } catch (error) {
          console.error(`Error getting comments for post ${post.id}:`, error);
          return { ...post, comments: 0 };
        }
      })
    );

    return { posts: postsWithCommentCount };
  } catch (error) {
    console.error("Error loading posts:", error);
    // Devolver array vacío en caso de error
    return { posts: [] };
  }
}

export default function CommunityIndex() {
  // Mapa de comentarios por postId. Inicializado a objeto vacío para evitar
  // tambien va ser "{}" porque solo se cargara cuando se presione el boton

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);
  const [hasMoreFromServer, setHasMoreFromServer] = useState(true);

  // useLoaderData puede devolver undefined en SSR si el loader no se ejecutó
  const loaderData = useLoaderData<typeof loader>();

  const posts = loaderData?.posts ?? [];
  const isPublic = loaderData?.isPublic ?? false;

  // Helper para sincronizar posts con localStorage
  const syncPostsWithLikes = (postsToSync: Post[]): Post[] => {
    const userLikes = getUserLikes();
    return postsToSync.map((post) => ({
      ...post,
      isLiked: userLikes.has(post.id),
    }));
  };

  const [postsList, setPostsList] = useState<Post[]>(() => {
    // Marcar posts con like del usuario al cargar
    return syncPostsWithLikes(posts);
  });

  // Sincronizar posts cuando cambian desde el loader
  useEffect(() => {
    if (posts.length > 0) {
      setPostsList(syncPostsWithLikes(posts));
    }
  }, [posts]);

  const likeFetcher = useFetcher();
  const createCommentFetcher = useFetcher();

  const getByIdFetcher = useFetcher();
  const loadMoreFetcher = useFetcher();
  // ref para mapear la última petición de comentarios al postId correspondiente
  const lastRequestedCommentsPostId = useRef<string | null>(null);
  const lastCommentedPostId = useRef<string | null>(null);

  // Cuando el fetcher de getByIdFetcher trae data, la volcamos en commentsMap
  useEffect(() => {
    if (!getByIdFetcher.data) return;
    // El shape de la respuesta puede variar: intentamos extraer un array de comments
    const maybeData: any = getByIdFetcher.data;
    const fetchedComments = maybeData?.comments ?? maybeData;

    if (!Array.isArray(fetchedComments)) return;

    const postId = lastRequestedCommentsPostId.current;
    if (!postId) return;

    console.log(
      `[COMMENTS] Loaded ${fetchedComments.length} comments for post ${postId}`
    );

    // Sincronizar comentarios con likes de localStorage
    const userCommentLikes = getUserCommentLikes();
    const commentsWithLikes = fetchedComments.map((comment: Comment) => ({
      ...comment,
      isLiked: userCommentLikes.has(parseInt(comment.id)),
    }));

    // Actualizar el mapa de comentarios
    setCommentsMap((prev) => ({
      ...(prev ?? {}),
      [postId]: commentsWithLikes,
    }));

    // Actualizar el contador de comentarios del post y sincronizar likes
    setPostsList((prev) => {
      console.log(
        `[COMMENTS] Updating post ${postId} comment count to ${fetchedComments.length}`
      );
      console.log(`[COMMENTS] Posts before update:`, prev.length);

      const updated = prev.map((post) =>
        post.id?.toString() === postId
          ? { ...post, comments: fetchedComments.length }
          : post
      );

      console.log(`[COMMENTS] Posts after update:`, updated.length);

      const synced = syncPostsWithLikes(updated);
      console.log(`[COMMENTS] Posts after sync:`, synced.length);

      return synced;
    });

    lastRequestedCommentsPostId.current = null;
  }, [getByIdFetcher.data]);

  // Recargar comentarios después de crear uno
  useEffect(() => {
    if (
      createCommentFetcher.state === "idle" &&
      createCommentFetcher.data?.status === "success" &&
      lastCommentedPostId.current
    ) {
      // Recargar comentarios del post
      const postId = lastCommentedPostId.current;
      lastRequestedCommentsPostId.current = postId;
      getByIdFetcher.load(`/api/post/comentarios/${postId}`);
      lastCommentedPostId.current = null;
    }
  }, [createCommentFetcher.state, createCommentFetcher.data]);

  // Cargar publicaciones desde el servidor
  useEffect(() => {
    // TODO: Descomentar cuando quieras cargar desde el servidor
    // loadMoreFetcher.load("/api/post/obtenerTodas");
  }, []);

  const visiblePosts = postsList.slice(0, visiblePostsCount);

  console.log("📊 [RENDER] postsList length:", postsList.length);
  console.log("📊 [RENDER] visiblePostsCount:", visiblePostsCount);
  console.log("📊 [RENDER] visiblePosts length:", visiblePosts.length);
  console.log(
    "📊 [RENDER] Post IDs:",
    postsList.map((p) => p.id)
  );

  // hasMore es true si hay más posts locales O si el último fetch trajo datos
  const hasMore = visiblePostsCount < postsList.length || hasMoreFromServer;
  // PostId que está cargando comentarios (si getByIdFetcher está en loading)
  const commentsLoadingPostId =
    getByIdFetcher.state === "loading"
      ? lastRequestedCommentsPostId.current
      : null;

  const handleLike = (postId: string) => {
    const postIdNum = parseInt(postId);
    const post = postsList.find((p) => p.id?.toString() === postId);

    if (!post) {
      console.error("[LIKE] Post no encontrado:", postId);
      return;
    }

    const wasLiked = post.isLiked || false;

    // Verificar y actualizar localStorage
    let shouldUpdate = false;
    if (wasLiked) {
      shouldUpdate = removeLike(postIdNum);
    } else {
      shouldUpdate = addLike(postIdNum);
    }

    // Solo actualizar si el estado cambió realmente
    if (!shouldUpdate) {
      console.log(
        "[LIKE] Estado ya sincronizado, no se requiere actualización"
      );
      return;
    }

    // Actualizar UI optimistamente
    setPostsList((prev) =>
      prev.map((post) =>
        post.id?.toString() === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    // Enviar like al backend con el estado actual
    const formData = new FormData();
    formData.append("isLiked", wasLiked.toString());
    formData.append("action", "toggle");

    likeFetcher.submit(formData, {
      method: "post",
      action: `/api/post/like/${postId}`,
    });
  };

  const handleComment = (postId: string) => {
    console.log("Toggle comments for post:", postId);

    // Si ya tenemos comentarios cargados, no hacer nada
    if (commentsMap[postId]) {
      console.log("Comments already loaded for post:", postId);
      return;
    }

    // Guardamos el postId solicitado para poder mapear la respuesta del fetcher
    lastRequestedCommentsPostId.current = postId;
    getByIdFetcher.load(`/api/post/comentarios/${postId}`);
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
    // TODO: Implementar lógica de compartir
    alert(`Compartir post ${postId} - Funcionalidad próximamente`);
  };

  const handleSave = (postId: string) => {
    console.log("Save post:", postId);

    // Actualizar UI optimistamente
    setPostsList((prev) =>
      prev.map((post) =>
        post.id?.toString() === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );

    // TODO: Conectar con API cuando esté disponible
  };

  const handleAddComment = (postId: string, content: string) => {
    console.log("🔵 [COMMENT] handleAddComment called!");
    console.log("🔵 [COMMENT] PostId:", postId);
    console.log("🔵 [COMMENT] Content:", content);

    // Guardar el postId para recargar comentarios después
    lastCommentedPostId.current = postId;

    // Enviar comentario al backend
    const formData = new FormData();
    formData.append("id_publicacion", postId);
    formData.append("contenido", content);

    console.log("🔵 [COMMENT] Submitting to /api/comments/crear");
    console.log("🔵 [COMMENT] FormData:", {
      id_publicacion: postId,
      contenido: content,
    });

    createCommentFetcher.submit(formData, {
      method: "post",
      action: "/api/comments/crear",
    });

    console.log("🔵 [COMMENT] Fetcher state:", createCommentFetcher.state);

    // Actualizar contador de comentarios optimistamente
    setPostsList((prev) => {
      console.log("🔵 [COMMENT] Updating comment count optimistically");
      console.log("🔵 [COMMENT] Posts before:", prev.length);

      const updated = prev.map((post) =>
        post.id?.toString() === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      );

      console.log("🔵 [COMMENT] Posts after:", updated.length);
      return updated;
    });

    // NO recargar aquí - el useEffect se encargará cuando el fetcher termine
  };
  // es cuando le damos like a un comentario
  const handleLikeComment = (postId: string, commentId: string) => {
    const commentIdNum = parseInt(commentId);
    const comment = commentsMap[postId]?.find((c) => c.id === commentId);

    if (!comment) {
      console.error("[LIKE] Comentario no encontrado:", commentId);
      return;
    }

    const wasLiked = comment.isLiked || false;

    // Verificar y actualizar localStorage
    let shouldUpdate = false;
    if (wasLiked) {
      shouldUpdate = removeCommentLike(commentIdNum);
    } else {
      shouldUpdate = addCommentLike(commentIdNum);
    }

    // Solo actualizar si el estado cambió realmente
    if (!shouldUpdate) {
      console.log(
        "[LIKE] Estado del comentario ya sincronizado, no se requiere actualización"
      );
      return;
    }

    // Actualizar UI optimistamente
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: prev[postId]?.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      ),
    }));

    // TODO: Conectar con API de likes de comentarios cuando esté disponible
    console.log("[LIKE] Like de comentario actualizado (solo local por ahora)");
  };

  // Manejar la respuesta del fetcher de cargar más
  useEffect(() => {
    if (loadMoreFetcher.data && loadMoreFetcher.state === "idle") {
      const response = loadMoreFetcher.data as any;

      console.log("[LOAD MORE INDEX] Response received:", response);

      // Si el token es inválido, limpiar todo y redirigir al login
      if (response.status === "error" && response.code === "INVALID_TOKEN") {
        console.log(
          "[LOAD MORE INDEX] Token inválido, limpiando sesión y redirigiendo al login..."
        );
        localStorage.clear();
        window.location.href = "/login?redirectTo=/community";
        return;
      }

      if (response.status === "success" && response.posts) {
        // Parsear las publicaciones si es necesario
        const parsedPosts = Array.isArray(response.posts)
          ? response.posts
          : postParseResponse(response.posts);

        // Filtrar solo publicaciones (no consultas)
        const newPosts = parsedPosts.filter(
          (post: any) => post.publicationType !== "CONSULTA"
        );

        console.log(
          "[LOAD MORE INDEX] Nuevas publicaciones cargadas:",
          newPosts.length
        );
        console.log(
          "[LOAD MORE INDEX] Tipos de posts:",
          parsedPosts.map((p: any) => ({ id: p.id, type: p.publicationType }))
        );

        if (newPosts.length > 0) {
          // Filtrar duplicados - solo agregar posts que no existan ya
          setPostsList((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const uniqueNewPosts = newPosts.filter(
              (post: any) => !existingIds.has(post.id)
            );

            console.log(
              "[LOAD MORE INDEX] IDs existentes:",
              Array.from(existingIds)
            );
            console.log(
              "[LOAD MORE INDEX] IDs nuevos:",
              newPosts.map((p: any) => p.id)
            );
            console.log(
              "[LOAD MORE INDEX] Posts únicos a agregar:",
              uniqueNewPosts.length
            );

            if (uniqueNewPosts.length === 0) {
              console.log(
                "[LOAD MORE INDEX] Todos los posts ya estaban cargados"
              );
              setHasMoreFromServer(false);
              return prev;
            }

            const syncedNewPosts = syncPostsWithLikes(uniqueNewPosts);
            return [...prev, ...syncedNewPosts];
          });

          setVisiblePostsCount((prev) => prev + newPosts.length);
          // Si recibimos menos de 3 publicaciones, probablemente no hay más
          setHasMoreFromServer(newPosts.length >= 3);
        } else {
          console.log("[LOAD MORE INDEX] No se encontraron más publicaciones");
          setHasMoreFromServer(false);
        }
      } else {
        console.log(
          "[LOAD MORE INDEX] Respuesta inesperada del servidor:",
          response
        );
        setHasMoreFromServer(false);
      }
    }
  }, [loadMoreFetcher.data, loadMoreFetcher.state]);

  const handleLoadMore = () => {
    console.log("[LOAD MORE INDEX] Loading more posts...");
    console.log("[LOAD MORE INDEX] Current state:", {
      visiblePostsCount,
      postsListLength: postsList.length,
      hasMoreFromServer,
    });

    // Si ya mostramos todos los posts locales, cargar desde el servidor
    if (visiblePostsCount >= postsList.length && postsList.length > 0) {
      const lastPost = postsList[postsList.length - 1];
      const lastId = lastPost.id;

      console.log(
        "[LOAD MORE INDEX] Cargando más publicaciones desde el servidor, lastId:",
        lastId
      );
      loadMoreFetcher.load(`/api/post/obtenerTodas?lastId=${lastId}`);
    } else {
      // Incrementar el número de posts visibles
      console.log("[LOAD MORE INDEX] Mostrando más posts locales");
      setVisiblePostsCount((prev) =>
        Math.min(prev + POSTS_PER_PAGE, postsList.length)
      );
    }
  };

  const handlePostCreated = (newPost: Partial<Post>) => {
    console.log("Post created! Loading new posts from server...");

    // Cargar posts desde el servidor sin recargar la página
    loadMoreFetcher.load("/api/post/obtenerTodas");
  };

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Feed principal */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {/* Banner para usuarios no autenticados */}
          {isPublic && (
            <div className="bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¡Únete a nuestra comunidad!
              </h3>
              <p className="text-gray-600 mb-4">
                Inicia sesión para crear publicaciones, comentar y conectar con
                otros amantes de las mascotas.
              </p>
              <div className="flex gap-3">
                <a
                  href="/login?redirectTo=/community"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all font-medium shadow-lg"
                >
                  Iniciar sesión
                </a>
                <a
                  href="/register"
                  className="px-6 py-2 border border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-all font-medium"
                >
                  Registrarse
                </a>
              </div>
            </div>
          )}

          {/* Create Post Card - solo para usuarios autenticados */}
          {!isPublic && <CreatePostCard onPostCreated={handlePostCreated} />}
          {/* Feed Tabs */}
          <FeedTabs>
            {() => (
              <>
                <PostsList
                  posts={visiblePosts}
                  commentsMap={commentsMap}
                  commentsLoadingPostId={commentsLoadingPostId}
                  isSubmittingComment={
                    createCommentFetcher.state === "submitting"
                  }
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onSave={handleSave}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                />
                <LoadMoreButton
                  onClick={handleLoadMore}
                  isLoading={loadMoreFetcher.state === "loading"}
                  hasMore={hasMore}
                  isAuthenticated={!isPublic}
                />
              </>
            )}
          </FeedTabs>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-2 space-y-6">
          <TrendingSection posts={postsList} isPublic={isPublic} />
        </div>
      </div>
    </div>
  );
}
