import { Search, Users, Hash, MapPin } from 'lucide-react';

export default function CommunitySearch() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Buscar en la Comunidad</h1>
        <p className="text-lg text-gray-600">Encuentra personas, publicaciones y temas de tu interés</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar usuarios, publicaciones, hashtags..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-lg"
          />
        </div>
      </div>

      {/* Search Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Usuarios</h3>
          </div>
          <p className="text-gray-600">Encuentra y conecta con otros amantes de los animales</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Hash className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Hashtags</h3>
          </div>
          <p className="text-gray-600">Explora temas populares y tendencias</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <MapPin className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Ubicaciones</h3>
          </div>
          <p className="text-gray-600">Encuentra comunidades cerca de ti</p>
        </div>
      </div>
    </div>
  );
}
