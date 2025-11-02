import {
  Search,
  Filter,
  Users,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";

export default function CommunityBuscar() {
  const searchResults = [
    {
      id: "1",
      type: "user",
      name: "María González",
      username: "@maria_pets",
      avatar: "https://i.pravatar.cc/150?img=1",
      followers: "2.5k",
      isFollowing: false,
      bio: "Amante de los Golden Retrievers 🐕",
    },
    {
      id: "2",
      type: "post",
      author: "Carlos Veterinario",
      username: "@dr_carlos",
      avatar: "https://i.pravatar.cc/150?img=12",
      content: "Consejos importantes para la vacunación de cachorros",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      likes: 124,
      comments: 23,
      timestamp: "2h",
    },
    {
      id: "3",
      type: "user",
      name: "Refugio Esperanza",
      username: "@refugio_esperanza",
      avatar: "https://i.pravatar.cc/150?img=20",
      followers: "15.2k",
      isFollowing: true,
      bio: "Refugio de animales • Adopciones responsables",
    },
    {
      id: "4",
      type: "post",
      author: "Ana Silva",
      username: "@ana_cats",
      avatar: "https://i.pravatar.cc/150?img=5",
      content: "Mi gato Luna aprendió un nuevo truco! 🐱",
      image:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      likes: 89,
      comments: 12,
      timestamp: "4h",
    },
  ];

  const trendingTopics = [
    { tag: "#AdopcionResponsable", posts: "2.1k" },
    { tag: "#CuidadoVeterinario", posts: "1.8k" },
    { tag: "#EntrenamientoCanino", posts: "1.5k" },
    { tag: "#GatosRescatados", posts: "1.2k" },
    { tag: "#ConsejosVet", posts: "980" },
  ];

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      {/* Barra de búsqueda */}
      <div className="sticky top-24 z-10 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar usuarios, publicaciones, hashtags..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Resultados principales */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {result.type === "user" ? (
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={result.avatar}
                      alt={result.name}
                      className="w-16 h-16 rounded-full ring-4 ring-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {result.name}
                      </h3>
                      <p className="text-gray-600">{result.username}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {result.followers} seguidores
                      </p>
                    </div>
                    <button
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
              ) : (
                <div>
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={result.avatar}
                        alt={result.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {result.author}
                        </h4>
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
                      <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                        <Heart size={20} />
                        <span className="font-medium">{result.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                        <MessageCircle size={20} />
                        <span className="font-medium">{result.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors ml-auto">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar con tendencias */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <Users className="text-white" size={16} />
              </div>
              Tendencias
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{topic.tag}</p>
                    <p className="text-sm text-gray-500">
                      {topic.posts} publicaciones
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
      </div>
    </div>
  );
}
