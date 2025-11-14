import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Heart, MoreHorizontal, BadgeCheck } from "lucide-react";
import { Link } from "react-router";
import { ADMIN_ROLES } from "~/lib/constants";

export type Comment = {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    userId?: number; // ID del usuario para navegar a su perfil
    role?: string; // Rol del usuario (REFUGIO, VETERINARIA, etc.)
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
  const hasUserId =
    comment.author.userId !== undefined && comment.author.userId !== null;
  const profileLink = hasUserId
    ? `/community/profile/${comment.author.userId}`
    : "#";

  // Verificar si es una institución verificada
  const isVerified =
    comment.author.role === ADMIN_ROLES.REFUGIO ||
    comment.author.role === ADMIN_ROLES.VETERINARIO;

  // Obtener el badge de institución
  const getInstitutionBadge = () => {
    if (comment.author.role === ADMIN_ROLES.REFUGIO) {
      return {
        label: "Refugio",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      };
    }
    if (comment.author.role === ADMIN_ROLES.VETERINARIO) {
      return {
        label: "Veterinaria",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      };
    }
    return null;
  };

  const institutionBadge = getInstitutionBadge();

  console.log(
    `[COMMENT ITEM] Rendering comment from ${comment.author.name}, userId: ${comment.author.userId}, role: ${comment.author.role}, hasUserId: ${hasUserId}`
  );

  return (
    <div className="flex gap-3 py-3">
      {hasUserId ? (
        <Link
          to={profileLink}
          className="flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="w-8 h-8 hover:ring-2 hover:ring-rose-300 transition-all cursor-pointer">
            <AvatarImage
              src={comment.author.avatar}
              alt={comment.author.name}
            />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
      )}

      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-2xl px-4 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {hasUserId ? (
                <Link
                  to={profileLink}
                  className="font-semibold text-gray-900 text-sm hover:text-rose-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {comment.author.name}
                </Link>
              ) : (
                <p className="font-semibold text-gray-900 text-sm">
                  {comment.author.name}
                </p>
              )}
              {isVerified && (
                <BadgeCheck size={14} className="text-blue-500 fill-blue-500" />
              )}
              {institutionBadge && (
                <span
                  className={`px-1.5 py-0.5 ${institutionBadge.bgColor} ${institutionBadge.textColor} text-xs font-semibold rounded-full border ${institutionBadge.borderColor}`}
                >
                  {institutionBadge.label}
                </span>
              )}
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
