import PostCard, { type Post } from "./PostCard";
import type { Comment } from "../comentarios/CommentItem";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

type PostsListProps = {
  posts: Post[];
  commentsMap?: Record<string, Comment[]>;
  commentsLoadingPostId?: string | null;
  isSubmittingComment?: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
};
/**
 * en listado de componentes
 * de post
 * */
export default function PostsList({
  posts,
  commentsMap = {},
  commentsLoadingPostId,
  isSubmittingComment = false,
  onLike,
  onComment,
  onShare,
  onSave,
  onAddComment,
  onLikeComment,
}: PostsListProps) {
  console.log("PostsList rendering with", posts.length, "posts");
  const { user } = useSmartAuth();
  if (user) {
    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No hay publicaciones aún</p>
          <p className="text-sm mt-2">¡Sé el primero en crear una!</p>
        </div>
      );
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        if (!post || !post.id) {
          console.warn("Invalid post in PostsList:", post);
          return null;
        }

        return (
          <PostCard
            key={post.id}
            post={post}
            postComments={commentsMap[post.id] || []}
            postCommentsLoading={commentsLoadingPostId === post.id?.toString()}
            isSubmittingComment={isSubmittingComment}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onSave={onSave}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
          />
        );
      })}
    </div>
  );
}
