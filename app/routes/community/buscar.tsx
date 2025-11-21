// Página de búsqueda de la comunidad
import { LoaderFunctionArgs, useLoaderData, useFetcher } from "react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { BarraBusqueda } from "~/components/community/buscar/BarraBusqueda";
import { ResultadoBusqueda } from "~/components/community/buscar/ResultadoBusqueda";
import TrendingSection from "~/components/community/TrendingSection";
import { requireAuth } from "~/lib/authGuard";
import { usePostSearch } from "~/hooks/usePostSearch";
import { Loader2 } from "lucide-react";
import { getUserLikes, addLike, removeLike } from "~/lib/likeStorage";
import { getAllPublicPublicationsService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse";
import { formatTimestamp, formatTimestampLong, formatTimestampTime } from "~/lib/formatTimestamp";
import type { Post } from "~/components/community/indexCommunity/PostCard";

// Loader para verificar autenticacion y obtener token y posts para tendencias
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);

  // Obtener el token de las cookies del request
  const cookieHeader = request.headers.get("Cookie");
  let token = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "AUTH_TOKEN") {
        token = value;
        break;
      }
    }
  }

  // Cargar posts para las tendencias
  let posts: Post[] = [];
  try {
    const fetchedPost = await getAllPublicPublicationsService(
      cookieHeader || ""
    );
    posts = postParseResponse(fetchedPost);
  } catch (error) {
    console.error("Error loading posts for trending:", error);
  }

  return { token, posts };
}

