export function ProcesoAdopcion() {
  return (
    <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📋 Proceso de Adopción
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
            1
          </div>
          <p className="font-medium">Solicitud</p>
          <p className="text-gray-600">Envías tu solicitud</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
            2
          </div>
          <p className="font-medium">Revisión</p>
          <p className="text-gray-600">El refugio revisa</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
            3
          </div>
          <p className="font-medium">Entrevista</p>
          <p className="text-gray-600">Entrevista y visita</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
            4
          </div>
          <p className="font-medium">Adopción</p>
          <p className="text-gray-600">¡Tu nueva mascota!</p>
        </div>
      </div>
    </div>
  );
}
