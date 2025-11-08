import { Filter } from "lucide-react";

interface Pet {
  status: string;
  urgency: string;
}

interface EstadisticasFavoritosProps {
  pets: Pet[];
}

export function EstadisticasFavoritos({ pets }: EstadisticasFavoritosProps) {
  const disponibles = pets.filter((pet) => pet.status === "available").length;
  const urgentes = pets.filter((pet) => pet.urgency === "high").length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {pets.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {disponibles}
            </div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{urgentes}</div>
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
  );
}
