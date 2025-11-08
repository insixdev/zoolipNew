import { Search } from "lucide-react";

export function EmptyRefugiosState() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No se encontraron refugios
      </h3>
      <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
    </div>
  );
}
