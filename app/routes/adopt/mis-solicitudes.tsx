import { useLoaderData, Link, type LoaderFunctionArgs } from "react-router";
import { Clock, CheckCircle, XCircle, Heart, ArrowLeft } from "lucide-react";
import { getSolicitudesCurrentUserService } from "~/features/adoption/adoptionService";
import { requireAuth } from "~/lib/authGuard";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    const solicitudes = await getSolicitudesCurrentUserService(cookie);
    return { solicitudes };
  } catch (error) {
    return { solicitudes: [] };
  }
}

export default function MisSolicitudes() {
  const { solicitudes } = useLoaderData<typeof loader>();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "ACEPTADA":
        return "bg-green-100 text-green-700 border-green-200";
      case "RECHAZADA":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return <Clock size={20} />;
      case "ACEPTADA":
        return <CheckCircle size={20} />;
      case "RECHAZADA":
        return <XCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/adopt"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a adopciones
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mis Solicitudes de Adopción
          </h1>
          <p className="text-gray-600">
            Aquí puedes ver el estado de todas tus solicitudes
          </p>
        </div>

        {solicitudes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No tienes solicitudes aún
            </h2>
            <p className="text-gray-600 mb-8">
              Explora nuestras mascotas disponibles y encuentra a tu nuevo mejor
              amigo
            </p>
            <Link
              to="/adopt"
              className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-8 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Ver mascotas disponibles
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {solicitudes.map((solicitud) => (
              <div
                key={solicitud.id_solicitud_adopcion}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Imagen de la mascota */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          solicitud.mascota?.imagen_url ||
                          "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=200&h=200&fit=crop"
                        }
                        alt={solicitud.mascota?.nombre}
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {solicitud.mascota?.nombre}
                          </h3>
                          <p className="text-gray-600">
                            {solicitud.mascota?.raza} •{" "}
                            {solicitud.mascota?.edad}{" "}
                            {solicitud.mascota?.edad === 1 ? "año" : "años"}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getEstadoColor(
                            solicitud.estadoSolicitud
                          )}`}
                        >
                          {getEstadoIcon(solicitud.estadoSolicitud)}
                          <span className="font-semibold">
                            {solicitud.estadoSolicitud}
                          </span>
                        </div>
                      </div>

                      {solicitud.razon && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Tu mensaje:
                          </p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {solicitud.razon}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">
                            Fecha de solicitud:
                          </span>{" "}
                          {new Date(solicitud.fecha_inicio).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        {solicitud.fecha_finalizado && (
                          <div>
                            <span className="font-medium">
                              Fecha de respuesta:
                            </span>{" "}
                            {new Date(
                              solicitud.fecha_finalizado
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
