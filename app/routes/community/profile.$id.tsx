import { LoaderFunctionArgs, useLoaderData, Link } from "react-router";
import { getUserByIdService, UserProfile } from "~/features/user/userService";
import { getUserFieldFromCookie, field } from "~/lib/authUtil";
import { Settings, Grid, Bookmark } from "lucide-react";
import { useState } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.redirect("/auth/login");
  }

  const userId = params.id;

  if (!userId) {
    throw new Response("Usuario no encontrado", { status: 404 });
  }

  try {
    // Obtener el ID del usuario actual desde la cookie
    const currentUserId = getUserFieldFromCookie(cookie, field.id);

    // Verificar si es el perfil propio
    const isOwnProfile = currentUserId === userId;

    console.log(`[PROFILE] Cargando perfil del usuario: ${userId}`);

    // Obtener los datos del usuario desde el backend
    const user = await getUserByIdService(parseInt(userId), cookie);

    return { user, isOwnProfile };
  } catch (err) {
    console.error("Error al cargar perfil:", err);
    throw new Response("Error al cargar perfil", { status: 500 });
  }
}

export default function UserProfile() {
  const { user, isOwnProfile } = useLoaderData<{
    user: UserProfile;
    isOwnProfile: boolean;
  }>();

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  // Datos de ejemplo para publicaciones (0 por defecto)
  const publicaciones = 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header con botón de volver */}
        <div className="mb-6">
          <Link
            to="/community"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a Community
          </Link>
        </div>

        {/* Perfil del usuario - estilo Instagram */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Header del perfil */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start gap-8">
              {/* Avatar principal */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <img
                      src={
                        user.imagen_url ||
                        `https://i.pravatar.cc/150?u=${user.nombre}`
                      }
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
                    {user.nombre}
                  </h1>
                  {isOwnProfile && (
                    <>
                      <button className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 text-sm font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow-md">
                        Editar perfil
                      </button>
                      <Link
                        to="/settings"
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:shadow-sm"
                      >
                        <Settings size={20} className="text-gray-600" />
                      </Link>
                    </>
                  )}
                </div>

                {/* Estadísticas */}
                <div className="flex gap-8 mb-4">
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-900">
                      {publicaciones}
                    </span>
                    <span className="text-sm text-gray-600">publicaciones</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <h2 className="font-semibold text-gray-900">{user.nombre}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.biografia && (
                    <p className="text-sm text-gray-600">{user.biografia}</p>
                  )}
                  {user.fecha_registro && (
                    <p className="text-sm text-gray-600">
                      📍 Miembro desde{" "}
                      {new Date(user.fecha_registro).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navegación de tabs */}
          <div className="border-b border-gray-100">
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
                {isOwnProfile && (
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
                )}
              </div>
            </div>
          </div>

          {/* Contenido de tabs */}
          <div className="p-6">
            {activeTab === "posts" && (
              <div>
                {publicaciones > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                    {/* Publicaciones de ejemplo */}
                    {Array.from({ length: publicaciones }).map((_, i) => (
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
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Grid size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">
                      {isOwnProfile
                        ? "Comparte fotos"
                        : "Sin publicaciones aún"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isOwnProfile
                        ? "Cuando compartas fotos, aparecerán en tu perfil."
                        : "Las publicaciones aparecerán aquí."}
                    </p>
                    {isOwnProfile && (
                      <Link
                        to="/community/consultas"
                        className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        Comparte tu primera publicación
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && isOwnProfile && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
