import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Heart, MoreHorizontal } from "lucide-react";

export type Comment = {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
  likes: number;
  isLiked: boolean;
};

type CommentItemProps = {
  comment: Comment;
  onLike?: (commentId: string) => void;
};

export default function CommentItem({ comment, onLike }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-3">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-2xl px-4 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">
                {comment.author.name}
              </p>
              <span className="text-xs text-gray-500">{comment.timestamp}</span>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <MoreHorizontal size={14} className="text-gray-600" />
            </button>
          </div>
          <p className="text-gray-800 text-sm">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 mt-1 px-2">
          <button
            onClick={() => onLike?.(comment.id)}
            className="flex items-center gap-1 text-gray-600 hover:text-rose-600 transition-colors text-xs"
          >
            <Heart
              size={14}
              className={comment.isLiked ? "fill-red-500 text-red-500" : ""}
            />
            <span className="font-medium">{comment.likes}</span>
          </button>
          <button className="text-xs text-gray-600 hover:text-rose-600 transition-colors font-medium">
            Responder
          </button>
        </div>
      </div>
    </div>
  );
}
