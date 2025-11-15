import { MessageCircle, ThumbsUp, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import CommentsSection from "../comentarios/CommentsSection";
import type { Comment } from "../comentarios/CommentItem";

interface PreguntaProps {
  id: string;
  title: string;
  content?: string; // Descripción/contenido adicional
  author: string;
  authorId?: number; // ID del autor para link al perfil
  avatar: string;
  timestamp: string;
  responses: number;
  likes: number;
  isLiked?: boolean;
  category: string;
  // Props para comentarios
  comments?: Comment[];
  commentsLoading?: boolean;
  isSubmittingComment?: boolean;
  onComment?: (consultaId: string) => void;
  onAddComment?: (consultaId: string, content: string) => void;
  onLikeComment?: (consultaId: string, commentId: string) => void;
  onLike?: (consultaId: string) => void;
}

export function Pregunta({
  id,
  title,
  content,
  author,
  authorId,
  avatar,
  timestamp,
  responses,
  likes,
  isLiked = false,
  category,
  comments = [],
  commentsLoading = false,
  isSubmittingComment = false,
  onComment,
  onAddComment,
  onLikeComment,
  onLike,
}: PreguntaProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(responses);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);

  // Sincronizar estado local con props cuando cambian
  useEffect(() => {
    setLocalIsLiked(isLiked);
    setLocalLikes(likes);
  }, [isLiked, likes]);

  // Actualizar contador cuando cambian los comentarios
  useEffect(() => {
    if (comments.length > 0) {
      setCommentCount(comments.length);
    }
  }, [comments]);

  const handleCommentClick = () => {
    const newShowState = !showComments;
    setShowComments(newShowState);
    onComment?.(id);
  };

  const handleAddComment = (content: string) => {
    onAddComment?.(id, content);
  };

  const handleLikeComment = (commentId: string) => {
    onLikeComment?.(id, commentId);
  };

  const handleLike = () => {
    onLike?.(id);
  };

  // Formatear fecha de forma relativa
  const formatTimestamp = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Ahora";
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours}h`;
      if (diffDays < 7) return `Hace ${diffDays}d`;

      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    } catch (err) {
      return dateString;
    }
  };

  const formattedTimestamp = formatTimestamp(timestamp);
  // Función para obtener los colores según la categoría
  const getCategoryColors = (cat: string) => {
    const categoryLower = cat.toLowerCase();

    switch (categoryLower) {
      case "salud":
        return {
          bg: "bg-gradient-to-r from-red-100 to-red-200",
          text: "text-red-700",
          border: "border-red-300",
        };
      case "comportamiento":
        return {
          bg: "bg-gradient-to-r from-purple-100 to-purple-200",
          text: "text-purple-700",
          border: "border-purple-300",
        };
      case "adopción":
        return {
          bg: "bg-gradient-to-r from-blue-100 to-blue-200",
          text: "text-blue-700",
          border: "border-blue-300",
        };
      case "alimentación":
        return {
          bg: "bg-gradient-to-r from-green-100 to-green-200",
          text: "text-green-700",
          border: "border-green-300",
        };
      case "entrenamiento":
        return {
          bg: "bg-gradient-to-r from-orange-100 to-orange-200",
          text: "text-orange-700",
          border: "border-orange-300",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-rose-100 to-pink-100",
          text: "text-rose-700",
          border: "border-rose-200",
        };
    }
  };

  const categoryColors = getCategoryColors(category);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
      <div className="flex items-start gap-6">
        {authorId ? (
          <Link
            to={`/community/profile/${authorId}`}
            className="relative flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={avatar}
              alt={author}
              className="w-14 h-14 rounded-full ring-4 ring-rose-100 hover:ring-rose-300 transition-all cursor-pointer"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </Link>
        ) : (
          <div className="relative flex-shrink-0">
            <img
              src={avatar}
              alt={author}
              className="w-14 h-14 rounded-full ring-4 ring-rose-100"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 hover:text-rose-600 transition-colors mb-2 line-clamp-2 pr-4">
                {title}
              </h3>
              <div className="flex items-center gap-3 mb-3">
                {authorId ? (
                  <Link
                    to={`/community/profile/${authorId}`}
                    className="text-base font-medium text-gray-700 hover:text-rose-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    por {author}
                  </Link>
                ) : (
                  <span className="text-base font-medium text-gray-700">
                    por {author}
                  </span>
                )}
                <span className="text-gray-300">•</span>
                <span
                  className="text-sm text-gray-500"
                  suppressHydrationWarning
                >
                  {formattedTimestamp}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`px-3 py-1 ${categoryColors.bg} ${categoryColors.text} text-xs font-semibold rounded-full border ${categoryColors.border} whitespace-nowrap`}
              >
                {category}
              </span>
            </div>
          </div>

          {/* Descripción/Contenido adicional */}
          {content && (
            <div className="mb-3 mt-2 pt-2 border-t border-gray-100">
              <p className="text-gray-700 text-base leading-snug line-clamp-3">
                {content}
              </p>
            </div>
          )}

          <div className="flex items-center gap-8 mt-6">
            <button
              onClick={handleCommentClick}
              className={`flex items-center gap-3 transition-colors cursor-pointer ${
                showComments
                  ? "text-rose-600"
                  : "text-gray-600 hover:text-rose-600"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${showComments ? "bg-rose-100" : "bg-gray-100"}`}
              >
                <MessageCircle size={18} />
              </div>
              <span className="font-medium">{commentCount} respuestas</span>
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center gap-3 transition-colors cursor-pointer ${
                localIsLiked
                  ? "text-rose-600"
                  : "text-gray-600 hover:text-rose-600"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${localIsLiked ? "bg-rose-100" : "bg-gray-100"}`}
              >
                <ThumbsUp
                  size={18}
                  className={localIsLiked ? "fill-rose-600" : ""}
                />
              </div>
              <span className="font-medium">{localLikes} me gusta</span>
            </button>
            <div className="flex items-center gap-3 text-gray-500">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock size={18} />
              </div>
              <span className="font-medium" suppressHydrationWarning>
                Activa {formattedTimestamp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <>
          {commentsLoading && comments.length === 0 ? (
            <div className="bg-gray-50 p-8 flex items-center justify-center mt-4 rounded-xl">
              <Loader2 className="animate-spin text-rose-500" size={24} />
              <span className="ml-2 text-gray-600">Cargando respuestas...</span>
            </div>
          ) : (
            <div className="mt-4">
              <CommentsSection
                postId={id}
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                isSubmitting={isSubmittingComment}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
