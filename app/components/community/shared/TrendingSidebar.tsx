import { Users } from "lucide-react";
import { Link } from "react-router";

interface TrendingTopic {
  tag: string;
  posts: string | number;
  consultas?: number;
  publicaciones?: number;
  growth?: string;
}

interface TrendingSidebarProps {
  trendingTopics: TrendingTopic[];
  onTopicClick?: (topic: TrendingTopic) => void;
}

export function TrendingSidebar({
  trendingTopics,
  onTopicClick,
}: TrendingSidebarProps) {
  const handleTopicClick = (topic: TrendingTopic) => {
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  const getHashtagUrl = (tag: string) => {
    // Remove # symbol and create URL
    const cleanTag = tag.replace("#", "");
    return `/community/hashtag/${cleanTag}`;
  };

  return (
    <div className="space-y-6">
      {/* Sidebar con tendencias */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
            <Users className="text-white" size={16} />
          </div>
          Tendencias
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <Link
              key={index}
              to={getHashtagUrl(topic.tag)}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{topic.tag}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">
                    {topic.posts}{" "}
                    {typeof topic.posts === "number" && topic.posts === 1
                      ? "post"
                      : "posts"}
                  </p>
                  {topic.consultas !== undefined &&
                    topic.publicaciones !== undefined && (
                      <div className="flex items-center gap-1.5 text-xs">
                        {topic.publicaciones > 0 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {topic.publicaciones} pub
                          </span>
                        )}
                        {topic.consultas > 0 && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {topic.consultas} cons
                          </span>
                        )}
                      </div>
                    )}
                </div>
              </div>
              {topic.growth && (
                <span className="text-sm font-medium text-green-600">
                  {topic.growth}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Sugerencias */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Sugerencias para ti
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Descubre nuevos perfiles y contenido relacionado con tus intereses
        </p>
        <button className="w-full bg-rose-500 text-white py-2 rounded-xl hover:bg-rose-600 transition-colors font-semibold">
          Explorar más
        </button>
      </div>
    </div>
  );
}
