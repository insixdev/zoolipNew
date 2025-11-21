import { redirect, useActionData, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useFetcher } from "react-router";
import { useAuth } from "~/features/auth/useAuth";
import { Link } from "react-router";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import { Settings, Grid, Bookmark, UserPlus, Dog, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { requireAuth } from "~/lib/authGuard";

import { logoutService } from "~/features/auth/authServiceCurrent";
import { getHeaderCookie } from "~/server/cookies";
import { getMascotasByInstitucionService, getMisMascotasService } from "~/features/adoption/adoptionService";
import type { MascotaDTO } from "~/features/adoption/types";
import { getInstitutionByIdUsuarioService } from "~/features/entities/institucion/institutionService";
import { getUserFieldFromCookie, field } from "~/lib/authUtil";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import type { User } from "~/features/entities/User";
import { getUserByIdService } from "~/features/user/userService";

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
  if(!cookie){
    return redirect("/auth/login", {
      headers: {
        "Cookie":
          "AUTH_TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
      },
    });
  }

  // Obtener el rol desde la cookie
  const rolFromCookie = getUserFieldFromCookie(cookie, field.role);
  const userId = getUserFieldFromCookie(cookie, field.id);
  
  let isRole: string | null = null;

  if (rolFromCookie === "ROLE_ADMINISTRADOR") {
    isRole = "ADMIN";
  } else if (rolFromCookie === "ROLE_ADOPTANTE") {
    isRole = "ADOPTANTE";
  }

  // Obtener datos completos del usuario del backend (incluye biografia)
  let fullUser = {
    id: userResponse.user.id,
    username: userResponse.user.username,
    email: userResponse.user.email,
    nombre: userResponse.user.username,
    biografia: null as string | null,
    imagen_url: null as string | null,
    fecha_registro: "2024-01-15",
    role: userResponse.user.role,
  };

  try {
    const userData = await getUserByIdService(parseInt(userId), cookie);
    if (userData && !("message" in userData)) {
      fullUser = {
        ...fullUser,
        nombre: userData.nombre,
        biografia: userData.biografia || null,
        imagen_url: userData.imagen_url || null,
        email: userData.email,
      };
    }
  } catch (error) {
    console.error("Error loading full user data:", error);
  }

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

  // Separar publicaciones y consultas
  const userPosts = publications.filter(
    (post: any) => post.publicationType === "PUBLICACION"
  );
  const userConsultas = publications.filter(
    (post: any) => post.publicationType === "CONSULTA"
  );

  // Obtener mascotas basado en el rol desde la cookie
  let mascotas: MascotaDTO[] = [];

  // Cargar mascotas según el rol
  if (rolFromCookie === "ROLE_ADMINISTRADOR" && cookie) {
    try {
      const institutionId = await getInstitutionByIdUsuarioService(userId, cookie);
      mascotas = await getMascotasByInstitucionService(
        institutionId.id_institucion,
        cookie
      );
    } catch (error) {
      console.error("Error loading institution pets:", error);
    }
  } else if (rolFromCookie === "ROLE_ADOPTANTE" && cookie) {
    try {
      mascotas = await getMisMascotasService(cookie);
    } catch (error) {
      console.error("Error loading my pets:", error);
    }
  }

  const user = {
    ...fullUser,
    mascotas: mascotas.length,
    publicaciones: userPosts.length,
    consultas: userConsultas.length,
  };

  return { user, userPosts, userConsultas, mascotas, isRole };
}

