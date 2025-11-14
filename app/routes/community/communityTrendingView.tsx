import { useState, useEffect, useRef } from "react";
import {
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
  Link,
} from "react-router";
import { Hash, ArrowLeft, TrendingUp, Users, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import PostsList from "~/components/community/indexCommunity/PostsList";
import type { Post } from "~/components/community/indexCommunity/PostCard";
import type { Comment } from "~/components/community/comentarios/CommentItem";
import { getAllPublicPublicationsService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse";
import { getUserLikes, addLike, removeLike } from "~/lib/likeStorage";

// Loader para cargar posts filtrados por hashtag
export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const { hashtag } = params;

  if (!cookie) {
    return redirect("/auth/login");
  }

  if (!hashtag) {
    return redirect("/community");
  }

  try {
    const fetchedPost = await getAllPublicPublicationsService(cookie);
    const allPosts: Post[] = postParseResponse(fetchedPost);

    // Filtrar posts por el hashtag (con o sin #)
    const normalizedTag = hashtag.startsWith("#") ? hashtag.slice(1) : hashtag;
    const filteredPosts = allPosts.filter((post) => {
      if (!post.topico) return false;
      const postTopic = post.topico.startsWith("#")
        ? post.topico.slice(1)
        : post.topico;
      return postTopic.toLowerCase() === normalizedTag.toLowerCase();
    });

    // Obtener hashtags relacionados de todos los posts
    const relatedTopics = allPosts.reduce(
      (acc, post) => {
        if (post.topico && post.topico !== `#${normalizedTag}`) {
          const topic = post.topico.startsWith("#")
            ? post.topico
            : `#${post.topico}`;
          acc[topic] = (acc[topic] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const relatedHashtags = Object.entries(relatedTopics)
      .map(([tag, count]) => ({ tag, posts: count }))
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 5);

    return {
      posts: filteredPosts,
      hashtag: normalizedTag,
      relatedHashtags,
    };
  } catch (error) {
    console.error("Error loading posts by hashtag:", error);
    return { posts: [], hashtag, relatedHashtags: [] };
  }
}

export default function CommunityTrendingView() {
  const { posts, hashtag, relatedHashtags } = useLoaderData<typeof loader>();
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [postsList, setPostsList] = useState<Post[]>(() => {
    const userLikes = getUserLikes();
    return posts.map((post) => ({
      ...post,
      isLiked: userLikes.has(post.id),
    }));
  });
  const likeFetcher = useFetcher();
  const getByIdFetcher = useFetcher();
  const lastRequestedCommentsPostId = useRef<string | null>(null);

  const currentHashtag = `#${hashtag}`;

  // Recargar posts cuando cambia el hashtag
  useEffect(() => {
    const userLikes = getUserLikes();
    setPostsList(
      posts.map((post) => ({
        ...post,
        isLiked: userLikes.has(post.id),
      }))
    );
    // Limpiar comentarios cuando cambia el hashtag
    setCommentsMap({});
  }, [hashtag, posts]);

  useEffect(() => {
    if (!getByIdFetcher.data) return;
    const maybeData: any = getByIdFetcher.data;
    const fetchedComments = maybeData?.comments ?? maybeData;

    if (!Array.isArray(fetchedComments)) return;

    const postId = lastRequestedCommentsPostId.current;
    if (!postId) return;

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: fetchedComments,
    }));
  }, [getByIdFetcher.data]);

  const handleLike = (postId: string) => {
    console.log("Like post:", postId);

    const postIdNum = parseInt(postId);
    const post = postsList.find((p) => p.id?.toString() === postId);
    const wasLiked = post?.isLiked || false;

    // Actualizar localStorage
    if (wasLiked) {
      removeLike(postIdNum);
    } else {
      addLike(postIdNum);
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

    // Enviar like al backend
    likeFetcher.submit(
      {},
      {
        method: "post",
        action: `/api/post/like/${postId}`,
      }
    );
  };

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId);
    if (commentsMap[postId]) {
      return;
    }

    lastRequestedCommentsPostId.current = postId;
    getByIdFetcher.load(`/api/post/comentarios/${postId}`);
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
  };

  const handleSave = (postId: string) => {
    console.log("Save post:", postId);
  };

  const handleAddComment = (postId: string, content: string) => {
    console.log("Add comment to post:", postId, content);
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    console.log("Like comment:", commentId, "on post:", postId);
  };

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      {/* Header con navegación */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/community"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center">
                <Hash className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentHashtag}
                </h1>
                <p className="text-gray-600">
                  {postsList.length}{" "}
                  {postsList.length === 1 ? "publicación" : "publicaciones"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Feed principal */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {postsList.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Hash className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay publicaciones con este tópico
              </h3>
              <p className="text-gray-600 mb-6">
                Sé el primero en crear una publicación con {currentHashtag}
              </p>
              <Link
                to="/community/consultas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Crear publicación
              </Link>
            </div>
          ) : (
            <PostsList
              posts={postsList}
              commentsMap={commentsMap}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              commentsLoading={getByIdFetcher.state === "loading"}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-2 space-y-6">
          {/* Información del hashtag */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="text-rose-500" size={20} />
              Sobre {currentHashtag}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de publicaciones</span>
                <span className="font-semibold text-rose-600">
                  {postsList.length}
                </span>
              </div>
            </div>
          </div>

          {/* Hashtags relacionados */}
          {relatedHashtags.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-rose-500" size={20} />
                Tópicos Relacionados
              </h3>
              <div className="space-y-3">
                {relatedHashtags.map((topic, index) => (
                  <Link
                    key={index}
                    to={`/community/hashtag/${topic.tag.replace("#", "")}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-rose-600">{topic.tag}</p>
                      <p className="text-sm text-gray-500">
                        {topic.posts}{" "}
                        {topic.posts === 1 ? "publicación" : "publicaciones"}
                      </p>
                    </div>
                    <Hash size={16} className="text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
