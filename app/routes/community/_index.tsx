import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import TrendingSection from "~/components/community/TrendingSection";
import FeedTabs, { EmptyFollowingState } from "~/components/community/FeedTabs";

// Static data - Social media style posts
const posts = [
  {
    id: "1",
    type: "image" as const,
    content:
      "¡Conoce a Luna! 🐕 Adoptada hace 2 semanas y ya es parte de la familia. Gracias a todos por sus consejos sobre cómo ayudarla a adaptarse. #AdopcionResponsable #NuevoMiembro",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
    author: {
      name: "María González",
      username: "@mariag",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    timestamp: "Hace 2 horas",
    likes: 142,
    comments: 23,
    shares: 8,
    isLiked: false,
    isSaved: false,
  },
  // ... más posts
];

export default function CommunityIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Feed (center) */}
      <div className="md:col-start-4 md:col-span-5 w-full space-y-4">
        <FeedTabs>
          {(activeTab) => (
            <>
              {activeTab === "forYou" ? (
                posts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 hover:border-orange-200 transition-all duration-200 hover:shadow-sm"
                  >
                    {/* Post content similar to _index.tsx */}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-11 h-11">
                            <AvatarImage
                              src={post.author.avatar}
                              alt={post.author.name}
                            />
                            <AvatarFallback>
                              {post.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {post.author.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {post.author.username} · {post.timestamp}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreHorizontal size={20} className="text-gray-600" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-gray-800 whitespace-pre-wrap mb-3">
                        {post.content}
                      </p>
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
                  </Card>
                ))
              ) : (
                <EmptyFollowingState />
              )}
            </>
          )}
        </FeedTabs>
      </div>

      {/* Trending Section */}
      <aside className="hidden md:block md:col-start-10 md:col-span-3">
        <TrendingSection />
      </aside>
    </div>
  );
}
