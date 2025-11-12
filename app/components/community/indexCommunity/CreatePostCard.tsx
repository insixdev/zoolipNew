import { useState } from "react";
import { useFetcher } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { ImageIcon, Loader2 } from "lucide-react";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";

type CreatePostCardProps = {
  onPostCreated?: () => void;
};
/**
 * es un componente de React que representa una tarjeta para crear un nuevo post en la comunidad
 * */
export default function CreatePostCard({ onPostCreated }: CreatePostCardProps) {
  const [content, setContent] = useState("");
  const [topico, setTopico] = useState("");
  const [onFocusCrear, setFocusCrear] = useState<boolean>(false);
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("El contenido no puede estar vacío");
      return;
    }

    const formData = new FormData();
    formData.append("topico", topico.trim() || "General");
    formData.append("contenido", content.trim());
    formData.append("tipo", "PUBLICACION");

    console.log("Submitting post:", {
      topico: topico.trim() || "General",
      contenido: content.trim(),
      tipo: "PUBLICACION",
    });

    fetcher.submit(formData, {
      method: "post",
      action: "/api/post/crearPost",
    });
  };

  // Efecto para limpiar el formulario y recargar cuando se crea exitosamente
  if (fetcher.data?.status === "success" && fetcher.state === "idle") {
    // Limpiar el formulario
    if (content || topico) {
      setContent("");
      setTopico("");

      // Callback para recargar posts
      if (onPostCreated) {
        onPostCreated();
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {fetcher.data?.status === "success" && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-200">
          ¡Publicación creada con éxito!
        </div>
      )}

      {fetcher.data?.status === "error" && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {fetcher.data.message}
        </div>
      )}

      <AuthRoleComponent
        allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ADOPTANTE, USER_ROLES.USER]}
        fallback={
          <div
            onMouseEnter={() => setFocusCrear(true)}
            onMouseLeave={() => setFocusCrear(false)}
            className="relative"
          >
            <p
              className={`
    mb-4 p-3 text-sm rounded-lg border transition-all duration-300 ease-out
    ${
      onFocusCrear
        ? "opacity-100 translate-y-0 bg-pink-50 border-red-200 text-gray-600"
        : "opacity-0 -translate-y-2 pointer-events-none"
    }
  `}
            >
              Para crear una publicación debes iniciar sesión
            </p>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="https://i.pravatar.cc/150?img=33" alt="Tu" />
              <AvatarFallback>TU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <input
                type="text"
                value={topico}
                onChange={(e) => setTopico(e.target.value)}
                placeholder="Topico (opcional)"
                className="w-full mb-2 px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm text-gray-900 placeholder-gray-400"
                disabled={isSubmitting}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="¿Qué está pasando con tus mascotas?"
                className="w-full min-h-[80px] p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  disabled={isSubmitting}
                >
                  <ImageIcon size={20} />
                  <span className="text-sm">Imagen</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="px-6 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    "Publicar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </AuthRoleComponent>
    </div>
  );
}
