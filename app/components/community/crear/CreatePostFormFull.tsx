import { useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

type CreatePostFormFullProps = {
  placeholder?: string;
  onSuccess?: () => void;
};

export default function CreatePostFormFull({
  placeholder = "¿Qué quieres compartir con la comunidad? Cuéntanos sobre tu mascota, comparte consejos, haz preguntas...",
  onSuccess,
}: CreatePostFormFullProps) {
  const [topico, setTopico] = useState("");
  const [content, setContent] = useState("");
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("El contenido no puede estar vacío");
      return;
    }

    const formData = new FormData();
    formData.append("topico", topico || "General");
    formData.append("contenido", content);
    formData.append("likes", "0");

    fetcher.submit(formData, {
      method: "post",
      action: "/api/post/crear",
    });
  };

  // Redirigir después de éxito
  if (fetcher.data?.status === "success" && !isSubmitting) {
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/community");
      }
    }, 1500);
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
      {fetcher.data?.status === "success" && (
        <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg border border-green-200">
          ¡Publicación creada con éxito! Redirigiendo...
        </div>
      )}

      {fetcher.data?.status === "error" && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {fetcher.data.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tópico */}
        <div>
          <label
            htmlFor="topico"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tópico / Categoría
          </label>
          <input
            type="text"
            id="topico"
            value={topico}
            onChange={(e) => setTopico(e.target.value)}
            placeholder="Ej: Consejos de alimentación, Adopción, Salud..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            disabled={isSubmitting}
          />
        </div>

        {/* Contenido */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenido <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={8}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none transition-all"
            disabled={isSubmitting}
          />
          <p className="mt-2 text-sm text-gray-500">
            {content.length} caracteres
          </p>
        </div>

        {/* Botón de publicar */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/community")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              "Publicar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
