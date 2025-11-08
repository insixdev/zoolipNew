import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
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
  {
    id: "2",
    type: "text" as const,
    content:
      "Pregunta para la comunidad: ¿Cuál es la mejor edad para esterilizar a un gato macho? Mi veterinario me dice 6 meses pero he leído opiniones diferentes. ¿Qué experiencias han tenido? 🐱 #ConsejosVeterinarios #GatosMacho",
    author: {
      name: "Carlos Mendoza",
      username: "@carlosm",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    timestamp: "Hace 4 horas",
    likes: 89,
    comments: 34,
    shares: 12,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "3",
    type: "image" as const,
    content:
      "¡URGENTE! 🚨 Encontramos esta perrita en la calle, está muy asustada pero parece estar bien de salud. Si alguien la reconoce o puede ayudar con hogar temporal, por favor contacten. Zona Norte de la ciudad. #PerrosPerdidos #AyudaUrgente",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop",
    author: {
      name: "Refugio Esperanza",
      username: "@refugioesperanza",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    timestamp: "Hace 6 horas",
    likes: 267,
    comments: 45,
    shares: 89,
    isLiked: false,
    isSaved: true,
  },
  {
    id: "4",
    type: "image" as const,
    content:
      "Sesión de fotos con mis 3 gatos 📸 Intenté que posaran juntos por 20 minutos... este fue el mejor resultado 😅 Al menos Mimi cooperó un poco #GatosModelos #VidaDeGatero",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop",
    author: {
      name: "Ana Silva",
      username: "@anasilva",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    timestamp: "Hace 8 horas",
    likes: 156,
    comments: 28,
    shares: 15,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "5",
    type: "text" as const,
    content:
      "HILO 🧵 Consejos para viajar con tu perro en avión:\n\n1️⃣ Consulta con tu veterinario al menos 1 mes antes\n2️⃣ Revisa las políticas de la aerolínea\n3️⃣ Acostumbra a tu perro al transportín\n4️⃣ Lleva documentación completa\n5️⃣ No alimentes 4 horas antes del vuelo\n\n¿Alguien más tiene tips? #ViajarConMascotas #ConsejosDeViaje",
    author: {
      name: "Dr. Roberto Vega",
      username: "@drrobertovega",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    timestamp: "Hace 10 horas",
    likes: 234,
    comments: 67,
    shares: 45,
    isLiked: false,
    isSaved: true,
  },
  {
    id: "6",
    type: "image" as const,
    content:
      "¡Max aprendió a dar la pata! 🐾 Después de 3 semanas de entrenamiento constante, finalmente lo logró. La paciencia y las recompensas funcionan 💪 #EntrenamientoCanino #LogrosPerrrunos",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop",
    author: {
      name: "Laura Martínez",
      username: "@lauramtz",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    timestamp: "Hace 12 horas",
    likes: 98,
    comments: 19,
    shares: 7,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "7",
    type: "text" as const,
    content:
      "Recordatorio importante: Con las altas temperaturas, NO dejen a sus mascotas en el auto ni por 'un minutito'. En 10 minutos la temperatura puede subir 7°C. Sus patitas también se queman en el asfalto caliente 🔥 #CuidadoEnVerano #MascotasSeguras",
    author: {
      name: "Clínica Veterinaria San Martín",
      username: "@clinicasanmartin",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    timestamp: "Hace 14 horas",
    likes: 445,
    comments: 23,
    shares: 178,
    isLiked: true,
    isSaved: true,
  },
  {
    id: "8",
    type: "image" as const,
    content:
      "Día de spa para Coco 🛁✨ Después del baño siempre queda así de esponjoso. Aunque el proceso no le gusta nada, el resultado vale la pena 😂 #BañoPerruno #MascotasLimpias",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop",
    author: {
      name: "Patricia López",
      username: "@patrilopez",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    timestamp: "Hace 16 horas",
    likes: 123,
    comments: 31,
    shares: 9,
    isLiked: false,
    isSaved: false,
  },
];

export default function CommunityIndex() {
  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
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
                  placeholder="¿Qué está pasando con tus mascotas?"
                  className="w-full min-h-[80px] p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none text-gray-900 placeholder-gray-500"
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

          {/* Feed Tabs */}
          <FeedTabs>
            {(activeTab) => (
              <>
                {activeTab === "forYou" ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-5 pb-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                />
                                <AvatarFallback>
                                  {post.author.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {post.author.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {post.author.username} · {post.timestamp}
                                </p>
                              </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                              <MoreHorizontal
                                size={18}
                                className="text-gray-600"
                              />
                            </button>
                          </div>

                          <p className="text-gray-800 text-sm whitespace-pre-wrap mb-3 line-clamp-4">
                            {post.content}
                          </p>
                        </div>

                        {post.type === "image" && post.image && (
                          <div className="rounded-xl overflow-hidden">
                            <img
                              src={post.image}
                              alt="Post"
                              className="w-full h-64 object-cover"
                            />
                          </div>
                        )}

                        <div className="p-5 pt-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                                <Heart
                                  size={18}
                                  className={
                                    post.isLiked
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }
                                />
                                <span className="font-medium text-sm">
                                  {post.likes}
                                </span>
                              </button>

                              <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                                <MessageCircle size={18} />
                                <span className="font-medium text-sm">
                                  {post.comments}
                                </span>
                              </button>

                              <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                                <Share2 size={18} />
                                <span className="font-medium text-sm">
                                  {post.shares}
                                </span>
                              </button>
                            </div>

                            <button className="text-gray-600 hover:text-rose-600 transition-colors">
                              <Bookmark
                                size={18}
                                className={
                                  post.isSaved
                                    ? "fill-rose-500 text-rose-500"
                                    : ""
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyFollowingState />
                )}
              </>
            )}
          </FeedTabs>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-2 space-y-6">
          <TrendingSection />
        </div>
      </div>
    </div>
  );
}
