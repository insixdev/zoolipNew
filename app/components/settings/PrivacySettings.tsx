import { useState } from "react";

export default function PrivacySettings() {
  const [showOnlineActivity, setShowOnlineActivity] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
          Configuración de Privacidad
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Visibilidad del perfil
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profile-visibility"
                  defaultChecked
                  className="focus:ring-rose-500 h-4 w-4 text-rose-600 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Público - Visible para todos
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profile-visibility"
                  className="focus:ring-rose-500 h-4 w-4 text-rose-600 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Privado - Solo para contactos
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Quién puede contactarte?
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md text-gray-900">
              <option>Cualquier usuario</option>
              <option>Solo usuarios verificados</option>
              <option>Solo refugios y organizaciones</option>
              <option>Nadie</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Mostrar actividad en línea
              </p>
              <p className="text-sm text-gray-500">
                Otros usuarios pueden ver cuándo estás activo
              </p>
            </div>
            <button
              onClick={() => setShowOnlineActivity(!showOnlineActivity)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                showOnlineActivity ? "bg-rose-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                  showOnlineActivity ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