export default function Profile() {
   const { user: loaderUser, userPosts, userConsultas, mascotas, isRole } = useLoaderData<typeof loader>();
   const { logout, setIsLoading } = useAuth();
   const navigate = useNavigate();
   const fetcher = useFetcher<{ status: string; message: string }>();

   const { logout: clientLogout, user: authUser } = useSmartAuth();
   
   // Usar los datos del contexto de autenticación que incluye la imagen actualizada
   const user = authUser?.imagen_url ? {
     ...loaderUser,
     imagen_url: authUser.imagen_url
   } : loaderUser;
  const [activeTab, setActiveTab] = useState<"posts" | "consultas" | "saved" | "mascotas">(
    
    "posts"
  );

  // Verificar si es un refugio o adoptante
  const isAdoptante = isRole === "ADOPTANTE";
  const isRefugio = isRole === "ADMIN";
  const showMascotas = isRefugio || isAdoptante;
  const isOwnProfile = true; // Es el perfil del usuario actual

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
 // Manejar respuesta del logout
  useEffect(() => {
    if (fetcher.data && fetcher.data.status === "success") {
      // Limpiar estado del cliente
      clientLogout();
      // Redirigir al login
      window.location.href = "/login";

    }

      redirect("/login");
  }, [fetcher.data, clientLogout]);

  const handleLogout = () => {
    setIsLoading(true);
    fetcher.submit({}, { method: "post", action: "/api/auth/logout" });
  };

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
                {user.imagen_url ? (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          user.imagen_url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
                            ? user.imagen_url
                            : `${user.imagen_url}.png`
                        }
                        alt={user.nombre}
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="text-center text-gray-400">Sin foto</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Información del usuario */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-2xl font-light text-gray-900">
                    {user.nombre}
                  </h1>

                  {isOwnProfile && (
                    <>
                      <Link
                        to="/settings"
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:shadow-sm"
                      >
                        <Settings size={20} className="text-gray-600" />
                      </Link>
                    </>
                  )}
                </div>

                {/* Estadísticas estilo Instagram */}
                <div className="flex gap-8 mb-6">
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-900">
                      {user.publicaciones}
                    </span>
                    <span className="text-sm text-gray-600">publicaciones</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-900">
                      {user.consultas}
                    </span>
                    <span className="text-sm text-gray-600">consultas</span>
                  </div>
                  {showMascotas && (
                    <div className="text-center">
                      <span className="block text-lg font-semibold text-gray-900">
                        {mascotas.length}
                      </span>
                      <span className="text-sm text-gray-600">
                        {isRefugio ? "mascotas" : "adoptadas"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.biografia && (
                    <p className="text-sm text-gray-600 italic">{user.biografia}</p>
                  )}
                  {user.fechaRegistro && (
                    <p className="text-sm text-gray-600">
                      📍{" "}
                      <span suppressHydrationWarning>
                        {new Date(user.fechaRegistro).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
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
                <button
                  onClick={() => setActiveTab("consultas")}
                  className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === "consultas"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid size={16} />
                  CONSULTAS
                </button>
                {showMascotas && (
                  <button
                    onClick={() => setActiveTab("mascotas")}
                    className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors ${
                      activeTab === "mascotas"
                        ? "text-gray-900 border-b-2 border-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Dog size={16} />
                    {!isOwnProfile ? "MASCOTAS" : "MIS MASCOTAS"}
                  </button>
                )}
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
                {userPosts && userPosts.length > 0 ? (
                  <div className="space-y-6">
                    {userPosts.map((post) => (
                       <div
                         key={post.id}
                         className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all"
                       >
                         <div className="flex items-start gap-4">
                           <img
                             src={user.imagen_url || ""}
                             alt={user.nombre}
                             className="w-12 h-12 rounded-full"
                           />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {user.nombre}
                              </h3>
                              <span
                                className="text-sm text-gray-500"
                                suppressHydrationWarning
                              >
                                {new Date(
                                  post.fecha_creacion
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-3">{post.content}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Heart size={16} />
                                {post.likes} me gusta
                              </span>
                              <span>{post.comments} comentarios</span>
                            </div>
                          </div>
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
                      Comparte tus publicaciones
                    </h3>
                    <p className="text-sm text-gray-500">
                      Cuando compartas fotos, aparecerán en tu perfil.
                    </p>
                    <Link
                      to="/community/consultas"
                      className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      Comparte tu primera publicación
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "consultas" && (
              <div>
                {userConsultas && userConsultas.length > 0 ? (
                  <div className="space-y-6">
                    {userConsultas.map((consulta) => (
                       <div
                          key={consulta.id}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start gap-4">
                            {user.imagen_url && (
                            <img
                              src={
                                user.imagen_url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
                                  ? user.imagen_url
                                  : `${user.imagen_url}.png`
                              }
                              alt={user.nombre}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {user.nombre}
                              </h3>
                              <span
                                className="text-sm text-gray-500"
                                suppressHydrationWarning
                              >
                                {new Date(
                                  consulta.fecha_creacion
                                ).toLocaleDateString()}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                Consulta
                              </span>
                            </div>
                            <p className="text-gray-800 mb-3">
                              {consulta.content}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Heart size={16} />
                                {consulta.likes} me gusta
                              </span>
                              <span>{consulta.comments} respuestas</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-purple-300 flex items-center justify-center">
                      <Grid size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">
                      Haz tus primeras consultas
                    </h3>
                    <p className="text-sm text-gray-500">
                      Cuando hagas preguntas, aparecerán en tu perfil.
                    </p>
                    <Link
                      to="/community/consultas"
                      className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      Haz tu primera consulta
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

            {activeTab === "mascotas" && showMascotas && (
              <div>
                {mascotas && mascotas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mascotas.map((mascota) => (
                      <div key={mascota.id}>
                        {isRefugio ? (
                          <Link
                            to={`/admin/editarMascota/${mascota.id_Mascota}`}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg 
                            transition-all duration-300 hover:-translate-y-1"
                          >
                            <div className="aspect-square overflow-hidden bg-gray-100">
                              <img
                                src={
                                  mascota.imagen_url ||
                                  `https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop`
                                }
                                alt={mascota.nombre}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {mascota.nombre}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {mascota.raza} • {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
                              </p>
                              {mascota.estadoSalud && (
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {mascota.estadoSalud}
                                </p>
                              )}
                              {mascota.descripcion && (
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {mascota.descripcion}
                                </p>
                              )}

                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {mascota.estadoAdopcion === "ADOPTADO"
                                    ? "Mascota adoptada"
                                    : "Mascota disponible"}
                                </span>
                              </div>

                              <p className="text-sm pt-4 text-black transition-all cursor-auto ">ir a editar a tu mascota {mascota.nombre || mascota.especie}</p>
                            </div>
                          </Link>
                        ) : (
                          <Link
                            to={`/adopt/mis-mascotas/`}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg 
                            transition-all duration-300 hover:-translate-y-1"
                          >
                            <div className="aspect-square overflow-hidden bg-gray-100">
                              <img
                                src={
                                  mascota.imagen_url ||
                                  `https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop`
                                }
                                alt={mascota.nombre}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {mascota.nombre}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {mascota.raza} • {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
                              </p>
                              {mascota.descripcion && (
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {mascota.descripcion}
                                </p>
                              )}
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {mascota.estadoAdopcion === "ADOPTADO"
                                    ? "Mascota adoptada"
                                    : "Mascota disponible"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Dog size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-light text-gray-900 mb-2">
                      {isRefugio
                        ? "Aún no has registrado mascotas"
                        : "Aún no ha adoptado ninguna mascota"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isRefugio
                        ? "Las mascotas que registres aparecerán aquí."
                        : "Cuando adoptes una mascota, aparecerá aquí."}
                    </p>
                    {isRefugio && (
                      <Link
                        to="/admin/mascotas"
                        className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
                      >
                        Registrar mascota
                      </Link>
                    )}
                  </div>
                )}
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