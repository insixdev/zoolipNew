import { Heart, MapPin, Calendar, Share2, MessageCircle, Trash2, Filter } from 'lucide-react';
import { Link } from 'react-router';

export default function AdoptFavoritos() {
  const favoritePets = [
    {
      id: 'luna',
      name: 'Luna',
      age: '1 año',
      breed: 'Golden Retriever',
      gender: 'Hembra',
      location: 'Guadalajara, Jalisco',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Muy tranquila y perfecta para familias con niños',
      refugio: 'Refugio Esperanza',
      dateAdded: '2024-01-20',
      status: 'available',
      urgency: 'normal'
    },
    {
      id: 'max',
      name: 'Max',
      age: '2 años',
      breed: 'Labrador Mix',
      gender: 'Macho',
      location: 'Ciudad de México',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Perro muy cariñoso y juguetón, ideal para familias activas',
      refugio: 'Patitas Felices',
      dateAdded: '2024-01-18',
      status: 'available',
      urgency: 'high'
    },
    {
      id: 'mia',
      name: 'Mía',
      age: '2 años',
      breed: 'Husky Siberiano',
      gender: 'Hembra',
      location: 'Querétaro',
      image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Activa y aventurera, necesita mucho ejercicio',
      refugio: 'Amor Animal',
      dateAdded: '2024-01-15',
      status: 'adopted',
      urgency: 'normal'
    },
    {
      id: 'rocky',
      name: 'Rocky',
      age: '3 años',
      breed: 'Pastor Alemán',
      gender: 'Macho',
      location: 'Monterrey, Nuevo León',
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Guardián leal y protector, excelente con niños',
      refugio: 'Rescate Norte',
      dateAdded: '2024-01-12',
      status: 'pending',
      urgency: 'normal'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Disponible</span>;
      case 'adopted':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Adoptado</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">En proceso</span>;
      default:
        return null;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === 'high') {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Urgente</span>;
    }
    return null;
  };

  return (
    <div className="ml-64 px-8 py-4 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
<h1 className="text-2xl from-orange-400    ">Favoritos</h1>
          
        </div>

        {/* Filtros y estadísticas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{favoritePets.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {favoritePets.filter(pet => pet.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {favoritePets.filter(pet => pet.urgency === 'high').length}
              </div>
              <div className="text-sm text-gray-600">Urgentes</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              Filtrar
            </button>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
              <option>Ordenar por fecha</option>
              <option>Ordenar por nombre</option>
              <option>Ordenar por ubicación</option>
              <option>Mostrar urgentes primero</option>
            </select>
          </div>
        </div>
      </div>

        {/* Grid de mascotas favoritas */}
        {favoritePets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={pet.image} 
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {getStatusBadge(pet.status)}
                  {getUrgencyBadge(pet.urgency)}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </button>
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Trash2 size={18} className="text-gray-600 hover:text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    pet.gender === 'Macho' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-pink-100 text-pink-800'
                  }`}>
                    {pet.gender}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Edad:</span> {pet.age}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Raza:</span> {pet.breed}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <MapPin size={14} />
                    {pet.location}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Refugio:</span> {pet.refugio}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">{pet.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Guardado: {new Date(pet.dateAdded).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/adopt/${pet.id}`} 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors text-sm"
                  >
                    Ver detalles
                  </Link>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle size={16} />
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        ) : (
          // Estado vacío
          <div className="text-center py-16">
          <Heart className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes mascotas favoritas aún</h3>
          <p className="text-gray-600 mb-6">
            Cuando encuentres mascotas que te interesen, puedes guardarlas aquí para verlas más tarde.
          </p>
          <Link 
            to="/adopt" 
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Explorar mascotas
          </Link>
          </div>
        )}

        {/* Consejos */}
        {favoritePets.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Consejos para tus favoritos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-1">Actúa rápido con los urgentes</p>
              <p>Las mascotas marcadas como urgentes necesitan hogar inmediatamente.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Contacta directamente</p>
              <p>Usa el chat para hacer preguntas específicas sobre cada mascota.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Visita antes de decidir</p>
              <p>Programa una visita para conocer mejor a tu futura mascota.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Comparte con amigos</p>
              <p>Ayuda a encontrar hogar compartiendo mascotas que no puedas adoptar.</p>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}