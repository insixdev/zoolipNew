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

  const actionType = formData.get("_action");
  const solicitudId = formData.get("solicitudId");

  try {
    if (actionType === "accept") {
      // Aquí llamarías al servicio para aceptar la solicitud
      console.log("Aceptando solicitud:", solicitudId);

      // Ejemplo de llamada al backend
      const response = await fetch(
        `http://localhost:3050/api/institucion/solicitud/${solicitudId}/aceptar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al aceptar solicitud");
      }

      return Response.json({
        success: true,
        message: "Solicitud aceptada correctamente",
      });
    } else if (actionType === "reject") {
      // Aquí llamarías al servicio para rechazar la solicitud
      console.log("Rechazando solicitud:", solicitudId);

      const response = await fetch(
        `http://localhost:3050/api/institucion/solicitud/${solicitudId}/rechazar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al rechazar solicitud");
      }

      return Response.json({
        success: true,
        message: "Solicitud rechazada correctamente",
      });
    }

    return Response.json({ success: false, error: "Acción no válida" });
  } catch (error) {
    console.error("Error procesando solicitud:", error);
    return Response.json(
      { success: false, error: "Error al procesar solicitud" },
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
          id: String(d.id_solicitud || d.id || d._id || ""),
          nombreInstitucion: d.nombre_institucion || d.nombre || "-",
          contacto: d.email_contacto || d.contacto || "-",
          telefono: d.telefono_contacto || d.telefono || "-",
          mensaje: d.razon_solicitud || d.mensaje || "",
          submittedAt: d.fecha_creacion || d.submittedAt || "-",
          status: (d.estado || d.status || "PENDIENTE").toLowerCase(),
        }))
      : []
  );
  const [selectedAction, setSelectedAction] = useState<
    Record<string, "accept" | "reject" | "">
  >({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

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
      fetcher.submit(form, {
        method: "post",
        action: "/api/admin/institution/handleRequest",
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Solicitudes de Instituciones
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              ← Volver
            </button>
            <a
              href="/admin/system"
              className="px-3 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
            >
              Ir a Sistema
            </a>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-white">
            <p className="text-gray-600">No hay solicitudes pendientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <FaBuilding className="text-2xl text-rose-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {req.nombreInstitucion}
                        </p>
                        <p className="text-xs text-gray-500">
                          Enviado: {req.submittedAt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-rose-400" />
                        <span>{req.contacto}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-rose-400" />
                        <span>{req.telefono}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-3 mt-2">
                        <p className="text-sm text-gray-600">{req.mensaje}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-44 flex flex-col items-end gap-2">
                    <div className="w-full">
                      <label className="block text-xs text-gray-500 mb-1">
                        Acción
                      </label>
                      <select
                        value={selectedAction[req.id] ?? ""}
                        onChange={(e) =>
                          handleChangeAction(req.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md"
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

                      <button
                        onClick={() => {
                          // Navegar al detalle de la solicitud
                          window.location.href = `/admin/system/institutionSolicitudes/${req.id}`;
                        }}
                        className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Entrar
                      </button>
                    </div>

                    <div className="w-full text-right text-xs">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full ${req.status === "accepted" ? "bg-green-100 text-green-800" : req.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-50 text-yellow-800"}`}
                      >
                        {req.status === "accepted"
                          ? "Aceptada"
                          : req.status === "rejected"
                            ? "Rechazada"
                            : "Pendiente"}
                      </span>
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
