import { PageHeader } from "~/components/ui/layout";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";
import CreatePostFormFull from "~/components/community/crear/CreatePostFormFull";
import QuickActions from "~/components/community/crear/QuickActions";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function CrearPublicacion() {
  const handleImageSelect = (file: File) => {
    console.log("Image selected:", file.name);
    // TODO: Implementar subida de imagen
  };

  const handleVideoClick = () => {
    console.log("Video clicked");
    // TODO: Implementar subida de video
  };

  const handleLocationClick = () => {
    console.log("Location clicked");
    // TODO: Implementar selector de ubicación
  };

  const handleEmojiClick = () => {
    console.log("Emoji clicked");
    // TODO: Implementar selector de emoji
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageHeader title="Crear Publicación" backTo="/community" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Formulario principal */}
        <CreatePostFormFull placeholder="¿Qué quieres compartir con la comunidad? Cuéntanos sobre tu mascota, comparte consejos, haz preguntas..." />

        {/* Acciones rápidas */}
        <QuickActions
          onImageSelect={handleImageSelect}
          onVideoClick={handleVideoClick}
          onLocationClick={handleLocationClick}
          onEmojiClick={handleEmojiClick}
        />
      </div>
    </div>
  );
}
