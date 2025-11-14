import React, { useState } from "react";
import {
  useFetcher,
  Link,
  useLoaderData,
  type LoaderFunction,
} from "react-router";
import {
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { AdministradorOnly } from "~/components/auth/AdminGuard";

type InstitutionRequest = {
  id: string;
  nombreInstitucion: string;
  contacto: string;
  telefono: string;
  mensaje?: string;
  submittedAt: string;
  status?: "pending" | "accepted" | "rejected";
};

// loader (server-side) traerá las solicitudes reales
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("cookie");
    if (!cookie) return [];
    const { getAllInstitutionSolicitudesService } = await import(
      "~/features/entities/institucion/institutionSolicitudService"
    );
    const data = await getAllInstitutionSolicitudesService(cookie);
    console.log("requestsdataa", data);
    return data;
  } catch (err) {
    console.error("Loader institutionSolicitudes error:", err);
    return [];
  }
};

// Action para aceptar/rechazar solicitudes
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return Response.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  const id = formData.get("id");
  const actionType = formData.get("action");

  console.log("📋 [INSTITUTION ACTION] Processing:", { id, actionType });

  try {
    // Obtener la solicitud del loader data para tener email y nombre
    const { getAllInstitutionSolicitudesService } = await import(
      "~/features/entities/institucion/institutionSolicitudService"
    );
    const solicitudes = await getAllInstitutionSolicitudesService(cookieHeader);
    const solicitud = solicitudes.find(
      (s: any) => String(s.idSolicitud) === String(id)
    );

    if (!solicitud) {
      return Response.json(
        { success: false, error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    if (actionType === "accept") {
      console.log("✅ Aceptando solicitud:", id);

      // 1. Generar token de invitación
      const { addInvite } = await import(
        "~/features/admin/adminRegisterInvitation"
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días

      // Determinar el tipo basado en tipoSolicitud
      const tipo =
        solicitud.tipoSolicitud === "REFUGIO"
          ? "ROLE_REFUGIO"
          : "ROLE_VETERINARIA";

      const token = addInvite(
        solicitud.emailContacto,
        tipo,
        expiresAt.getTime()
      );

      // 2. Generar link de invitación
      const inviteLink = `${new URL(request.url).origin}/admin-register/invite/${token}`;

      console.log("🔗 Link de invitación generado:", inviteLink);

      // 3. Enviar email con el link
      const { solicitudAceptadaConInvitacionEmail } = await import(
        "~/features/solicitudes/solicitudesEmail"
      );
      const emailResult = await solicitudAceptadaConInvitacionEmail(
        solicitud.emailContacto,
        solicitud.nombreInstitucion,
        inviteLink
      );

      console.log("📧 Resultado del email:", emailResult);

      // 4. TODO: Actualizar estado en el backend si tienes endpoint
      // await updateInstitutionSolicitudStatus(id, "ACEPTADA", cookieHeader);

      return Response.json({
        success: true,
        message: "Solicitud aceptada y email enviado correctamente",
        inviteLink,
      });
    } else if (actionType === "reject") {
      console.log("❌ Rechazando solicitud:", id);

      // 1. Enviar email de rechazo
      const { solicitudRechazadaEmail } = await import(
        "~/features/solicitudes/solicitudesEmail"
      );
      const emailResult = await solicitudRechazadaEmail(
        solicitud.emailContacto,
        solicitud.nombreInstitucion
      );

      console.log("📧 Resultado del email:", emailResult);

      // 2. TODO: Actualizar estado en el backend si tienes endpoint
      // await updateInstitutionSolicitudStatus(id, "RECHAZADA", cookieHeader);

      return Response.json({
        success: true,
        message: "Solicitud rechazada y email enviado correctamente",
      });
    }

    return Response.json({ success: false, error: "Acción no válida" });
  } catch (error: any) {
    console.error("❌ Error procesando solicitud:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Error al procesar solicitud",
      },
      { status: 500 }
    );
  }
}

export default function InstitutionSolicitudes() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData() as any[];
  const [requests, setRequests] = useState<InstitutionRequest[]>(
    loaderData && loaderData.length
      ? loaderData.map((d: any) => ({
          id: String(d.idSolicitud || d.id_solicitud || d.id || ""),
          nombreInstitucion: d.nombreInstitucion || d.nombre_institucion || "-",
          contacto: d.emailContacto || d.email_contacto || "-",
          telefono: d.telefonoContacto || d.telefono_contacto || "-",
          mensaje: d.razonSolicitud || d.razon_solicitud || "",
          submittedAt:
            d.fecha_creacion || d.submittedAt || new Date().toISOString(),
          status: (d.estadoSolicitud || d.estado || "SOLICITADA").toLowerCase(),
        }))
      : []
  );
  const [selectedAction, setSelectedAction] = useState<
    Record<string, "accept" | "reject" | "">
  >({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getTypeIcon = (nombre: string) => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes("refugio")) return "R";
    if (nombreLower.includes("veterinaria")) return "V";
    return "I";
  };

  const handleChangeAction = (id: string, value: string) => {
    setSelectedAction((s) => ({ ...s, [id]: (value as any) || "" }));
  };

  const handleApply = async (req: InstitutionRequest) => {
    const action = selectedAction[req.id];
    if (!action) return;

    // optional confirmation for reject
    if (action === "reject") {
      const ok = window.confirm(
        `¿Confirma que desea RECHAZAR la solicitud de ${req.nombreInstitucion}?`
      );
      if (!ok) return;
    }

    setProcessing((p) => ({ ...p, [req.id]: true }));

    // Optimistic UI update: remove from list or mark status
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: action === "accept" ? "accepted" : "rejected" }
          : r
      )
    );

    // Submit to server (endpoint must exist). We use fetcher to follow project patterns.
    const form = new FormData();
    form.append("id", req.id);
    form.append("action", action);

    try {
      // Usar el action de la misma página
      fetcher.submit(form, {
        method: "post",
      });

      // simulate server response delay briefly (UI-friendly). If the API returns an error,
      // you'd handle it by reverting the optimistic change. Here we assume success.
      setTimeout(() => {
        setProcessing((p) => ({ ...p, [req.id]: false }));
      }, 600);
    } catch (err) {
      // revert on error
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "pending" } : r))
      );
      setProcessing((p) => ({ ...p, [req.id]: false }));
      alert("Error al procesar la solicitud. Intenta nuevamente.");
    }
  };

  const handleRemove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AdministradorOnly
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Acceso denegado
            </h1>
            <p className="text-gray-600">
              Solo administradores pueden ver esta sección
            </p>
            <p className="text-gray-600">
              <Link to="/" className="text-rose-500">
                Volver al inicio
              </Link>
            </p>
          </div>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Header mejorado */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Solicitudes de Instituciones
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona las solicitudes de refugios y veterinarias
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                ← Volver
              </button>
              <a
                href="/admin/system"
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium shadow-sm"
              >
                Ir a Sistema
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-2xl font-bold text-gray-900">
                {requests.length}
              </span>
              <span className="text-sm text-gray-600 ml-2">Total</span>
            </div>
            <div className="bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-200 shadow-sm">
              <span className="text-2xl font-bold text-yellow-800">
                {
                  requests.filter(
                    (r) => r.status === "solicitada" || r.status === "pending"
                  ).length
                }
              </span>
              <span className="text-sm text-yellow-700 ml-2">Pendientes</span>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200 shadow-sm">
              <span className="text-2xl font-bold text-green-800">
                {
                  requests.filter(
                    (r) => r.status === "aceptada" || r.status === "accepted"
                  ).length
                }
              </span>
              <span className="text-sm text-green-700 ml-2">Aceptadas</span>
            </div>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-2xl bg-white">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBuilding className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-600 text-lg">
              No hay solicitudes registradas
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* Header con icono y nombre */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-md">
                        {getTypeIcon(req.nombreInstitucion)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {req.nombreInstitucion}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{formatDate(req.submittedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-rose-400" />
                        <span className="font-medium">Email:</span>
                        <span>{req.contacto}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-rose-400" />
                        <span className="font-medium">Teléfono:</span>
                        <span>{req.telefono}</span>
                      </div>
                      {req.mensaje && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Razón de solicitud:
                          </p>
                          <p className="text-sm text-gray-600">{req.mensaje}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-44 flex flex-col items-end gap-2">
                    <div className="w-full">
                      <label className="block text-xs text-gray-900 font-medium mb-1">
                        Acción
                      </label>
                      <select
                        value={selectedAction[req.id] ?? ""}
                        onChange={(e) =>
                          handleChangeAction(req.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md text-gray-900"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="accept">Aceptar</option>
                        <option value="reject">Rechazar</option>
                      </select>
                    </div>

                    <div className="w-full flex gap-2">
                      <button
                        onClick={() => handleApply(req)}
                        disabled={!selectedAction[req.id] || processing[req.id]}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50"
                      >
                        {processing[req.id] ? (
                          <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                        ) : selectedAction[req.id] === "accept" ? (
                          <>
                            <FaCheck /> Aceptar
                          </>
                        ) : (
                          <>
                            <FaTimes /> Rechazar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdministradorOnly>
  );
}
