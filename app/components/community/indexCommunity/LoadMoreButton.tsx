import { Loader2 } from "lucide-react";

type LoadMoreButtonProps = {
  onClick: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  isAuthenticated?: boolean;
};

export default function LoadMoreButton({
  onClick,
  isLoading = false,
  hasMore = true,
  isAuthenticated = true,
}: LoadMoreButtonProps) {
  // No mostrar nada si el usuario no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          No hay más publicaciones para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="px-8 py-3 bg-white border-2 border-rose-500 text-rose-600 rounded-xl hover:bg-rose-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Cargando...</span>
          </>
        ) : (
          <span>Cargar más publicaciones</span>
        )}
      </button>
    </div>
  );
}
