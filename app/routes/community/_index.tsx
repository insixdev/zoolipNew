import { useState, useEffect, useRef } from "react";
import {
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
} from "react-router";
import TrendingSection from "~/components/community/TrendingSection";
import FeedTabs, { EmptyFollowingState } from "~/components/community/FeedTabs";
import CreatePostCard from "~/components/community/indexCommunity/CreatePostCard";
import PostsList from "~/components/community/indexCommunity/PostsList";
import LoadMoreButton from "~/components/community/indexCommunity/LoadMoreButton";
import type { Post } from "~/components/community/indexCommunity/PostCard";
import type { Comment } from "~/components/community/comentarios/CommentItem";
import { getAllPublicationsService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";
const POSTS_PER_PAGE = 5; // Número de posts a mostrar por página

// loader para cargar las post inciciales
async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  if (!cookie)
    return {
      // mas adelante obtener por endpoiinnt publico
      posts: null,
    };
  const fetchedPost = await getAllPublicationsService(cookie);
  const posts: Post[] = postParseResponse(fetchedPost);

  return { posts };
}

export default function CommunityIndex() {
  // Mapa de comentarios por postId. Inicializado a objeto vacío para evitar
  // tambien va ser "{}" porque solo se cargara cuando se presione el boton

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);

  // useLoaderData puede devolver undefined en SSR si el loader no se ejecutó
  const loaderData = useLoaderData<typeof loader>();

  const posts = loaderData?.posts ?? [];

  const [postsList, setPostsList] = useState<Post[]>(posts);
  const likeFetcher = useFetcher();

  const getByIdFetcher = useFetcher();
  const loadMoreFetcher = useFetcher();
  // ref para mapear la última petición de comentarios al postId correspondiente
  const lastRequestedCommentsPostId = useRef<string | null>(null);

  // Cuando el fetcher de getByIdFetcher trae data, la volcamos en commentsMap
  useEffect(() => {
    if (!getByIdFetcher.data) return;
    // El shape de la respuesta puede variar: intentamos extraer un array de comments
    const maybeData: any = getByIdFetcher.data;
    const fetchedComments = maybeData?.comments ?? maybeData;

    if (!Array.isArray(fetchedComments)) return;

    const postId = lastRequestedCommentsPostId.current;
    if (!postId) return;

    setCommentsMap((prev) => ({ ...(prev ?? {}), [postId]: fetchedComments }));
    lastRequestedCommentsPostId.current = null;
  }, [getByIdFetcher.data]);

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
    console.log("Like post:", postId);

    // Actualizar UI optimistamente
    setPostsList((prev) =>
      prev.map((post) =>
        post.id.toString() === postId
          ? {
              ...post,
              // alternar el flag booleano y ajustar el contador usando el flag previo
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    // TODO: Conectar con API cuando esté disponible
    // const formData = new FormData();
    // formData.append("id_publicacion", postId);
    // likeFetcher.submit(formData, {
    //   method: "post",
    //   action: "/api/post/like",
    // });
  };

  const handleComment = (postId: string) => {
    console.log("Toggle comments for post:", postId);
    // Guardamos el postId solicitado para poder mapear la respuesta del fetcher
    lastRequestedCommentsPostId.current = postId;
    getByIdFetcher.submit(
      { id_publicacion: postId },
      { method: "post", action: "/api/post/getByPostId" }
    );

    // Aseguramos que exista una entrada en el mapa para evitar errores de render
    setCommentsMap((prev) => {
      const curr = prev ?? {};
      return {
        ...curr,
        [postId]: curr[postId] ?? [],
      };
    });
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
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );

    // TODO: Conectar con API cuando esté disponible
  };

  const handleAddComment = (postId: string, content: string) => {
    console.log("Add comment to post:", postId, content);

    // Agregar comentario localmente (optimistic update)
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      author: {
        name: "Tu",
        username: "@tu",
        avatar: "https://i.pravatar.cc/150?img=33",
      },
      timestamp: "Ahora",
      likes: 0,
      isLiked: false,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    // Actualizar contador de comentarios
    setPostsList((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      )
    );

    // Disparar recarga de comentarios desde el servidor después del optimistic update
    lastRequestedCommentsPostId.current = postId;
    getByIdFetcher.submit(
      { id_publicacion: postId },
      { method: "post", action: "/api/post/getByPostId" }
    );

    // La API ya se llama desde CommentInput.tsx
  };
  // es cuando le damos like a un comentario
  const handleLikeComment = (postId: string, commentId: string) => {
    console.log("Like comment:", commentId, "on post:", postId);

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

    // TODO: Conectar con API cuando esté disponible
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
    console.log("Post created! Reloading...");
    // TODO: Recargar posts desde el servidor
    // loadMoreFetcher.load("/api/post/obtenerTodas");

    // Por ahora, mostrar mensaje
    alert("¡Publicación creada! Recarga la página para verla en el feed.");
  };

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Feed principal */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {/* Create Post Card */}
          Auth
          <CreatePostCard onPostCreated={handlePostCreated} />


          {/* Feed Tabs */}
          <FeedTabs>
            {(activeTab) => (
              <>
                {activeTab === "forYou" ? (
                  <>
                    <PostsList
                      posts={visiblePosts}
                      commentsMap={commentsMap}
                      commentsLoadingPostId={commentsLoadingPostId}
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
                ) : (
                  <EmptyFollowingState />
                )}
              </>
            )}
          </FeedTabs>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-2 space-y-6">
          <TrendingSection />
        </div>
      </div>
    </div>
  );
}
