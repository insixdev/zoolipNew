import { Heart, MessageCircle, Bookmark } from "lucide-react";

interface UserResult {
  type: "user";
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: string;
  isFollowing: boolean;
  bio: string;
}

interface PostResult {
  type: "post";
  id: string;
  author: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

type SearchResult = UserResult | PostResult;

interface ResultadoBusquedaProps {
  result: SearchResult;
  onFollowToggle?: (userId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export function ResultadoBusqueda({
  result,
  onFollowToggle,
  onLike,
  onComment,
  onBookmark,
}: ResultadoBusquedaProps) {
  if (result.type === "user") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={result.avatar}
              alt={result.name}
              className="w-16 h-16 rounded-full ring-4 ring-gray-100"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{result.name}</h3>
              <p className="text-gray-600">{result.username}</p>
              <p className="text-sm text-gray-500 mt-1">
                {result.followers} 
              </p>
            </div>
            <button
              onClick={() => onFollowToggle?.(result.id)}
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
      </div>
    );
  }

  // Post result
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={result.avatar}
            alt={result.author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{result.author}</h4>
            <p className="text-sm text-gray-500">
              {result.username} • {result.timestamp}
            </p>
          </div>
        </div>
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
            className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
          >
            <Heart size={20} />
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
            className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors ml-auto"
          >
            <Bookmark size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
