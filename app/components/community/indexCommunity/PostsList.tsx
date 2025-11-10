import PostCard, { type Post } from "./PostCard";
import type { Comment } from "../comentarios/CommentItem";

type PostsListProps = {
  posts: Post[];
  commentsMap?: Record<string, Comment[]>;
  commentsLoadingPostId?: string | null;
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
  onLike,
  onComment,
  onShare,
  onSave,
  onAddComment,
  onLikeComment,
}: PostsListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          postComments={commentsMap[post.id] || []}
          postCommentsLoading={commentsLoadingPostId === post.id}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onSave={onSave}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
        />
      ))}
    </div>
  );
}
