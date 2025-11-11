import React from "react";
import { Search, Filter } from "lucide-react";
import { FaBuilding, FaHeartbeat } from "react-icons/fa";

type FiltersSectionProps = {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTipo: "todos" | "refugio" | "veterinaria";
  onTipoChange: (tipo: "todos" | "refugio" | "veterinaria") => void;
  resultsCount: number;
};

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  searchTerm,
  onSearchChange,
  selectedTipo,
  onTipoChange,
  resultsCount,
}) => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="space-y-4 animate-fadeInUp">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Busca por nombre, ubicación o especialidad..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 shadow-sm"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => onTipoChange("todos")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedTipo === "todos"
                ? "bg-rose-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border border-gray-300 hover:border-rose-300"
            }`}
          >
            <Filter className="w-4 h-4" />
            Todos
          </button>
          <button
            onClick={() => onTipoChange("refugio")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedTipo === "refugio"
                ? "bg-rose-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border border-gray-300 hover:border-rose-300"
            }`}
          >
            <FaBuilding className="w-4 h-4" />
            Refugios
          </button>
          <button
            onClick={() => onTipoChange("veterinaria")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedTipo === "veterinaria"
                ? "bg-rose-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border border-gray-300 hover:border-rose-300"
            }`}
          >
            <FaHeartbeat className="w-4 h-4" />
            Veterinarias
          </button>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600 font-medium">
          Se encontraron{" "}
          <strong className="text-rose-600">{resultsCount}</strong> institución
          {resultsCount !== 1 ? "es" : ""}
        </p>
      </div>
    </section>
  );
};
