import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaPaw,
  FaHeart,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import { getInstitutionByIdService } from "~/features/entities/institucion/institutionService";
import { getMascotasByInstitucionService } from "~/features/adoption/adoptionService";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const institutionId = params.id;
  const cookieHeader = request.headers.get("Cookie") || "";

  if (!institutionId) {
    throw new Response("ID de institución no proporcionado", { status: 400 });
  }

  try {
    console.log("[REFUGIO] Loading institution ID:", institutionId);

    // Cargar institución
    const institution = await getInstitutionByIdService(
      Number(institutionId),
      cookieHeader
    );

    console.log("[REFUGIO] Institution loaded:", institution);

    // Cargar administrador de la institución
    let adminUser = null;
    try {
      const { getUserByInstitutionIdService } = await import(
        "~/features/user/userService"
      );
      adminUser = await getUserByInstitutionIdService(
        Number(institutionId),
        cookieHeader
      );
      console.log("[REFUGIO] Admin user loaded:", adminUser);
    } catch (adminError) {
      console.warn("[REFUGIO] Error loading admin user:", adminError);
    }

    // Cargar mascotas (si falla, devolver array vacío)
    let mascotas = [];
    try {
      mascotas = await getMascotasByInstitucionService(
        Number(institutionId),
        cookieHeader
      );
      console.log("[REFUGIO] Mascotas loaded:", mascotas.length);
    } catch (mascotasError) {
      console.warn("[REFUGIO] Error loading mascotas:", mascotasError);
      // No lanzar error, solo devolver array vacío
    }

    return { institution, mascotas, adminUser };
  } catch (error) {
    console.error("[REFUGIO] Error loading institution:", error);
    throw new Response("Institución no encontrada", { status: 404 });
  }
}

export default function RefugioDetails() {
  const { institution, mascotas, adminUser } = useLoaderData<typeof loader>();
  const { user } = useSmartAuth();

  // Función para abrir el chat
  const handleOpenChat = () => {
    const currentUserName = user?.username || "Usuario";
    // Usar el nombre del administrador del DTO
    const adminName = adminUser?.nombre || "Admin";
    const nombreChat = `${currentUserName}_${adminName}`;

    console.log("[REFUGIO] Abriendo chat:", {
      currentUserName,
      adminName,
      adminUser,
      nombreChat,
    });

    if (!adminUser || !adminUser.nombre) {
      alert(
        "Error: No se pudo obtener el administrador del refugio. Por favor, intenta de nuevo."
      );
      return;
    }

    // Redirigir a la página de chat de adopt con los parámetros
    window.location.href = `/adopt/chatAdopt?Nombre_Chat=${encodeURIComponent(nombreChat)}&Nombre=${encodeURIComponent(currentUserName)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/community/refugios"
            className="inline-flex items-center text-rose-600 hover:text-rose-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Volver a refugios
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                className="h-32 w-32 rounded-full ring-4 ring-white"
                src={institution.imagen_url || institution.imagenUrl || ""}
                alt={institution.nombre}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {institution.nombre}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verificado
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                {institution.descripcion || "Sin descripción disponible"}
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FaEnvelope className="mr-1.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                  {institution.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                  {institution.horario_Inicio} - {institution.horario_Fin}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sobre nosotros
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>{institution.descripcion || "Sin descripción disponible"}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <FaHome className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Tipo</p>
                      <p className="text-sm text-gray-500">
                        {institution.tipo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <FaPaw className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Horario
                      </p>
                      <p className="text-sm text-gray-500">
                        {institution.horario_Inicio} - {institution.horario_Fin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Pets Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Mascotas disponibles para adopción
              </h2>
              {mascotas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaPaw className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>No hay mascotas disponibles en este momento</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mascotas.map((mascota) => {
                    const mascotaId =
                      mascota.id || mascota.id_mascota || mascota.id_Mascota;

                    return (
                      <Link
                        key={mascotaId}
                        to={`/adopt/mascota/${mascotaId}`}
                        className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                          <img
                            src={
                              mascota.imagen_url ||
                              "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
                            }
                            alt={mascota.nombre}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-medium border border-green-200 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Disponible
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {mascota.nombre || mascota.especie || "Mascota"}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                mascota.sexo?.toUpperCase() === "MACHO" ||
                                mascota.sexo?.toUpperCase() === "M"
                                  ? "bg-blue-100 text-blue-800"
                                  : mascota.sexo?.toUpperCase() === "HEMBRA" ||
                                      mascota.sexo?.toUpperCase() === "F"
                                    ? "bg-pink-100 text-pink-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {mascota.sexo?.toUpperCase() === "M"
                                ? "Macho"
                                : mascota.sexo?.toUpperCase() === "F"
                                  ? "Hembra"
                                  : mascota.sexo || "Sin especificar"}
                            </span>
                          </div>
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>
                                {mascota.edad !== undefined &&
                                mascota.edad !== null
                                  ? `${mascota.edad} ${mascota.edad === 1 ? "año" : "años"}`
                                  : "Edad no especificada"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{mascota.raza || "Raza mixta"}</span>
                            </div>
                            {mascota.tamanio && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Tamaño: {mascota.tamanio}</span>
                              </div>
                            )}
                            {mascota.estadoSalud && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{mascota.estadoSalud}</span>
                              </div>
                            )}
                          </div>
                          {mascota.descripcion && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2 mb-3">
                              {mascota.descripcion}
                            </p>
                          )}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-orange-600 font-medium group-hover:text-orange-700">
                                Ver detalles
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href={`mailto:${institution.email}`}
                      className="text-sm text-rose-600 hover:text-rose-800"
                    >
                      {institution.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaClock className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Horario de atención
                    </p>
                    <p className="text-sm text-gray-500">
                      {institution.horario_Inicio} - {institution.horario_Fin}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <a
                  href={`mailto:${institution.email}`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Enviar Email
                </a>
                <button
                  onClick={handleOpenChat}
                  className="w-full flex justify-center py-2 px-4 border-2 border-rose-600 rounded-md shadow-sm text-sm font-medium text-rose-600 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Enviar Mensaje
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Información
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      Tipo de institución
                    </span>
                    <span className="font-semibold text-rose-600">
                      {institution.tipo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
