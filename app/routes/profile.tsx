import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { useAuth } from "~/features/auth/useAuth";
import { Link } from "react-router";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import { Settings, Grid, Bookmark, UserPlus } from "lucide-react";
import { useState } from "react";

// Loader para obtener datos del perfil
export async function loader({ request }: LoaderFunctionArgs) {
  // Aquí puedes hacer fetch a tu API para obtener datos del usuario
  // Por ahora, datos de ejemplo
  const user = {
    id: "123",
    username: "usuario_ejemplo",
    email: "usuario@ejemplo.com",
    nombre: "Usuario Ejemplo",
    fechaRegistro: "2024-01-15",
    mascotas: 2,
    publicaciones: 15,
  };

  return { user };
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts"
  );

  const handleLogout = () => {
    setUser(null); // limpia el user del contexto
    navigate("/"); // redirige a la root
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <CommunityNavbar />
      <SidebarContainer showSidebar={true} className="z-80" />

      <div className="mx-auto max-w-4xl px-4 pt-20 pb-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header del perfil - estilo Instagram */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start gap-8">
              {/* Avatar principal */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <img
                      src={`https://i.pravatar.cc/150?u=${user.username}`}
                      alt={user.nombre}
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Información del usuario */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-2xl font-light text-gray-900">
                    {user.username}
                  </h1>
                  <button className="px-4 py-1.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    Editar perfil
                  </button>
                  <Link
                    to="/settings"
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings size={20} className="text-gray-600" />
                  </Link>
                </div>

                {/* Estadísticas estilo Instagram */}
                <div className="flex gap-8 mb-4">
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-900">
                      {user.publicaciones}
                    </span>
                    <span className="text-sm text-gray-600">publicaciones</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-900">
                      1,234
                    </span>
                    <span className="text-sm text-gray-600">seguidores</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-900">
                      567
                    </span>
                    <span className="text-sm text-gray-600">siguiendo</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <h2 className="font-semibold text-gray-900">{user.nombre}</h2>
                  <p className="text-sm text-gray-600">
                    🐾 Amante de los animales | Rescatista voluntario
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 Ciudad de México | Miembro desde {user.fechaRegistro}
                  </p>
                  <p className="text-sm text-gray-600">
                    🏠 {user.mascotas} mascotas rescatadas en casa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navegación de tabs */}
          <div className="border-b border-gray-200">
            <div className="flex justify-center">
              <div className="flex gap-16">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === "posts"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid size={16} />
                  PUBLICACIONES
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === "saved"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Bookmark size={16} />
                  GUARDADO
                </button>
                <button
                  onClick={() => setActiveTab("tagged")}
                  className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === "tagged"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <UserPlus size={16} />
                  ETIQUETADO
                </button>
              </div>
            </div>
          </div>

          {/* Contenido de tabs */}
          <div className="p-6">
            {activeTab === "posts" && (
              <div>
                <div className="grid grid-cols-3 gap-1">
                  {/* Publicaciones de ejemplo */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-sm overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={`https://picsum.photos/300/300?random=${i + 1}`}
                        alt={`Publicación ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>

                {/* Estado vacío si no hay publicaciones */}
                {user.publicaciones === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Grid size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">
                      Comparte fotos
                    </h3>
                    <p className="text-sm text-gray-500">
                      Cuando compartas fotos, aparecerán en tu perfil.
                    </p>
                    <button className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-700">
                      Comparte tu primera foto
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <Bookmark size={24} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  Guarda las publicaciones que te gusten
                </h3>
                <p className="text-sm text-gray-500">
                  Cuando guardes publicaciones, aparecerán aquí.
                </p>
              </div>
            )}

            {activeTab === "tagged" && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <UserPlus size={24} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  Fotos tuyas
                </h3>
                <p className="text-sm text-gray-500">
                  Cuando te etiqueten en fotos, aparecerán aquí.
                </p>
              </div>
            )}
          </div>

          {/* Botón de logout (temporal para desarrollo) */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
