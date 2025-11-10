import CommentItem, { type Comment } from "./CommentItem";

type CommentsListProps = {
  comments: Comment[];
  onLikeComment?: (commentId: string) => void;
};

export default function CommentsList({
  comments,
  onLikeComment,
}: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No hay comentarios aún. ¡Sé el primero en comentar!
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onLike={onLikeComment}
        />
      ))}
    </div>
  );
}
