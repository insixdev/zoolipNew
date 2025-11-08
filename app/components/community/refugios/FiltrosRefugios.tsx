import { Search } from "lucide-react";

interface FiltrosRefugiosProps {
  searchTerm: string;
  selectedLocation: string;
  selectedSpecialty: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
}

export function FiltrosRefugios({
  searchTerm,
  selectedLocation,
  selectedSpecialty,
  onSearchChange,
  onLocationChange,
  onSpecialtyChange,
}: FiltrosRefugiosProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar refugios..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-gray-900"
          />
        </div>

        {/* Ubicación */}
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-gray-900"
        >
          <option value="all">Todas las ubicaciones</option>
          <option value="Ciudad de México">Ciudad de México</option>
          <option value="Guadalajara">Guadalajara</option>
          <option value="Monterrey">Monterrey</option>
          <option value="Puebla">Puebla</option>
          <option value="Tijuana">Tijuana</option>
        </select>

        {/* Especialidad */}
        <select
          value={selectedSpecialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-gray-900"
        >
          <option value="all">Todas las especialidades</option>
          <option value="perros">Perros</option>
          <option value="gatos">Gatos</option>
          <option value="cachorros">Cachorros</option>
          <option value="rehabilitación">Rehabilitación</option>
          <option value="necesidades especiales">Necesidades especiales</option>
        </select>
      </div>
    </div>
  );
}
