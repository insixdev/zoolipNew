import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export type Post = {
  id: string;
  topico: string;
  type: "image" | "text";
  content: string;
  image?: string;
  author: {
    username: string;
    avatar: string;
  };
  fecha_duda_resuelta: string;
  fecha_creacion: string;
  fecha_edicion: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
};

type PostCardProps = {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
};

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostCardProps) {
  return (
    <Card className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 hover:border-orange-200 transition-all duration-200 hover:shadow-sm">
      {/* Post Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11">
              <AvatarImage
                src={post.author.avatar}
                alt={post.author.username /*name*/}
              />
              <AvatarFallback>
                {post.author.username /*name[0]*/}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {post.author.username /*name*/}
              </p>
              <p className="text-sm text-gray-500">
                {post.author.username} · {post.fecha_creacion}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="pb-3">
        {post.topico && (
          <div className="mb-3">
            <Link
              to={`/community/hashtag/${post.topico.replace("#", "")}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {post.topico}
            </Link>
          </div>
        )}

        <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>

        {/* Post Image */}
        {post.type === "image" && post.image && (
          <div className="-mx-6 mb-3">
            <img
              src={post.image}
              alt="Post"
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}
      </CardContent>

      {/* Post Actions */}
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            {/* Like Button */}
            <button
              onClick={() => onLike?.(post.id)}
              className="flex items-center gap-2 group"
            >
              <Heart
                size={22}
                className={`transition-colors ${
                  post.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 group-hover:text-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  post.isLiked ? "text-red-500" : "text-gray-600"
                }`}
              >
                {post.likes}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onComment?.(post.id)}
              className="flex items-center gap-2 group"
            >
              <MessageCircle
                size={22}
                className="text-gray-600 group-hover:text-blue-500 transition-colors"
              />
              <span className="text-sm font-medium text-gray-600">
                {post.comments}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => onShare?.(post.id)}
              className="flex items-center gap-2 group"
            >
              <Share2
                size={22}
                className="text-gray-600 group-hover:text-green-500 transition-colors"
              />
              <span className="text-sm font-medium text-gray-600">
                {post.shares}
              </span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button onClick={() => onSave?.(post.id)} className="group">
            <Bookmark
              size={22}
              className={`transition-colors ${
                post.isSaved
                  ? "fill-orange-500 text-orange-500"
                  : "text-gray-600 group-hover:text-orange-500"
              }`}
            />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
