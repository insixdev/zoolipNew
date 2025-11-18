import {
  useLoaderData,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/roleGuards";
import { AnyAdminRole } from "~/components/auth/AdminGuard";
import {
  getAllCurrentSolicitudesService,
  completarSolicitudService,
} from "~/features/adoption/adoptionService";
import type { SolicitudAdopcionDTO } from "~/features/adoption/types";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

// Action para completar adopción
export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    const formData = await request.formData();
    const id_solicitud_adopcion = Number(formData.get("id_solicitud"));
    const estadoSolicitud = formData.get("estadoSolicitud") as
      | "APROBADO"
      | "RECHAZADO";
    const motivo_decision = formData.get("motivo_decision") as string;

    console.log("ADMIN SOLICITUDES] Completando solicitud:", {
      id_solicitud_adopcion,
      estadoSolicitud,
      motivo_decision,
    });

    const result = await completarSolicitudService(
      id_solicitud_adopcion,
      estadoSolicitud,
      motivo_decision,
      cookie
    );

    return {
      success: true,
      message: `Solicitud ${estadoSolicitud.toLowerCase()} exitosamente`,
      result,
    };
  } catch (error: any) {
    console.error("[ADMIN SOLICITUDES] Error:", error);
    return {
      success: false,
      error: error.message || "Error al completar adopción",
    };
  }
}

// Loader
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    const solicitudes = await getAllCurrentSolicitudesService(cookie);

    console.log("[ADMIN SOLICITUDES] Solicitudes loaded:", solicitudes);
    return { solicitudes };
  } catch (error) {
    console.error("[ADMIN SOLICITUDES] Error loading solicitudes:", error);
    return { solicitudes: [] };
  }
}

export default function AdminSolicitudes() {
  const { solicitudes } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    id_solicitud: number;
    estado: "APROBADO" | "RECHAZADO";
    titulo: string;
  } | null>(null);
  const [motivo, setMotivo] = useState("");

  // Mostrar mensaje de éxito/error
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        alert(fetcher.data.message);
        setShowModal(false);
        setMotivo("");
        // Recargar la página para actualizar la lista
        window.location.reload();
      } else if (fetcher.data.error) {
        alert(`Error: ${fetcher.data.error}`);
      }
    }
  }, [fetcher.data]);

  const handleOpenModal = (
    id_solicitud: number,
    estado: "APROBADO" | "RECHAZADO"
  ) => {
    setModalData({
      id_solicitud,
      estado,
      titulo:
        estado === "APROBADO" ? "Aprobar Solicitud" : "Rechazar Solicitud",
    });
    setShowModal(true);
    setMotivo("");
  };

  const handleSubmitDecision = () => {
    if (!modalData) return;

    if (!motivo.trim()) {
      alert("Por favor ingresa un motivo para la decisión");
      return;
    }

    const formData = new FormData();
    formData.append("id_solicitud", modalData.id_solicitud.toString());
    formData.append("estadoSolicitud", modalData.estado);
    formData.append("motivo_decision", motivo);
    fetcher.submit(formData, { method: "post" });
  };

  const getEstadoColor = (estado: string) => {
    const estadoLower = estado?.toLowerCase() || "";
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-800",
      solicitada: "bg-orange-100 text-orange-800",
      solicitado: "bg-orange-100 text-orange-800",
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
                    Nombre Solicitante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Razón Solicitud
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
                        <div className="text-sm font-medium text-gray-900">
                          {solicitud.nombreSolicitante}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-rose-600">
                          Mascota ID: {solicitud.idMascota}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm text-gray-900">
                          {solicitud.razonSolicitud? (
                            <div className="group relative">
                              <p className="line-clamp-2 text-gray-700">
                                {solicitud.razonSolicitud}
                              </p>
                              {solicitud?.razonSolicitud.length > 60 && (
                                <div className="hidden group-hover:block absolute z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -top-2 left-0 transform -translate-y-full">
                                  {solicitud.razonSolicitud}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">
                              Sin razón
                            </span>
                          )}
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
                        {solicitud.estadoSolicitud?.toUpperCase() ===
                          "SOLICITADA" ||
                        solicitud.estadoSolicitud?.toUpperCase() ===
                          "SOLICITADO" ||
                        solicitud.estadoSolicitud?.toUpperCase() ===
                          "PENDIENTE" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleOpenModal(
                                  solicitud.idSolicitudAdopcion,
                                  "APROBADO"
                                )
                              }
                              disabled={fetcher.state !== "idle"}
                              className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                            >
                              <CheckCircle size={16} />
                              Aprobar
                            </button>
                            <button
                              onClick={() =>
                                handleOpenModal(
                                  solicitud.idSolicitudAdopcion,
                                  "RECHAZADO"
                                )
                              }
                              disabled={fetcher.state !== "idle"}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                            >
                              <XCircle size={16} />
                              Rechazar
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">
                            Procesada
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

        {/* Modal para motivo de decisión */}
        {showModal && modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-[slideUp_0.3s_ease-out]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalData.titulo}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                      modalData.estado === "APROBADO"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {modalData.estado === "APROBADO" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                    <span className="font-semibold">
                      Solicitud #{modalData.id_solicitud}
                    </span>
                  </div>
                </div>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Motivo de la decisión
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder={
                    modalData.estado === "APROBADO"
                      ? "Ej: El solicitante cumple con todos los requisitos..."
                      : "Ej: No cumple con los requisitos de espacio..."
                  }
                  className="w-full text-black px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none resize-none"
                  rows={4}
                  disabled={fetcher.state !== "idle"}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Este motivo será enviado al usuario por correo electrónico
                </p>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={fetcher.state !== "idle"}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitDecision}
                  disabled={fetcher.state !== "idle" || !motivo.trim()}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    modalData.estado === "APROBADO"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {fetcher.state !== "idle"
                    ? "Procesando..."
                    : modalData.estado === "APROBADO"
                      ? "Aprobar Solicitud"
                      : "Rechazar Solicitud"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnyAdminRole>
  );
}
