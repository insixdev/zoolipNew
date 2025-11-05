import { Video, MapPin, Smile, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "~/components/ui/layout";
import { CreatePostForm } from "~/components/ui/forms";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function CrearPublicacion() {
  const handlePublish = (data: {
    content: string;
    images: string[];
    location: string;
    tags: string[];
  }) => {
    console.log("Publishing post:", data);
    // Aquí iría la lógica para publicar
    // Redirigir al feed después de publicar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <PageHeader
            title="Crear Publicación"
            backTo="/"
            actions={
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all font-medium shadow-lg hover:shadow-xl">
                Publicar
              </button>
            }
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CreatePostForm
          onSubmit={handlePublish}
          placeholder="¿Qué quieres compartir con la comunidad? Cuéntanos sobre tu mascota, comparte consejos, haz preguntas..."
          showAdvanced={true}
        />

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer">
              <ImageIcon size={24} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Foto</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>

            <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
              <Video size={24} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Video</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
              <MapPin size={24} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Ubicación
              </span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
              <Smile size={24} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Emoji</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
