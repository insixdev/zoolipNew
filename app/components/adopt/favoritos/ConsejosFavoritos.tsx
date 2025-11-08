export function ConsejosFavoritos() {
  return (
    <div className="mt-12 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💡 Consejos para tus favoritos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p className="font-medium mb-1">Actúa rápido con los urgentes</p>
          <p>
            Las mascotas marcadas como urgentes necesitan hogar inmediatamente.
          </p>
        </div>
        <div>
          <p className="font-medium mb-1">Contacta directamente</p>
          <p>
            Usa el chat para hacer preguntas específicas sobre cada mascota.
          </p>
        </div>
        <div>
          <p className="font-medium mb-1">Visita antes de decidir</p>
          <p>Programa una visita para conocer mejor a tu futura mascota.</p>
        </div>
        <div>
          <p className="font-medium mb-1">Comparte con amigos</p>
          <p>
            Ayuda a encontrar hogar compartiendo mascotas que no puedas adoptar.
          </p>
        </div>
      </div>
    </div>
  );
}
