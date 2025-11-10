import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import CommentsSection from "../comentarios/CommentsSection";
import type { Comment } from "../comentarios/CommentItem";

type PostAuthor = {
  username: string;
  avatar: string;
};

type Post = {
  id: string;
  type: "image" | "text";
  topico: string;
  content: string;
  image?: string;
  author: PostAuthor;
  fecha_edicion: string;
  fecha_creacion: string;
  fecha_duda_resuelta: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
};

type PostCardProps = {
  post: Post;
  postComments?: Comment[];
  postCommentsLoading?: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
};
/**
 * Componente de tarjeta de publicación con comentarios
 * que se pasan como props
 * */
export default function PostCard({
  post,
  postComments = [],
  postCommentsLoading = false,
  onLike,
  onComment,
  onShare,
  onSave,
  onAddComment,
  onLikeComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  const handleCommentClick = () => {
    const newShowState = !showComments;
    setShowComments(newShowState);
    onComment?.(post.id);
  };

  const handleAddComment = (content: string) => {
    onAddComment?.(post.id, content);
  };

  const handleLikeComment = (commentId: string) => {
    onLikeComment?.(post.id, commentId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={post.author.avatar}
                alt={post.author.username}
              />
              <AvatarFallback>
                {post.author.username?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {post.author.username}
              </p>
              <p className="text-xs text-gray-500">
                {post.author.username} · {post.fecha_creacion}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={18} className="text-gray-600" />
          </button>
        </div>

        <p className="text-gray-800 text-sm whitespace-pre-wrap mb-3 line-clamp-4">
          {post.content}
        </p>
      </div>

      {post.type === "image" && post.image && (
        <div className="rounded-xl overflow-hidden">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="p-5 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => onLike?.(post.id)}
              className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
            >
              <Heart
                size={18}
                className={post.isLiked ? "fill-red-500 text-red-500" : ""}
              />
              <span className="font-medium text-sm">{post.likes}</span>
            </button>

            <button
              onClick={handleCommentClick}
              className={`flex items-center gap-2 transition-colors ${
                showComments
                  ? "text-rose-600"
                  : "text-gray-600 hover:text-rose-600"
              }`}
            >
              <MessageCircle size={18} />
              <span className="font-medium text-sm">{post.comments}</span>
            </button>

            <button
              onClick={() => onShare?.(post.id)}
              className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
            >
              <Share2 size={18} />
              <span className="font-medium text-sm">{post.shares}</span>
            </button>
          </div>

          <button
            onClick={() => onSave?.(post.id)}
            className="text-gray-600 hover:text-rose-600 transition-colors"
          >
            <Bookmark
              size={18}
              className={post.isSaved ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>
        </div>
      </div>

      {/* Comments Section - Hidden by default */}
      {showComments && (
        <>
          {postCommentsLoading && postComments.length === 0 ? (
            <div className="bg-gray-50 p-8 flex items-center justify-center">
              <Loader2 className="animate-spin text-rose-500" size={24} />
              <span className="ml-2 text-gray-600">
                Cargando comentarios...
              </span>
            </div>
          ) : (
            <CommentsSection
              postId={post.id}
              comments={postComments}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
            />
          )}
        </>
      )}
    </div>
  );
}

export type { Post, PostAuthor };
