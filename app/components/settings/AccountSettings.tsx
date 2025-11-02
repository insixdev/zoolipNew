import { Trash2 } from "lucide-react";

export default function AccountSettings() {
  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
            Cambiar Contraseña
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña actual
              </label>
              <input
                type="password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <input
                type="password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-rose-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
              Actualizar contraseña
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Eliminar Cuenta
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Una vez que elimines tu cuenta, toda tu información será
            permanentemente borrada. Esta acción no se puede deshacer.
          </p>

          <button className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
