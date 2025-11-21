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
    avatar: string | null;
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
      {comment.author.avatar ? (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        </Avatar>
      ) : (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
      )}

      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-2xl px-4 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm">
                {comment.author.name}
              </p>
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
            </div>
          </div>
          <p className="text-gray-800 text-sm">{comment.content}</p>
        </div>


      </div>
    </div>
  );
}