export default function CommunityBuscar() {
  const {token, posts } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [postsState, setPostsState] = useState<any[]>([]);

  const {
    postResults,
    userResults: rawUserResults,
    isSearching,
    error,
    search,
    isConnected,
  } = usePostSearch(token);

  const likeFetcher = useFetcher();
  const commentFetcher = useFetcher();
  const getCommentsFetcher = useFetcher();

  // Formatear usuarios del WebSocket
  const userResults = useMemo(() => {
    return rawUserResults.map((user: any) => ({
      id: user.id || user.id_usuario,
      type: "user" as const,
      name: user.nombre || user.username,
      username: `@${user.username}`,
      avatar: user.imagen_url || user.imagenUrl || "",
      bio: user.email || "",
      role: user.role || user.rol,
    }));
  }, [rawUserResults]);

  // Convertir los posts del WebSocket al formato de ResultadoBusqueda
  const formattedPostResults = useMemo(() => {
    return postResults.map((post) => ({
      id: String(post.id_publicacion || post.idPublicacion || 0),
      type: "post" as const,
      author: post.nombreUsuario || "Usuario",
      authorId: post.id|| post.idUsuario,
      username: `@${post.nombreUsuario || "usuario"}`,
      avatar: post.imagenUrl || post.imagen_url || post.imagen_usuario || post.imagenUsuario || "",
      content: post.contenido,
      topico: post.topico,
      publicationType: post.tipo as "CONSULTA" | "PUBLICACION",
      likes: post.likes || 0,
      comments: 0,
      timestamp: formatTimestamp(
        post.fechaEdicion || post.fechaPregunta || ""
      ),
      role: post.rolUsuario || post.rol_usuario,
    }));
  }, [postResults]);

  // Combinar resultados de posts y usuarios
  const allResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    // Filtrar usuarios que coincidan con la búsqueda
    const filteredUsers = userResults.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Combinar posts del WebSocket con usuarios filtrados
    // Agregar prefijo al id para evitar colisiones
    const postsWithPrefix = formattedPostResults.map((post) => ({
      ...post,
      id: `post-${post.id}`,
    }));

    const usersWithPrefix = filteredUsers.map((user) => ({
      ...user,
      id: `user-${user.id}`,
    }));

    return [...postsWithPrefix, ...usersWithPrefix];
  }, [searchQuery, formattedPostResults, userResults]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query); // Buscar posts Y usuarios por WebSocket
    }
  };

  // Sincronizar posts con likes de localStorage
  useEffect(() => {
    const userLikes = getUserLikes();
    const postsWithLikes = formattedPostResults.map((post) => ({
      ...post,
      isLiked: userLikes.has(parseInt(post.id.replace("post-", ""))),
    }));
    setPostsState(postsWithLikes);
  }, [formattedPostResults]);

  // Manejar likes
  const handleLike = (postId: string) => {
    const cleanId = postId.replace("post-", "");
    const postIdNum = parseInt(cleanId);
    const post = postsState.find((p) => p.id === postId);

    if (!post) return;

    const wasLiked = post.isLiked || false;

    // Actualizar localStorage
    if (wasLiked) {
      removeLike(postIdNum);
    } else {
      addLike(postIdNum);
    }

    // Actualizar UI optimistamente
    setPostsState((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );

    // Enviar like al backend
    const formData = new FormData();
    formData.append("isLiked", wasLiked.toString());
    formData.append("action", "toggle");

    likeFetcher.submit(formData, {
      method: "post",
      action: `/api/post/like/${cleanId}`,
    });
  };

  // Manejar comentarios
  const handleComment = (postId: string) => {
    const cleanId = postId.replace("post-", "");

    // Si ya tenemos comentarios, no hacer nada
    if (commentsMap[postId]) {
      return;
    }

    // Cargar comentarios
    getCommentsFetcher.load(`/api/post/comentarios/${cleanId}`);
  };

  // Manejar agregar comentario
  const handleAddComment = (postId: string, content: string) => {
    const cleanId = postId.replace("post-", "");

    const formData = new FormData();
    formData.append("id_publicacion", cleanId);
    formData.append("contenido", content);

    commentFetcher.submit(formData, {
      method: "post",
      action: "/api/comments/crear",
    });

    // Actualizar contador optimistamente
    setPostsState((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      )
    );
  };

  // Manejar compartir
  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
    alert("Funcionalidad de compartir próximamente");
  };

  // Manejar guardar
  const handleBookmark = (postId: string) => {
    console.log("Bookmark post:", postId);
    // Actualizar UI optimistamente
    setPostsState((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  // Manejar like de comentario
  const handleLikeComment = (postId: string, commentId: string) => {
    console.log("Like comment:", commentId, "on post:", postId);
  };

  useEffect(() => {
    if (getCommentsFetcher.data) {
      const maybeData: any = getCommentsFetcher.data;
      const fetchedComments = maybeData?.comments ?? maybeData;

      if (Array.isArray(fetchedComments)) {
        const postId = postsState.find(
          (p) => getCommentsFetcher.state === "idle"
        )?.id;

        if (postId) {
          setCommentsMap((prev) => ({
            ...prev,
            [postId]: fetchedComments,
          }));
        }
      }
    }
  }, [getCommentsFetcher.data]);

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      {/* Barra de búsqueda */}
      <BarraBusqueda onSearch={handleSearch} />

      {/* Estado de conexión */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200">
          Conectando al servidor de búsqueda...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Resultados principales */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-rose-500" size={32} />
              <span className="ml-3 text-gray-600">Buscando...</span>
            </div>
          )}

          {!isSearching && searchQuery && allResults.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No se encontraron resultados</p>
              <p className="text-sm mt-2">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}

          {!isSearching && !searchQuery && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Busca publicaciones y usuarios</p>
              <p className="text-sm mt-2">
                Escribe algo en la barra de búsqueda
              </p>
            </div>
          )}

          {!isSearching && allResults.length > 0 && (
            <>
              <div className="text-sm text-gray-600 mb-4">
                {allResults.length} resultado
                {allResults.length !== 1 ? "s" : ""} encontrado
                {allResults.length !== 1 ? "s" : ""}
              </div>
              {allResults.map((result) => {
                // Buscar el post con estado actualizado
                const postWithState = postsState.find(
                  (p) => p.id === result.id
                );
                const resultWithState = postWithState || result;

                return (
                  <ResultadoBusqueda
                    key={result.id}
                    result={resultWithState}
                    comments={commentsMap[result.id]}
                    onLike={handleLike}
                    onComment={handleComment}
                    onBookmark={handleBookmark}
                    onAddComment={handleAddComment}
                    onLikeComment={handleLikeComment}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* Sidebar con tendencias */}
        <div className="xl:col-span-2">
          <TrendingSection posts={posts} isPublic={false} />
        </div>
      </div>
    </div>
  );
}

// Helper para formatear timestamp
// Re-export from centralized location
export { formatTimestamp, formatTimestampLong, formatTimestampTime } from "~/lib/formatTimestamp";

