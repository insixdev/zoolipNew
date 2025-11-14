import { Heart, MessageCircle, Bookmark, BadgeCheck } from "lucide-react";
import { Link } from "react-router";
import { ADMIN_ROLES } from "~/lib/constants";

interface UserResult {
  type: "user";
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: string;
  isFollowing: boolean;
  bio: string;
  role?: string;
}

interface PostResult {
  type: "post";
  id: string;
  author: string;
  authorId?: number;
  username: string;
  avatar: string;
  content: string;
  topico?: string;
  publicationType?: "CONSULTA" | "PUBLICACION";
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  role?: string;
}

type SearchResult = UserResult | PostResult;

interface ResultadoBusquedaProps {
  result: SearchResult;
  comments?: any[];
  onFollowToggle?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
}

export function ResultadoBusqueda({
  result,
  comments,
  onFollowToggle,
  onLike,
  onComment,
  onBookmark,
  onAddComment,
  onLikeComment,
}: ResultadoBusquedaProps) {
  if (result.type === "user") {
    const cleanUserId = result.id.replace("user-", "");
    const isVerified =
      result.role === ADMIN_ROLES.REFUGIO ||
      result.role === ADMIN_ROLES.VETERINARIO;

    return (
      <Link
        to={`/community/profile/${cleanUserId}`}
        className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={result.avatar}
              alt={result.name}
              className="w-16 h-16 rounded-full ring-4 ring-gray-100 hover:ring-rose-200 transition-all"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 hover:text-rose-600 transition-colors">
                  {result.name}
                </h3>
                {isVerified && (
                  <BadgeCheck
                    size={18}
                    className="text-blue-500 fill-blue-500"
                  />
                )}
              </div>
              <p className="text-gray-600">{result.username}</p>
              <p className="text-sm text-gray-500 mt-1">{result.followers}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFollowToggle?.(result.id);
              }}
              className={`px-6 py-2 rounded-xl font-semibold transition-colors ${
                result.isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
            >
              {result.isFollowing ? "Siguiendo" : "Seguir"}
            </button>
          </div>
          <p className="text-gray-700 mt-4">{result.bio}</p>
        </div>
      </Link>
    );
  }

  // Post result
  const cleanPostId = result.id.replace("post-", "");
  const isVerified =
    result.role === ADMIN_ROLES.REFUGIO ||
    result.role === ADMIN_ROLES.VETERINARIO;

  const getInstitutionBadge = () => {
    if (result.role === ADMIN_ROLES.REFUGIO) {
      return {
        label: "Refugio",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      };
    }
    if (result.role === ADMIN_ROLES.VETERINARIO) {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          {result.authorId ? (
            <Link
              to={`/community/profile/${result.authorId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={result.avatar}
                alt={result.author}
                className="w-10 h-10 rounded-full hover:ring-2 hover:ring-rose-300 transition-all cursor-pointer"
              />
            </Link>
          ) : (
            <img
              src={result.avatar}
              alt={result.author}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {result.authorId ? (
                <Link
                  to={`/community/profile/${result.authorId}`}
                  className="font-semibold text-gray-900 hover:text-rose-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {result.author}
                </Link>
              ) : (
                <h4 className="font-semibold text-gray-900">{result.author}</h4>
              )}
              {isVerified && (
                <BadgeCheck size={16} className="text-blue-500 fill-blue-500" />
              )}
              {institutionBadge && (
                <span
                  className={`px-2 py-0.5 ${institutionBadge.bgColor} ${institutionBadge.textColor} text-xs font-semibold rounded-full border ${institutionBadge.borderColor}`}
                >
                  {institutionBadge.label}
                </span>
              )}
              {result.publicationType === "CONSULTA" && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                  Consulta
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {result.username} • {result.timestamp}
            </p>
          </div>
        </div>
        {result.topico && (
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
              {result.topico}
            </span>
          </div>
        )}
        <p className="text-gray-800 mb-4">{result.content}</p>
      </div>

      {result.image && (
        <div className="rounded-xl overflow-hidden">
          <img
            src={result.image}
            alt="Post content"
            className="w-full h-80 object-cover"
          />
        </div>
      )}

      <div className="p-6 pt-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onLike?.(result.id)}
            className={`flex items-center gap-2 transition-colors ${
              (result as any).isLiked
                ? "text-rose-600"
                : "text-gray-600 hover:text-rose-600"
            }`}
          >
            <Heart
              size={20}
              className={(result as any).isLiked ? "fill-rose-600" : ""}
            />
            <span className="font-medium">{result.likes}</span>
          </button>
          <button
            onClick={() => onComment?.(result.id)}
            className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-medium">{result.comments}</span>
          </button>
          <button
            onClick={() => onBookmark?.(result.id)}
            className={`flex items-center gap-2 transition-colors ml-auto ${
              (result as any).isSaved
                ? "text-rose-600"
                : "text-gray-600 hover:text-rose-600"
            }`}
          >
            <Bookmark
              size={20}
              className={(result as any).isSaved ? "fill-rose-600" : ""}
            />
          </button>
        </div>

        {/* Sección de comentarios */}
        {comments && comments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={`https://i.pravatar.cc/150?img=${comment.id}`}
                    alt={comment.nombreUsuario}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-sm text-gray-900">
                        {comment.nombreUsuario}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.contenido}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
