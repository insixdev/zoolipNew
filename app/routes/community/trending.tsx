import { TrendingUp, Hash, Heart, MessageCircle, Share2, Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export default function CommunityTrending() {
  const trendingHashtags = [
    { tag: '#AdopcionResponsable', posts: 1234, growth: '+15%' },
    { tag: '#RescateAnimal', posts: 892, growth: '+23%' },
    { tag: '#VeterinarioTips', posts: 567, growth: '+8%' },
    { tag: '#MascotasFelices', posts: 445, growth: '+12%' },
    { tag: '#CuidadoAnimal', posts: 334, growth: '+18%' },
  ];

  const trendingPosts = [
    {
      id: '1',
      type: 'image' as const,
      content: '🚨 URGENTE: Necesitamos hogar temporal para estos 5 cachorros rescatados. Por favor compartan 🙏 #RescateAnimal #HogarTemporal',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
      author: {
        name: 'Refugio Esperanza',
        username: '@refugioesperanza',
        avatar: 'https://i.pravatar.cc/150?img=15'
      },
      timestamp: 'Hace 3 horas',
      likes: 2847,
      comments: 156,
      shares: 423,
      views: 12500,
      trending: true
    },
    {
      id: '2',
      type: 'text' as const,
      content: 'HILO 🧵: Todo lo que necesitas saber antes de adoptar tu primera mascota. Consejos de una veterinaria con 15 años de experiencia 👩‍⚕️🐾',
      author: {
        name: 'Dra. Carmen Veterinaria',
        username: '@dracarmenvet',
        avatar: 'https://i.pravatar.cc/150?img=25'
      },
      timestamp: 'Hace 6 horas',
      likes: 1923,
      comments: 89,
      shares: 267,
      views: 8900,
      trending: true
    },
    {
      id: '3',
      type: 'image' as const,
      content: 'Antes y después de 6 meses de amor ❤️ Así llegó Toby al refugio vs. cómo está ahora en su hogar para siempre 🏠✨ #TransformacionDeAmor',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop',
      author: {
        name: 'Familia Martínez',
        username: '@familiamartinez',
        avatar: 'https://i.pravatar.cc/150?img=18'
      },
      timestamp: 'Hace 8 horas',
      likes: 3456,
      comments: 234,
      shares: 567,
      views: 15600,
      trending: true
    }
  ];

  const trendingTopics = [
    {
      title: 'Campaña de Esterilización Gratuita',
      description: 'Iniciativa municipal para controlar la población callejera',
      posts: 89,
      participants: 234
    },
    {
      title: 'Feria de Adopción Virtual',
      description: 'Evento online este fin de semana con 15 refugios',
      posts: 156,
      participants: 567
    },
    {
      title: 'Curso de Primeros Auxilios para Mascotas',
      description: 'Capacitación gratuita para cuidadores responsables',
      posts: 67,
      participants: 189
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <TrendingUp className="text-rose-500" size={32} />
          Tendencias de la Comunidad
        </h1>
        <p className="text-lg text-gray-600">Descubre el contenido más popular y los temas que están generando conversación</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Posts en tendencia */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-rose-500" size={24} />
              Publicaciones en Tendencia
            </h2>
            
            <div className="space-y-6">
              {trendingPosts.map((post, index) => (
                <Card key={post.id} className="bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-200 transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{post.author.name}</p>
                          <p className="text-sm text-gray-500">{post.author.username} · {post.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-rose-100 px-3 py-1 rounded-full">
                        <TrendingUp size={16} className="text-rose-600" />
                        <span className="text-sm font-medium text-rose-700">Trending</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
                    
                    {post.type === 'image' && post.image && (
                      <div className="-mx-6 mb-4">
                        <img 
                          src={post.image} 
                          alt="Post trending" 
                          className="w-full max-h-[400px] object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Estadísticas del post */}
                    <div className="flex items-center justify-between pt-4 border-t border-rose-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Heart size={18} className="text-red-500" />
                          <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MessageCircle size={18} />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Share2 size={18} />
                          <span className="text-sm font-medium">{post.shares}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Eye size={18} />
                          <span className="text-sm font-medium">{post.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Hashtags en tendencia */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Hash className="text-rose-500" size={20} />
                Hashtags Populares
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingHashtags.map((hashtag, index) => (
                <div key={hashtag.tag} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-4">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-rose-600">{hashtag.tag}</p>
                      <p className="text-sm text-gray-500">{hashtag.posts.toLocaleString()} publicaciones</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">{hashtag.growth}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Temas de conversación */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="text-rose-500" size={20} />
                Temas de Conversación
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg hover:border-rose-200 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-gray-900 mb-2">{topic.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{topic.posts} publicaciones</span>
                    <span>•</span>
                    <span>{topic.participants} participantes</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <Card className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="text-rose-500" size={20} />
                Actividad Reciente
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Publicaciones hoy</span>
                <span className="font-semibold text-rose-600">+234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nuevos miembros</span>
                <span className="font-semibold text-rose-600">+67</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Adopciones exitosas</span>
                <span className="font-semibold text-rose-600">+12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consultas respondidas</span>
                <span className="font-semibold text-rose-600">+89</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}