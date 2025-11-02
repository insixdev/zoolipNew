import {
  Hash,
  ArrowLeft,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Users,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { useParams, Link } from "react-router";

export default function CommunityTrendingView() {
  const { hashtag } = useParams();

  if (!hashtag) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <div className="text-center py-16">
          <Hash className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Hashtag no encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            No se especificó un hashtag válido.
          </p>
          <Link
            to="/community"
            className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Volver a la comunidad
          </Link>
        </div>
      </div>
    );
  }

  const currentHashtag = `#${hashtag}`;

  // Posts relacionados con el hashtag
  const hashtagPosts = [
    {
      id: "1",
      type: "image" as const,
      content: `🚨 URGENTE: Necesitamos hogar temporal para estos 5 cachorros rescatados. Por favor compartan 🙏 ${currentHashtag} #HogarTemporal`,
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
      author: {
        name: "Refugio Esperanza",
        username: "@refugioesperanza",
        avatar: "https://i.pravatar.cc/150?img=15",
      },
      timestamp: "Hace 3 horas",
      likes: 2847,
      comments: 156,
      shares: 423,
      isLiked: false,
      isSaved: false,
      hashtags: [currentHashtag, "#HogarTemporal", "#RescateAnimal"],
    },
    {
      id: "2",
      type: "text" as const,
      content: `Mi experiencia adoptando a Luna hace 2 años 🐕❤️ Todo lo que necesitas saber sobre el proceso de ${currentHashtag.toLowerCase()}. Hilo 🧵👇`,
      author: {
        name: "María González",
        username: "@mariag",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      timestamp: "Hace 5 horas",
      likes: 1234,
      comments: 89,
      shares: 267,
      isLiked: true,
      isSaved: false,
      hashtags: [currentHashtag, "#HistoriaDeAdopcion", "#MascotasFelices"],
    },
    {
      id: "3",
      type: "image" as const,
      content: `Antes y después de 6 meses de amor ❤️ Así llegó Toby al refugio vs. cómo está ahora en su hogar para siempre 🏠✨ ${currentHashtag} #TransformacionDeAmor`,
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
      author: {
        name: "Familia Martínez",
        username: "@familiamartinez",
        avatar: "https://i.pravatar.cc/150?img=18",
      },
      timestamp: "Hace 8 horas",
      likes: 3456,
      comments: 234,
      shares: 567,
      isLiked: true,
      isSaved: true,
      hashtags: [currentHashtag, "#TransformacionDeAmor", "#AntesYDespues"],
    },
    {
      id: "4",
      type: "text" as const,
      content: `Consejos importantes para quienes están considerando ${currentHashtag.toLowerCase()} 📝\n\n1. Evalúa tu tiempo disponible\n2. Considera los gastos veterinarios\n3. Piensa a largo plazo\n4. Visita refugios locales\n\n¿Qué otros consejos agregarían? 🤔`,
      author: {
        name: "Dra. Carmen Veterinaria",
        username: "@dracarmenvet",
        avatar: "https://i.pravatar.cc/150?img=25",
      },
      timestamp: "Hace 12 horas",
      likes: 892,
      comments: 145,
      shares: 234,
      isLiked: false,
      isSaved: false,
      hashtags: [currentHashtag, "#ConsejosVeterinarios", "#CuidadoAnimal"],
    },
    {
      id: "5",
      type: "image" as const,
      content: `¡Celebramos! 🎉 Este mes logramos 15 adopciones exitosas gracias a esta increíble comunidad. Cada ${currentHashtag.toLowerCase()} cambia una vida 💕 #GraciasComunidad`,
      image:
        "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=400&fit=crop",
      author: {
        name: "Patitas Felices",
        username: "@patitasfelices",
        avatar: "https://i.pravatar.cc/150?img=20",
      },
      timestamp: "Hace 1 día",
      likes: 1567,
      comments: 78,
      shares: 189,
      isLiked: false,
      isSaved: false,
      hashtags: [currentHashtag, "#GraciasComunidad", "#AdopcionesExitosas"],
    },
  ];

  // Hashtags relacionados (dinámicos basados en el hashtag actual)
  const getRelatedHashtags = (tag: string) => {
    const relatedMap: Record<string, any[]> = {
      AdopcionResponsable: [
        { tag: "#RescateAnimal", posts: 892 },
        { tag: "#HogarTemporal", posts: 567 },
        { tag: "#MascotasFelices", posts: 445 },
        { tag: "#CuidadoAnimal", posts: 334 },
        { tag: "#VeterinarioTips", posts: 289 },
      ],
      RescateAnimal: [
        { tag: "#AdopcionResponsable", posts: 1234 },
        { tag: "#HogarTemporal", posts: 567 },
        { tag: "#CuidadoAnimal", posts: 334 },
        { tag: "#VeterinarioTips", posts: 289 },
        { tag: "#MascotasFelices", posts: 445 },
      ],
      VeterinarioTips: [
        { tag: "#CuidadoAnimal", posts: 334 },
        { tag: "#AdopcionResponsable", posts: 1234 },
        { tag: "#MascotasFelices", posts: 445 },
        { tag: "#RescateAnimal", posts: 892 },
        { tag: "#HogarTemporal", posts: 567 },
      ],
    };

    return (
      relatedMap[tag] || [
        { tag: "#AdopcionResponsable", posts: 1234 },
        { tag: "#RescateAnimal", posts: 892 },
        { tag: "#MascotasFelices", posts: 445 },
        { tag: "#CuidadoAnimal", posts: 334 },
        { tag: "#VeterinarioTips", posts: 289 },
      ]
    );
  };

  const relatedHashtags = getRelatedHashtags(hashtag);

  // Estadísticas del hashtag (dinámicas basadas en el hashtag actual)
  const getHashtagStats = (tag: string) => {
    // Aquí podrías hacer una llamada a API real basada en el hashtag
    const statsMap: Record<string, any> = {
      AdopcionResponsable: {
        totalPosts: 1234,
        todayPosts: 23,
        weeklyGrowth: "+15%",
        activeUsers: 567,
      },
      RescateAnimal: {
        totalPosts: 892,
        todayPosts: 18,
        weeklyGrowth: "+23%",
        activeUsers: 423,
      },
      VeterinarioTips: {
        totalPosts: 567,
        todayPosts: 12,
        weeklyGrowth: "+8%",
        activeUsers: 289,
      },
      MascotasFelices: {
        totalPosts: 445,
        todayPosts: 15,
        weeklyGrowth: "+12%",
        activeUsers: 234,
      },
      CuidadoAnimal: {
        totalPosts: 334,
        todayPosts: 9,
        weeklyGrowth: "+18%",
        activeUsers: 178,
      },
    };

    return (
      statsMap[tag] || {
        totalPosts: 156,
        todayPosts: 5,
        weeklyGrowth: "+5%",
        activeUsers: 89,
      }
    );
  };

  const hashtagStats = getHashtagStats(hashtag);

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      {/* Header con navegación - Sticky */}
      <div className="sticky top-24 z-10 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/community"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <Hash className="text-rose-500" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentHashtag}
                </h1>
                <p className="text-gray-600">
                  {hashtagStats.totalPosts.toLocaleString()} publicaciones
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas del hashtag */}
          <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              <span>{hashtagStats.weeklyGrowth} esta semana</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{hashtagStats.todayPosts} publicaciones hoy</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{hashtagStats.activeUsers} usuarios activos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Feed principal */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {/* Create Post Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="Tu" />
                <AvatarFallback>TU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  placeholder={`Comparte algo sobre ${currentHashtag}...`}
                  className="w-full min-h-[80px] p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                  defaultValue={`${currentHashtag} `}
                />
                <div className="flex justify-between items-center mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    <ImageIcon size={20} />
                    <span className="text-sm">Imagen</span>
                  </button>
                  <button className="px-6 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors font-semibold">
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts del hashtag */}
          <div className="space-y-6">
            {hashtagPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.name}
                        />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
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

                  <p className="text-gray-800 whitespace-pre-wrap mb-4">
                    {post.content}
                  </p>

                  {/* Hashtags del post */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/community/hashtag/${tag.slice(1)}`}
                        className={`text-sm px-3 py-1 rounded-full transition-colors ${
                          tag === currentHashtag
                            ? "bg-rose-100 text-rose-700 font-medium"
                            : "text-rose-600 hover:bg-rose-50"
                        }`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {post.type === "image" && post.image && (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                )}

                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                        <Heart
                          size={20}
                          className={
                            post.isLiked ? "fill-red-500 text-red-500" : ""
                          }
                        />
                        <span className="font-medium">
                          {post.likes.toLocaleString()}
                        </span>
                      </button>

                      <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                        <MessageCircle size={20} />
                        <span className="font-medium">{post.comments}</span>
                      </button>

                      <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                        <Share2 size={20} />
                        <span className="font-medium">{post.shares}</span>
                      </button>
                    </div>

                    <button className="text-gray-600 hover:text-rose-600 transition-colors">
                      <Bookmark
                        size={20}
                        className={
                          post.isSaved ? "fill-rose-500 text-rose-500" : ""
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón para cargar más */}
          <div className="text-center pt-6">
            <button className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold shadow-sm">
              Cargar más publicaciones
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-2 space-y-6">
          {/* Información del hashtag */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="text-rose-500" size={20} />
              Sobre {currentHashtag}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de publicaciones</span>
                <span className="font-semibold text-rose-600">
                  {hashtagStats.totalPosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Publicaciones hoy</span>
                <span className="font-semibold text-rose-600">
                  {hashtagStats.todayPosts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Crecimiento semanal</span>
                <span className="font-semibold text-green-600">
                  {hashtagStats.weeklyGrowth}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Usuarios activos</span>
                <span className="font-semibold text-rose-600">
                  {hashtagStats.activeUsers}
                </span>
              </div>
            </div>
          </div>

          {/* Hashtags relacionados */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="text-rose-500" size={20} />
              Hashtags Relacionados
            </h3>
            <div className="space-y-3">
              {relatedHashtags.map((hashtag, index) => (
                <Link
                  key={index}
                  to={`/community/hashtag/${hashtag.tag.slice(1)}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-semibold text-rose-600">{hashtag.tag}</p>
                    <p className="text-sm text-gray-500">
                      {hashtag.posts.toLocaleString()} publicaciones
                    </p>
                  </div>
                  <Hash size={16} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Usuarios más activos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="text-rose-500" size={20} />
              Usuarios Activos
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "Refugio Esperanza",
                  username: "@refugioesperanza",
                  avatar: "https://i.pravatar.cc/150?img=15",
                  posts: 23,
                },
                {
                  name: "Dra. Carmen Veterinaria",
                  username: "@dracarmenvet",
                  avatar: "https://i.pravatar.cc/150?img=25",
                  posts: 18,
                },
                {
                  name: "Patitas Felices",
                  username: "@patitasfelices",
                  avatar: "https://i.pravatar.cc/150?img=20",
                  posts: 15,
                },
              ].map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.username}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {user.posts} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
