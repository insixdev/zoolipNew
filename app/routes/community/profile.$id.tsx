import { LoaderFunctionArgs, useLoaderData, Link } from "react-router";
import {
  getUserByIdService,
  
} from "~/features/user/userService";
import type { UserGetResponse } from "~/features/user/types";
import { getUserFieldFromCookie, field } from "~/lib/authUtil";
import { Settings, Grid, Bookmark, Heart, Dog } from "lucide-react";
import { useState } from "react";
import { getMascotasByInstitucionService } from "~/features/adoption/adoptionService";
import type { MascotaDTO } from "~/features/adoption/types";
import { ADMIN_ROLES, USER_ROLES } from "~/lib/constants";
import { getPublicationsByUserService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse"; 
import type { Post } from "~/components/community/indexCommunity/PostCard";
import { getInstitutionByIdUsuarioService } from "~/features/entities/institucion/institutionService";

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
     let isOwnProfile: boolean = false;
     if(currentUserId === null){
       isOwnProfile = false
       
     }else {
       isOwnProfile = currentUserId === Number(userId);
     }

     // Obtener los datos del usuario desde el backend usando el endpoint público
     let user: UserGetResponse;
     try {
       const userData = await getUserByIdService(parseInt(userId), cookie);
       
       // Validar que la respuesta sea un usuario válido y no un error
       if (!userData || typeof userData !== 'object' || 'message' in userData) {
         throw new Response("Usuario no encontrado", { status: 404 });
       }
       
       user = userData;
     } catch (error) {
       throw new Response("Usuario no encontrado", { status: 404 });
     }

     // Si el usuario es un refugio, cargar sus mascotas
    let mascotas: MascotaDTO[] = [];
    let isCurrentRefuge: boolean = false

    let isRole: string | null;

    const rol = user.rol;

    if(rol == "ROLE_ADMINISTRADOR"){
      isRole = "ADMIN" 

    } else if(rol == "ROLE_ADOPTANTE"){
      isRole = "ADOPTANTE" 
    } else if(rol == "ROLE_USER"){
      isRole = null;
    } else {
      isRole = null 
    }

    if (rol === "ROLE_ADMINISTRADOR") {
      const institutionId = await getInstitutionByIdUsuarioService(user.id, cookie);

      try {
        mascotas = await getMascotasByInstitucionService(
          institutionId.id_institucion,
          cookie
        );
        console.log("SUCIAS",mascotas);
      } catch (error) {
        // No fallar si no se pueden cargar las mascotas
      }
    }
    // Si es adoptante y es su propio perfil, cargar sus mascotas adoptadas
    else if (isOwnProfile && user.rol === "ROLE_ADOPTANTE") {
      try {
        const { getMisMascotasService } = await import(
          "~/features/adoption/adoptionService"
        );
        mascotas = await getMisMascotasService(cookie);

        console.log("MIS SUCIAS",mascotas);
      } catch (error) {
        // No fallar si no se pueden cargar las mascotas
      }
    }

    // Obtener las publicaciones del usuario
    let allUserPosts: Post[] = [];
    try {
      const publicationsFromBackend = await getPublicationsByUserService(
        parseInt(userId),
        cookie
      );

      // Parsear las publicaciones al formato del frontend
      allUserPosts = postParseResponse(publicationsFromBackend);
    } catch (error) {
      // No fallar si no se pueden cargar las publicaciones
    }

    // Separar publicaciones y consultas
    const userPosts = allUserPosts.filter(
      (post) => post.publicationType === "PUBLICACION"
    );
    const userConsultas = allUserPosts.filter(
      (post) => post.publicationType === "CONSULTA"
    );

    return {isRole, user, isOwnProfile, mascotas, userPosts, userConsultas };
  } catch (err) {
    throw new Response("Error al cargar perfil", { status: 500 });
  }
}

export default function UserProfile() {
   const { user, isOwnProfile,  mascotas, userPosts, userConsultas, isRole} =
     useLoaderData<{
       user: UserGetResponse;
       isOwnProfile: boolean;
       mascotas: MascotaDTO[];
       userPosts: Post[];
       userConsultas: Post[];
       isRole:string | null; 
     }>();

  const [activeTab, setActiveTab] = useState<
    "posts" | "consultas" | "saved" | "mascotas"
  >("posts");

  // Número de publicaciones y consultas del usuario
  const publicaciones = userPosts?.length || 0;
  const consultas = userConsultas?.length || 0;

  // Verificar si es un refugio o adoptante
  const isAdoptante = isRole === "ADOPTANTE"; 
  const isRefugio = isRole === "ADMIN";

  const showMascotas = isRefugio || (isAdoptante && isOwnProfile);

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
                  <div className="text-center">
                    <span className="block text-lg font-semibold text-gray-900">
                      {consultas}
                    </span>
                    <span className="text-sm text-gray-600">consultas</span>
                  </div>
                  {showMascotas && (
                    <div className="text-center">
                      <span className="block text-lg font-semibold text-gray-900">
                        {mascotas?.length || 0}
                      </span>
                      <span className="text-sm text-gray-600">
                        {isRole ? "mascotas" : "adoptadas"}
                      </span>
                    </div>
                  )}
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
                      📍{" "}
                      <span suppressHydrationWarning>
                        {new Date(user.nombre).toLocaleDateString(
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
                             src={user.imagen_url || `https://i.pravatar.cc/48?u=${user.nombre}`}
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
                      {isOwnProfile
                        ? "Comparte tus publicaciones"
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
                           <img
                             src={user.imagen_url || `https://i.pravatar.cc/48?u=${user.nombre}`}
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
                      {isOwnProfile
                        ? "Haz tus primeras consultas"
                        : "Sin consultas aún"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isOwnProfile
                        ? "Cuando hagas preguntas, aparecerán en tu perfil."
                        : "Las consultas aparecerán aquí."}
                    </p>
                    {isOwnProfile && (
                      <Link
                        to="/community/consultas"
                        className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        Haz tu primera consulta
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

            {activeTab === "mascotas" && showMascotas && (
              <div>
                {mascotas && mascotas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mascotas.map((mascota) => (
                      <div key={mascota.id}>
                        {isRefugio && isOwnProfile ? (

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
                            to={`/adopt/mascota/${mascota.id_Mascota}`}
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
                        ? isOwnProfile
                          ? "Aún no has registrado mascotas"
                          : "Este refugio no tiene mascotas registradas"
                        : "Aún no ha adoptado ninguna mascota"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isRefugio
                        ? isOwnProfile
                          ? "Las mascotas que registres aparecerán aquí."
                          : "Las mascotas disponibles aparecerán aquí."
                        : "Cuando adoptes una mascota, aparecerá aquí."}
                    </p>
                    {isOwnProfile && (
                      <Link
                        to={isRefugio ? "/admin/mascotas" : "/adopt"}
                        className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
                      >
                        {isRefugio ? "Registrar mascota" : "Explorar mascotas"}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
