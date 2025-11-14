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
  console.log("cookie", cookie);

  // Permitir acceso sin cookie (modo público)
  // Si no hay cookie, simplemente retornar posts vacíos o públicos
  if (!cookie) {
    return { posts: [], isPublic: true };
  }

  try {
    console.log("Calling getAllPublicPublicationsService...");
    const fetchedPost = await getAllPublicPublicationsService(cookie);

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
    const publicacionesOnly = posts.filter(
      (post) => post.publicationType !== "CONSULTA"
    );

    console.log(
      "AFTERfilter - Publicaciones only:",
      publicacionesOnly.length
    );
    console.log(
      " Filtred postss",
      publicacionesOnly.map((p) => ({ id: p.id, type: p.publicationType }))
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
      const updated = prev.map((post) =>
        post.id?.toString() === postId
          ? { ...post, comments: fetchedComments.length }
          : post
      );
      return syncPostsWithLikes(updated);
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
  const hasMore = visiblePostsCount < postsList.length;
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
    setPostsList((prev) =>
      prev.map((post) =>
        post.id?.toString() === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );

    // Disparar recarga de comentarios desde el servidor después del optimistic update
    lastRequestedCommentsPostId.current = postId;
    console.log("🔵 [COMMENT] Recargando comentarios para post:", postId);
    getByIdFetcher.load(`/api/post/comentarios/${postId}`);
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

  const handleLoadMore = () => {
    console.log("Loading more posts...");
    // Incrementar el número de posts visibles
    setVisiblePostsCount((prev) =>
      Math.min(prev + POSTS_PER_PAGE, postsList.length)
    );

    // TODO: Si quieres cargar desde el servidor:
    // loadMoreFetcher.load("/api/post/obtenerTodas");
  };

  const handlePostCreated = () => {
    console.log("Post created! Reloading posts...");
    // Recargar la página para obtener los posts actualizados
    window.location.reload();
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
