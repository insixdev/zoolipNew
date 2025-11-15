import { useActionData, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useFetcher } from "react-router";
import { useAuth } from "~/features/auth/useAuth";
import { Link } from "react-router";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import { Settings, Grid, Bookmark, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { requireAuth } from "~/lib/authGuard";

import { logoutService } from "~/features/auth/authServiceCurrent";
import { getHeaderCookie } from "~/server/cookies";

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    const navCookie = getHeaderCookie(request);
    if (!navCookie) {
      return Response.json(
        {
          status: "error",
          message: "No hay sesión activa",
        },
        { status: 400 }
      );
    }

    try {
      await logoutService(navCookie);

      // Limpiar caché del servidor
      const { clearUserCache } = await import("~/server/me");
      clearUserCache();

      // Limpiar la cookie del navegador
      return Response.json(
        { status: "success", message: "Logout exitoso" },
        {
          status: 200,
          headers: {
            "Set-Cookie":
              "AUTH_TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
          },
        }
      );
    } catch (error) {
      console.error("Error en logout:", error);
      return Response.json(
        {
          status: "error",
          message: "Error al cerrar sesión",
        },
        { status: 500 }
      );
    }
  }

  return null;
}
// Loader para obtener datos del perfil
export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar autenticación (redirige automáticamente si no está autenticado)
  const userResponse = await requireAuth(request);
  const cookie = request.headers.get("Cookie");

  // Obtener publicaciones del usuario actual
  let publications = [];
  if (cookie) {
    const { getCurrentUserPublicationsService } = await import(
      "~/features/post/postService"
    );
    const { postParseResponse } = await import(
      "~/features/post/postResponseParse"
    );

    try {
      const fetchedPosts = await getCurrentUserPublicationsService(cookie);
      publications = postParseResponse(fetchedPosts);
    } catch (error) {
      console.error("Error loading user publications:", error);
    }
  }

  const user = {
    id: userResponse.user.id,
    username: userResponse.user.username,
    email: userResponse.user.email,
    nombre: userResponse.user.username,
    fechaRegistro: "2024-01-15",
    mascotas: 2,
    publicaciones: publications.length,
    role: userResponse.user.role,
  };

  return { user, publications };
}

export default function Profile() {
  const { user, publications } = useLoaderData<typeof loader>();
  const { logout, setIsLoading } = useAuth();
  const navigate = useNavigate();
  const fetcher = useFetcher<{ status: string; message: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts"
  );

  const isLoggingOut = fetcher.state === "submitting";

  // Manejar respuesta del logout
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.status === "success") {
        logout();
        navigate("/");
      }
    }
  }, [fetcher.data, logout, navigate]);

  const handleLogout = () => {
    setIsLoading(true);
    fetcher.submit({ intent: "logout" }, { method: "post" });
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="mx-auto max-w-4xl md:pl-40 px-4 pt-6 pb-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Header del perfil - estilo Instagram */}
          <div className="p-8 border-b border-gray-100">
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
                  <button className="px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 text-sm font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow-md">
                    Editar perfil
                  </button>
                  <Link
                    to="/settings"
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:shadow-sm"
                  >
                    <Settings size={20} className="text-gray-600" />
                  </Link>
                </div>

                {/* Estadísticas estilo Instagram */}
                <div className="flex gap-8 mb-4 text-center text-gray-600">
                  <div className="text-center justify-center ">
                    <span className="block text-lg font-semibold text-gray-900">
                      {user.publicaciones}
                    </span>
                    <span className="text-sm text-gray-600">publicaciones</span>
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
                  <UserPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido de tabs */}
          <div className="p-6">
            {activeTab === "posts" && (
              <div>
                {publications.length > 0 ? (
                  <div className="space-y-4">
                    {publications.map((post: any) => (
                      <div
                        key={post.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                            {user.username[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {user.username}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {post.publicationType === "CONSULTA"
                                  ? "Consulta"
                                  : "Publicación"}
                              </span>
                            </div>
                            {post.topico && (
                              <span className="text-xs text-gray-500">
                                {post.topico}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-800 whitespace-pre-wrap">
                          {post.content}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>{post.likes} me gusta</span>
                          <span>{post.comments} comentarios</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                    <Link
                      to="/community"
                      className="mt-4 inline-block text-sm font-medium text-blue-500 hover:text-blue-700"
                    >
                      Comparte tu primera publicación
                    </Link>
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

          {/* Botón de logout */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Cerrando sesión...
                </span>
              ) : (
                "Cerrar Sesión"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
