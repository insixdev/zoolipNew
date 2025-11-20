import { useState, useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { ImageIcon, Loader2, X } from "lucide-react";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";

type CreatePostCardProps = {
  onPostCreated?: (data: { content: string; topico: string }) => void;
};
/**
 * es un componente de React que representa una tarjeta para crear un nuevo post en la comunidad
 * */
export default function CreatePostCard({ onPostCreated }: CreatePostCardProps) {
  // para quitar en el preview
  
  // este para estaddo para no subir directamente la imagen
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  // esta la url del archivo literal
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null)
  // errores de la preview todo en memoria
  const [errorPreview, setErrorPreview] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const [topico, setTopico] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [onFocusCrear, setFocusCrear] = useState<boolean>(false);
  const fetcher = useFetcher();
  const uploadFetcher = useFetcher();
  const hasCleared = useRef(false);

  const isSubmitting = fetcher.state === "submitting";
  const isUploading = uploadFetcher.state === "submitting";
  // cuando caMBIA EL input para file
  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? e.currentTarget.files?.[0] ?? null;
    if(f){
      // seteamos lit el file
      setImagePreview(f);
    }else {
      // limpiamos el file
      setImagePreview(null);
      setErrorPreview("error al subir el archivo al navegador");
    }

  }

  
  const imageUploadHandler = () => {
    if(!imagePreview) {
      setErrorPreview("No se ha seleccionado ninguna imagen");
      return 
    }; 
    // preview pero en realidad tambien 
    // la imagen que se sube
    const file = imagePreview; 
    
    console.log(
      "[UPLOAD] Subiendo archivo:",
      file.name,
      `(${(file.size / 1024).toFixed(2)} KB)`
    );

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Archivo muy grande. Máximo 5MB");
      setErrorPreview("Archivo muy grande. Máximo 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadFetcher.submit(formData, {
      method: "post",
      action: "/api/upload/image",
      encType: "multipart/form-data",
    });

  };
  // para ver si la subida fue exitosa
  useEffect(() => {
    if (uploadFetcher.data?.status === "success") {
      if (
        uploadFetcher.data.data?.fileUrl &&
        imageUrl !== uploadFetcher.data.data.fileUrl
      ) {
        setErrorPreview(null);
        setImagePreview(null);
        setImageUrlPreview(null);
        console.log(
          "[UPLOAD] Imagen subida exitosamente:",
          uploadFetcher.data.data.fileUrl
        );
      }
    }
  }, [uploadFetcher.data]);
 
  // para previsualizar la imagen cuando cambie
  useEffect(() => {
    if (!imagePreview) {
      setImageUrlPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imagePreview);
    setImageUrlPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imagePreview]);

  // Cuando la imagen se sube exitosamente, guardar la URL

  // podremos eliminar la image 
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageUrlPreview(null);

  };

  // para finalmente subirr el archivo
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
    imageUploadHandler()

    // Agregar imagen URL si existe
    if (imageUrl) {
      formData.append("imagen_url", imageUrl);
      console.log("[SUBMIT] Enviando publicacion con imagen:", imageUrl);
    } else {
      console.log("[SUBMIT] Enviando publicacion sin imagen");
    }

    fetcher.submit(formData, {
      method: "post",
      action: "/api/post/crearPost",
    });
  };

  // Efecto para limpiar el formulario y recargar cuando se crea exitosamente
  useEffect(() => {
    if (
      fetcher.data?.status === "success" &&
      fetcher.state === "idle" &&
    !hasCleared.current
    ) {
      // Limpiar el formulario
      if (content || topico || imageUrl) {
        const postData = {
          content,
          topico,
        };

        console.log(
          "[SUBMIT] Publicacion creada exitosamente, limpiando formulario"
        );

        // Marcar como limpiado
        hasCleared.current = true;

        // Limpiar estados
        setContent("");
        setTopico("");
        setErrorPreview(null);
        setImageUrl("");

        // Callback para recargar posts con los datos del nuevo post
        if (onPostCreated) {
          onPostCreated(postData);
        }
      }
    }

    // Resetear la bandera cuando el fetcher vuelve a estar listo para un nuevo submit
    if (fetcher.state === "submitting") {
      hasCleared.current = false;
    }
  }, [fetcher.data, fetcher.state, content, topico, imageUrl, onPostCreated]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    {fetcher.data?.status === "success" &&
      fetcher.state === "idle" &&
      (content || topico || imageUrl) && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-200">
        ¡Publicación creada con éxito!
        </div>
    )}

    {(fetcher.data?.status || errorPreview)=== "error" && (
      <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
      {fetcher.data.message || errorPreview}
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

    {/* Estado de carga de imagen */}
    {isUploading && (
      <div className="mt-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center gap-3">
      <Loader2 className="animate-spin text-blue-500" size={20} />
      <span className="text-sm text-blue-700 font-medium">
      Subiendo imagen...
        </span>
      </div>
    )}

    {/* Mensaje de éxito al subir imagen */}
    {uploadFetcher.data?.status === "success" &&
      !isUploading &&
      imageUrl && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
        <span className="text-sm text-green-700 font-medium">
        ✓ Imagen subida correctamente
        </span>
        </div>
    )}

    {/* Preview de imagen */}
    {(imageUrlPreview && imagePreview) && (
      <div className="mt-3 relative inline-block">
      <img
      src={imageUrlPreview}
      alt="Preview"
      className="max-w-xs max-h-48 rounded-lg border-2 border-gray-200"
      />
      {/*Botón para eliminar la imagen*/}
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

    {/* Error al subir imagen */}
    {uploadFetcher.data?.status === "error" && !isUploading && (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
      <span className="text-sm text-red-700">
      {uploadFetcher.data.message || "Error al subir la imagen"}
      </span>
      </div>
    )}

    <div className="flex justify-between items-center mt-4">
    <div className="flex items-center gap-2">
    <label
    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer ${
      isUploading
        ? "bg-blue-100 text-blue-600"
        : "text-gray-600 hover:bg-gray-100"
    }`}
    >
    {isUploading ? (
      <Loader2 size={20} className="animate-spin" />
    ) : (
    <ImageIcon size={20} />
    )}
    <span className="text-sm font-medium">
    {isUploading
      ? "Subiendo..."
      : imageUrl
        ? "Cambiar imagen"
        : "Imagen"}
        </span>
        <input
        type="file"
        accept="image/*"
        onChange={handlePreviewImage}
        className="hidden"
        disabled={isSubmitting || isUploading}
        />
        </label>
        </div>
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
