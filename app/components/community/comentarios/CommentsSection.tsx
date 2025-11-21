import CommentsList from "./CommentsList";
import CommentInput from "./CommentInput";
import type { Comment } from "./CommentItem";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

type CommentsSectionProps = {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  isSubmitting?: boolean;
};

export default function CommentsSection({
  postId,
  comments,
  onAddComment,
  onLikeComment,
  isSubmitting = false,
}: CommentsSectionProps) {
  const { user } = useSmartAuth();

  console.log(`[COMMENTS SECTION] Rendering ${comments.length} comments for post ${postId}`);
  if (comments.length > 0) {
    console.log(`[COMMENTS SECTION] First comment:`, comments[0]);
  }

  return (
    <div className="bg-gray-50">
      <CommentsList comments={comments} onLikeComment={onLikeComment} />
      <CommentInput
        postId={postId}
        onSubmit={onAddComment}
        isSubmitting={isSubmitting}
        userAvatar={user?.imagen_url || ""}
        userName={user?.username || "Usuario"}
      />
    </div>
  );
}
