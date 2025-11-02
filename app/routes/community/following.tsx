import { Users, UserPlus, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';

export default function CommunityFollowing() {
  const followingPosts = [
    {
      id: '1',
      type: 'image' as const,
      content: 'Actualización sobre Milo 🐕 Ya lleva 3 semanas en su nuevo hogar y está completamente adaptado. Gracias a todos los que me ayudaron con consejos durante la transición ❤️',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop',
      author: {
        name: 'Ana García',
        username: '@anagarcia',
        avatar: 'https://i.pravatar.cc/150?img=5',
        isFollowing: true
      },
      timestamp: 'Hace 2 horas',
      likes: 45,
      comments: 12,
      shares: 3,
      isLiked: true,
      isSaved: false
    },
    {
      id: '2',
      type: 'text' as const,
      content: 'Recordatorio importante: mañana es el último día para inscribirse en el curso gratuito de primeros auxilios para mascotas 🚨 Solo quedan 5 cupos disponibles. Link en mi bio 👆',
      author: {
        name: 'Dr. Carlos Veterinario',
        username: '@drcarlosvet',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isFollowing: true
      },
      timestamp: 'Hace 4 horas',
      likes: 89,
      comments: 23,
      shares: 15,
      isLiked: false,
      isSaved: true
    },
    {
      id: '3',
      type: 'image' as const,
      content: '¡Grandes noticias! 🎉 Todos los gatitos de la camada de rescate ya tienen familia. Gracias a esta increíble comunidad por compartir y ayudar a encontrarles hogar 🏠🐱',
      image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=600&fit=crop',
      author: {
        name: 'Refugio Esperanza',
        username: '@refugioesperanza',
        avatar: 'https://i.pravatar.cc/150?img=15',
        isFollowing: true
      },
      timestamp: 'Hace 6 horas',
      likes: 234,
      comments: 45,
      shares: 67,
      isLiked: true,
      isSaved: false
    },
    {
      id: '4',
      type: 'text' as const,
      content: 'Pregunta para la comunidad: ¿Alguien tiene experiencia con perros de raza Husky en clima cálido? Me mudé a una ciudad más calurosa y quiero asegurarme de que mi Luna esté cómoda 🌡️❄️',
      author: {
        name: 'María González',
        username: '@mariag',
        avatar: 'https://i.pravatar.cc/150?img=1',
        isFollowing: true
      },
      timestamp: 'Hace 8 horas',
      likes: 67,
      comments: 34,
      shares: 8,
      isLiked: false,
      isSaved: false
    }
  ];

  const suggestedUsers = [
    {
      name: 'Patitas Felices',
      username: '@patitasfelices',
      avatar: 'https://i.pravatar.cc/150?img=20',
      bio: 'Refugio de animales • 500+ adopciones exitosas',
      followers: '2.3k',
      mutualFollows: 12
    },
    {
      name: 'Dra. Laura Veterinaria',
      username: '@dralauravet',
      avatar: 'https://i.pravatar.cc/150?img=25',
      bio: 'Veterinaria especialista en comportamiento animal',
      followers: '1.8k',
      mutualFollows: 8
    },
    {
      name: 'Amor Animal MX',
      username: '@amoranimalmx',
      avatar: 'https://i.pravatar.cc/150?img=30',
      bio: 'ONG dedicada al rescate y rehabilitación',
      followers: '3.1k',
      mutualFollows: 15
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Users className="text-rose-500" size={32} />
          Siguiendo
        </h1>
        <p className="text-lg text-gray-600">Mantente al día con las publicaciones de las personas que sigues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Card */}
          <Card className="bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 shadow-sm transition-all duration-200 hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="Tu" />
                  <AvatarFallback>TU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Comparte algo con las personas que te siguen..."
                    className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <ImageIcon size={20} />
                      <span className="text-sm">Imagen</span>
                    </button>
                    <button className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium">
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts del feed */}
          {followingPosts.length > 0 ? (
            <div className="space-y-6">
              {followingPosts.map((post) => (
                <Card key={post.id} className="bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-200 hover:shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-11 h-11">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          {post.author.isFollowing && (
                            <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                              <Users size={12} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{post.author.name}</p>
                          <p className="text-sm text-gray-500">{post.author.username} · {post.timestamp}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
                    
                    {post.type === 'image' && post.image && (
                      <div className="-mx-6 mb-3">
                        <img 
                          src={post.image} 
                          alt="Post" 
                          className="w-full max-h-[500px] object-cover"
                        />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-3 border-t">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 group">
                          <Heart 
                            size={22} 
                            className={`transition-colors ${
                              post.isLiked 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-600 group-hover:text-red-500'
                            }`}
                          />
                          <span className={`text-sm font-medium ${
                            post.isLiked ? 'text-red-500' : 'text-gray-600'
                          }`}>
                            {post.likes}
                          </span>
                        </button>

                        <button className="flex items-center gap-2 group">
                          <MessageCircle 
                            size={22} 
                            className="text-gray-600 group-hover:text-blue-500 transition-colors"
                          />
                          <span className="text-sm font-medium text-gray-600">
                            {post.comments}
                          </span>
                        </button>

                        <button className="flex items-center gap-2 group">
                          <Share2 
                            size={22} 
                            className="text-gray-600 group-hover:text-green-500 transition-colors"
                          />
                          <span className="text-sm font-medium text-gray-600">
                            {post.shares}
                          </span>
                        </button>
                      </div>

                      <button className="group">
                        <Bookmark 
                          size={22} 
                          className={`transition-colors ${
                            post.isSaved 
                              ? 'fill-rose-500 text-rose-500' 
                              : 'text-gray-600 group-hover:text-rose-500'
                          }`}
                        />
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // Estado vacío
            <Card className="bg-white border border-gray-200 text-center py-16">
              <CardContent>
                <Users className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay publicaciones aún</h3>
                <p className="text-gray-600 mb-6">
                  Cuando las personas que sigues publiquen algo, aparecerá aquí.
                </p>
                <button className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                  Descubrir personas para seguir
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sugerencias para seguir */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <UserPlus className="text-rose-500" size={20} />
                Sugerencias para ti
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestedUsers.map((user, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                    <p className="text-sm text-gray-500 truncate">{user.username}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{user.followers} seguidores</span>
                      <span>•</span>
                      <span>{user.mutualFollows} en común</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-colors">
                    Seguir
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Estadísticas de seguimiento */}
          <Card className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">Tu Red</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Siguiendo</span>
                <span className="font-semibold text-rose-600">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Seguidores</span>
                <span className="font-semibold text-rose-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Publicaciones vistas hoy</span>
                <span className="font-semibold text-rose-600">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interacciones</span>
                <span className="font-semibold text-rose-600">45</span>
              </div>
            </CardContent>
          </Card>

          {/* Actividad reciente */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">@drcarlosvet</span> publicó hace 2 horas
                </p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">@refugioesperanza</span> compartió una foto
                </p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">@mariag</span> hizo una pregunta
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
