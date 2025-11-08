import { Search, Filter } from "lucide-react";

interface BarraBusquedaProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
}

export function BarraBusqueda({
  onSearch,
  onFilterClick,
  placeholder = "Buscar usuarios, publicaciones, hashtags...",
}: BarraBusquedaProps) {
  return (
    <div className="sticky top-24 z-10 mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={placeholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
          <button
            onClick={onFilterClick}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
