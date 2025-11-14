import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getAllSolicitudesService } from "~/features/adoption/adoptionService";
import {
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  Calendar,
  User,
} from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") || "";

  try {
    console.log("📋 [USER SOLICITUDES] Loading user solicitudes...");
    const allSolicitudes = await getAllSolicitudesService(cookie);

    // TODO: Filtrar solo las solicitudes del usuario actual
    // Por ahora mostramos todas, pero idealmente el backend debería tener un endpoint
    // para obtener solo las solicitudes del usuario autenticado
    console.log(
      "📋 [USER SOLICITUDES] Solicitudes loaded:",
      allSolicitudes.length
    );

    return { solicitudes: allSolicitudes };
  } catch (error) {
    console.error("📋 [USER SOLICITUDES] Error loading solicitudes:", error);
    return { solicitudes: [] };
  }
}

export default function Solicitudes() {
  const { solicitudes } = useLoaderData<typeof loader>();

  const getStatusConfig = (estado: string) => {
    const estadoUpper = estado?.toUpperCase();
    switch (estadoUpper) {
      case "PENDIENTE":
        return {
          icon: Clock,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          badgeColor: "bg-yellow-500",
          label: "Pendiente",
        };
      case "APROBADA":
      case "APROBADO":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 border-green-200",
          badgeColor: "bg-green-500",
          label: "Aprobada",
        };
      case "RECHAZADA":
      case "RECHAZADO":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800 border-red-200",
          badgeColor: "bg-red-500",
          label: "Rechazada",
        };
      default:
        return {
          icon: Clock,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          badgeColor: "bg-gray-500",
          label: estado || "Desconocido",
        };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Empty state
  if (solicitudes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="text-white" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No tienes solicitudes
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Aún no has solicitado adoptar ninguna mascota. Explora las mascotas
            disponibles y solicita adoptar la que más te guste.
          </p>
          <a
            href="/adopt"
            className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ver mascotas disponibles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mis Solicitudes de Adopción
          </h1>
          <p className="text-white/90 text-lg">
            Revisa el estado de tus solicitudes de adopción
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white font-semibold">
              {solicitudes.length} solicitud
              {solicitudes.length !== 1 ? "es" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Solicitudes List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {solicitudes.map((solicitud, index) => {
            const statusConfig = getStatusConfig(solicitud.estado);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={solicitud.idSolicitudAdopcion}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    {/* Solicitud Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Solicitud #{solicitud.idSolicitudAdopcion}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border-2 ${statusConfig.color}`}
                        >
                          <StatusIcon size={16} />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-orange-500" />
                          <span>
                            <span className="font-medium">Solicitante:</span>{" "}
                            {solicitud.nombreSolicitante}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart size={16} className="text-pink-500" />
                          <span>
                            <span className="font-medium">Mascota ID:</span>{" "}
                            {solicitud.idMascota}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-purple-500" />
                          <span>
                            <span className="font-medium">
                              Fecha de inicio:
                            </span>{" "}
                            {formatDate(solicitud.fecha_inicio)}
                          </span>
                        </div>
                        {solicitud.fecha_finalizado && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-500" />
                            <span>
                              <span className="font-medium">
                                Fecha finalizada:
                              </span>{" "}
                              {formatDate(solicitud.fecha_finalizado)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${statusConfig.badgeColor} animate-pulse`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="bg-gray-50 px-6 py-4">
                  {solicitud.estadoSolicitud?.toUpperCase() === "PENDIENTE" && (
                    <p className="text-sm text-gray-600">
                      ⏳ Tu solicitud está siendo revisada. Te notificaremos
                      cuando haya una respuesta.
                    </p>
                  )}
                  {solicitud.estadoSolicitud?.toUpperCase() === "APROBADA" && (
                    <p className="text-sm text-green-700 font-medium">
                      ✅ ¡Felicidades! Tu solicitud fue aprobada. Pronto podrás
                      conocer a tu nueva mascota.
                    </p>
                  )}
                  {solicitud.estadoSolicitud?.toUpperCase() === "RECHAZADA" && (
                    <p className="text-sm text-red-700">
                      ❌ Lo sentimos, tu solicitud no fue aprobada. Puedes
                      solicitar adoptar otra mascota.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
