import { Save, Camera } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
          Información del Perfil
        </h3>

        {/* Avatar */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-rose-700 font-bold text-2xl">
              TU
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Foto de perfil
            </h4>
            <p className="text-sm text-gray-500">JPG, GIF o PNG. Máximo 1MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              defaultValue="Tu Usuario"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              defaultValue=""
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              defaultValue="usuario@ejemplo.com"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              defaultValue=""
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Biografía
          </label>
          <textarea
            rows={3}
            defaultValue="Amante de los animales y defensor de la adopción responsable."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-rose-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
