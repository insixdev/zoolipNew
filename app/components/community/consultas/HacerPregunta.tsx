import { MessageCircle } from "lucide-react";
import { useFetcher } from "react-router";
import { useState, useEffect } from "react";

export function HacerPregunta() {
  const fetcher = useFetcher();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");

  const isSubmitting = fetcher.state === "submitting";

  // Limpiar el formulario después de enviar exitosamente
  useEffect(() => {
    if (fetcher.data?.status === "success") {
      setTitulo("");
      setContenido("");
      setCategoria("");
    }
  }, [fetcher.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !contenido.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append("topico", categoria || "General");
    formData.append("contenido", `${titulo}\n\n${contenido}`);
    formData.append("tipo", "CONSULTA");

    fetcher.submit(formData, {
      method: "post",
      action: "/api/post/crearPost",
    });
  };

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-md border border-rose-100 p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
          <MessageCircle className="text-white" size={16} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Hacer una pregunta</h2>
      </div>

      {/* Mensajes de éxito o error */}
      {fetcher.data?.status === "success" && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✓ {fetcher.data.message}
          </p>
        </div>
      )}

      {fetcher.data?.status === "error" && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">
            ✗ {fetcher.data.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="¿Cuál es tu pregunta?"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <textarea
          placeholder="Describe tu consulta con más detalle..."
          rows={3}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none transition-all text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            disabled={isSubmitting}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Seleccionar categoría</option>
            <option value="Comportamiento">Comportamiento</option>
            <option value="Salud">Salud</option>
            <option value="Adopción">Adopción</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Entrenamiento">Entrenamiento</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting || !titulo.trim() || !contenido.trim()}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Publicando...
              </span>
            ) : (
              "Publicar pregunta"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
