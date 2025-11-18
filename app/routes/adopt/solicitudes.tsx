import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getSolicitudesCurrentUserService } from "~/features/adoption/adoptionService";
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
    console.log("[USER SOLICITUDES] Loading user solicitudes...");
    const allSolicitudes = await getSolicitudesCurrentUserService(cookie);

    // TODO: Filtrar solo las solicitudes del usuario actual
    // Por ahora mostramos todas, pero idealmente el backend debería tener un endpoint
    // para obtener solo las solicitudes del usuario autenticado
    console.log("USER SOLICITUDES] Solicitudes loaded:", allSolicitudes.length);

    return { solicitudes: allSolicitudes };
  } catch (error) {
    console.error("[USER SOLICITUDES] Error loading solicitudes:", error);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:ml-64">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white border-2 border-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="text-gray-900" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No tienes solicitudes
          </h2>
          <p className="text-gray-600 text-base mb-8">
            Aún no has solicitado adoptar ninguna mascota. Explora las mascotas
            disponibles y solicita adoptar la que más te guste.
          </p>
          <a
            href="/adopt"
            className="inline-block bg-orange-500 text-white py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors font-medium border-2 border-gray-900"
          >
            Ver mascotas disponibles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Minimalista con animaciones */}
      <div className="md:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="relative bg-white rounded-2xl border-2 border-orange-200 overflow-hidden">
            {/* Patrón de fondo animado */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYjkyM2MiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] animate-pulse"></div>
            </div>

            <div className="relative px-6 py-10 md:px-12 md:py-14">
              <div className="text-center">
                {/* Badge animado */}
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg mb-6 border-2 border-orange-200 animate-[slideDown_0.6s_ease-out]">
                  <Heart className="animate-pulse" size={18} />
                  <span className="text-sm font-semibold">
                    {solicitudes.length} solicitud
                    {solicitudes.length !== 1 ? "es" : ""}
                  </span>
                </div>

                {/* Título con animación de entrada */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-[slideUp_0.8s_ease-out]">
                  Mis Solicitudes de Adopción
                </h1>

                {/* Descripción con animación */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-[fadeIn_1s_ease-out]">
                  Revisa el estado de tus solicitudes de adopción
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solicitudes Grid - Ajustado para sidebar */}
      <div className="md:ml-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solicitudes.map((solicitud, index) => {
              const statusConfig = getStatusConfig(solicitud.estadoSolicitud);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={solicitud.idSolicitudAdopcion}
                  className="group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all duration-300">
                    {/* Header con estado */}
                    <div className="relative h-32 bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-gray-200">
                          <Heart className="text-orange-500" size={28} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          Solicitud #{solicitud.idSolicitudAdopcion}
                        </span>
                      </div>

                      {/* Badge de estado */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm ${statusConfig.color}`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Info Grid */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <User
                            size={16}
                            className="text-orange-400 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs text-gray-500">Mascota ID</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {solicitud.idMascota}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar
                            size={16}
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs text-gray-500">Fecha</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {formatDate(solicitud.fecha_inicio)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mensaje de estado */}
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          {solicitud.estadoSolicitud?.toUpperCase() ===
                            "SOLICITADA" && (
                            <p className="text-sm text-gray-600">
                              ⏳ En revisión
                            </p>
                          )}
                          {solicitud.estadoSolicitud?.toUpperCase() ===
                            "APROBADO" && (
                            <p className="text-sm text-green-700 font-medium">
                              ✓ Aprobada
                            </p>
                          )}
                          {solicitud.estadoSolicitud?.toUpperCase() ===
                            "RECHAZADO" && (
                            <p className="text-sm text-red-700">✗ Rechazada</p>
                          )}
                        </div>

                        {/* Tu razón de solicitud */}
                        {solicitud.razon_solicitud && (
                          <div className="p-3 rounded-lg border-2 bg-blue-50 border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Tu razón de solicitud:
                            </p>
                            <p className="text-sm text-blue-800">
                              {solicitud.razon_solicitud}
                            </p>
                          </div>
                        )}

                        {/* Motivo de decisión del admin */}
                        {solicitud.motivoDecision&& (
                          <div
                            className={`p-3 rounded-lg border-2 ${
                              solicitud.estadoSolicitud?.toUpperCase() ===
                              "APROBADO"
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                            }`}
                          >
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Respuesta del administrador:
                            </p>
                            <p
                              className={`text-sm ${
                                solicitud.estadoSolicitud?.toUpperCase() ===
                                "APROBADO"
                                  ? "text-green-800"
                                  : "text-red-800"
                              }`}
                            >
                              {solicitud.motivoDecision}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
