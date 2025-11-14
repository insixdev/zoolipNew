import {
  useLoaderData,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/roleGuards";
import { AnyAdminRole } from "~/components/auth/AdminGuard";
import {
  getAllSolicitudesService,
  completarSolicitudService,
} from "~/features/adoption/adoptionService";
import type { SolicitudAdopcionDTO } from "~/features/adoption/types";
import { useEffect } from "react";

// Action para aprobar/rechazar solicitudes
export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    const formData = await request.formData();
    const id_solicitud = Number(formData.get("id_solicitud"));
    const estado = formData.get("estado") as "APROBADA" | "RECHAZADA";

    console.log(
      `📋 [ADMIN SOLICITUDES] ${estado === "APROBADA" ? "Aprobando" : "Rechazando"} solicitud ${id_solicitud}`
    );

    const result = await completarSolicitudService(
      id_solicitud,
      estado,
      cookie
    );

    return {
      success: true,
      message: `Solicitud ${estado === "APROBADA" ? "aprobada" : "rechazada"} exitosamente`,
      result,
    };
  } catch (error: any) {
    console.error("📋 [ADMIN SOLICITUDES] Error:", error);
    return {
      success: false,
      error: error.message || "Error al procesar solicitud",
    };
  }
}

// Loader
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    console.log("📋 [ADMIN SOLICITUDES] Loading solicitudes...");
    const solicitudes = await getAllSolicitudesService(cookie);
    console.log(
      "📋 [ADMIN SOLICITUDES] Solicitudes loaded:",
      solicitudes.length
    );
    return { solicitudes };
  } catch (error) {
    console.error("📋 [ADMIN SOLICITUDES] Error loading solicitudes:", error);
    return { solicitudes: [] };
  }
}

export default function AdminSolicitudes() {
  const { solicitudes } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // Mostrar mensaje de éxito/error
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        alert(fetcher.data.message);
        // Recargar la página para actualizar la lista
        window.location.reload();
      } else if (fetcher.data.error) {
        alert(`Error: ${fetcher.data.error}`);
      }
    }
  }, [fetcher.data]);

  const handleAprobar = (id_solicitud: number) => {
    if (
      confirm(
        "¿Estás seguro de aprobar esta solicitud? El usuario se convertirá en adoptante."
      )
    ) {
      const formData = new FormData();
      formData.append("id_solicitud", id_solicitud.toString());
      formData.append("estado", "APROBADA");
      fetcher.submit(formData, { method: "post" });
    }
  };

  const handleRechazar = (id_solicitud: number) => {
    if (confirm("¿Estás seguro de rechazar esta solicitud?")) {
      const formData = new FormData();
      formData.append("id_solicitud", id_solicitud.toString());
      formData.append("estado", "RECHAZADA");
      fetcher.submit(formData, { method: "post" });
    }
  };

  const getEstadoColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800",
      aprobada: "bg-green-100 text-green-800",
      aprobado: "bg-green-100 text-green-800",
      rechazada: "bg-red-100 text-red-800",
      rechazado: "bg-red-100 text-red-800",
      completada: "bg-blue-100 text-blue-800",
      completado: "bg-blue-100 text-blue-800",
    };
    return colors[estadoLower] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AnyAdminRole
      fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes acceso a esta sección</p>
        </div>
      }
    >
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Solicitudes de Adopción
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona las solicitudes de adopción de mascotas
          </p>
        </div>

        {/* Tabla simple */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">
                          No hay solicitudes
                        </p>
                        <p className="text-sm mt-2">
                          Las solicitudes de adopción aparecerán aquí
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  solicitudes.map((solicitud) => (
                    <tr
                      key={solicitud.idSolicitudAdopcion}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          #{solicitud.idSolicitudAdopcion}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {solicitud.nombreSolicitante}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {solicitud.nombreSolicitante}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-rose-600">
                          Mascota ID: {solicitud.idMascota}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(solicitud.fecha_inicio)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(solicitud.estadoSolicitud)}`}
                        >
                          {solicitud.estadoSolicitud}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {solicitud.estadoSolicitud === "PENDIENTE" ? (
                          <>
                            <button
                              onClick={() =>
                                handleAprobar(solicitud.idSolicitudAdopcion)
                              }
                              disabled={fetcher.state !== "idle"}
                              className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                              {fetcher.state !== "idle"
                                ? "Procesando..."
                                : "Aprobar"}
                            </button>
                            <button
                              onClick={() =>
                                handleRechazar(solicitud.idSolicitudAdopcion)
                              }
                              disabled={fetcher.state !== "idle"}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                              Rechazar
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500 italic">
                            {solicitud.estadoSolicitud === "APROBADA"
                              ? "Aprobada"
                              : "Rechazada"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {solicitudes.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Nota:</strong> Al aprobar una solicitud, el usuario
              automáticamente se convierte en ADOPTANTE y obtiene acceso a sus
              mascotas adoptadas.
            </p>
          </div>
        )}
      </div>
    </AnyAdminRole>
  );
}
