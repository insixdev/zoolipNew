import CommentsList from "./CommentsList";
import CommentInput from "./CommentInput";
import type { Comment } from "./CommentItem";

type CommentsSectionProps = {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
};

export default function CommentsSection({
  postId,
  comments,
  onAddComment,
  onLikeComment,
}: CommentsSectionProps) {
  return (
    <div className="bg-gray-50">
      <CommentsList comments={comments} onLikeComment={onLikeComment} />
      <CommentInput postId={postId} onSubmit={onAddComment} />
    </div>
  );
}
