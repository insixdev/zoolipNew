import { useState, useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { ImageIcon, Loader2, X } from "lucide-react";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

type CreatePostCardProps = {
  onPostCreated?: (data: { content: string; topico: string }) => void;
};

/**
 * Componente para crear nuevas publicaciones
 * Flujo: Elegir imagen (preview en memoria) → Publicar (sube imagen + crea post en servidor)
 */
export default function CreatePostCard({ onPostCreated }: CreatePostCardProps) {
   const { user } = useSmartAuth();
   
   // Archivo seleccionado (en memoria, sin subir)
   const [imageFile, setImageFile] = useState<File | null>(null);
   // Preview local del archivo (blob URL)
   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

   // Estado del formulario
   const [content, setContent] = useState("");
   const [topico, setTopico] = useState("");
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [onFocusCrear, setFocusCrear] = useState<boolean>(false);

   // Fetcher para crear el post (que incluirá la imagen)
   const postFetcher = useFetcher();
   const hasCleared = useRef(false);

  const isSubmitting = postFetcher.state === "submitting";

  // Manejar selección de archivo - solo carga en memoria
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? e.currentTarget.files?.[0] ?? null;

    if (!file) {
      setErrorMessage("Error al seleccionar el archivo");
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Archivo muy grande. Máximo 5MB");
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setErrorMessage("El archivo debe ser una imagen");
      return;
    }

    setImageFile(file);
    setErrorMessage(null);
    console.log(
      "[IMAGE] Imagen seleccionada en memoria:",
      file.name,
      `(${(file.size / 1024).toFixed(2)} KB)`
    );
  };

  // Crear preview local cuando se selecciona archivo
  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // Limpiar formulario cuando el post se crea exitosamente
  useEffect(() => {
    if (
      postFetcher.data?.status === "success" &&
      postFetcher.state === "idle" &&
      !hasCleared.current
    ) {
      const postData = { content, topico };
      console.log("[POST] Publicación creada exitosamente");

      hasCleared.current = true;
      setContent("");
      setTopico("");
      setImageFile(null);
      setImagePreviewUrl(null);
      setErrorMessage(null);

      if (onPostCreated) {
        onPostCreated(postData);
      }
    }

    if (postFetcher.state === "submitting") {
      hasCleared.current = false;
    }
  }, [postFetcher.data, postFetcher.state, content, topico, onPostCreated]);

  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setErrorMessage(null);
  };

  // Enviar publicación con imagen (todo junto)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setErrorMessage("El contenido no puede estar vacío");
      return;
    }

    const formData = new FormData();
    formData.append("topico", topico.trim() || "General");
    formData.append("contenido", content.trim());
    formData.append("tipo", "PUBLICACION");

    // Si hay imagen seleccionada, agregarla al FormData
    if (imageFile) {
      formData.append("imagen_file", imageFile);
      console.log("[SUBMIT] Publicación con imagen:", imageFile.name);
    } else {
      console.log("[SUBMIT] Publicación sin imagen");
    }

    postFetcher.submit(formData, {
      method: "post",
      action: "/api/post/crearPost",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Mensaje de éxito */}
      {postFetcher.data?.status === "success" &&
        postFetcher.state === "idle" &&
        (content || topico || imageFile) && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-200">
            ¡Publicación creada con éxito!
          </div>
        )}

      {/* Mensajes de error */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}

      {postFetcher.data?.status === "error" && postFetcher.state === "idle" && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {postFetcher.data.message || "Error al crear la publicación"}
        </div>
      )}

      <AuthRoleComponent
        allowedRoles={[
          USER_ROLES.ADMIN,
          USER_ROLES.VETERINARIA,
          USER_ROLES.REFUGIO,
          USER_ROLES.ADOPTANTE,
          USER_ROLES.USER,
          USER_ROLES.SYSTEM,
        ]}
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
            {user?.imagen_url ? (
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.imagen_url} alt={user?.username || "Tu"} />
              </Avatar>
            ) : (
              <Avatar className="w-12 h-12">
                <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "TU"}</AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1">
              {/* Input de tópico */}
              <input
                type="text"
                value={topico}
                onChange={(e) => setTopico(e.target.value)}
                placeholder="Tópico (opcional)"
                className="w-full mb-2 px-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm text-gray-900 placeholder-gray-400"
                disabled={isSubmitting}
              />

              {/* Textarea de contenido */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="¿Qué está pasando con tus mascotas?"
                className="w-full min-h-[80px] p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none text-gray-900 placeholder-gray-500"
                disabled={isSubmitting}
              />

              {/* Estado de carga durante submit */}
              {isSubmitting && (
                <div className="mt-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center gap-3">
                  <Loader2 className="animate-spin text-blue-500" size={20} />
                  <span className="text-sm text-blue-700 font-medium">
                    Publicando...
                  </span>
                </div>
              )}

              {/* Preview de imagen (en memoria) */}
              {imagePreviewUrl && imageFile && (
                <div className="mt-3 relative inline-block">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-lg border-2 border-gray-200"
                  />
                  {/* Botón para eliminar la imagen */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                    disabled={isSubmitting}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-between items-center mt-4">
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                    isSubmitting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                  <span className="text-sm font-medium">
                    {imageFile ? "Cambiar imagen" : "Imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>

                {/* Botón de publicar */}
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