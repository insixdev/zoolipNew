import React from "react";
import {
  useNavigate,
  useFetcher,
  type LoaderFunction,
  useLoaderData,
  type ActionFunction,
} from "react-router";
import { AdministradorOnly } from "~/components/auth/AdminGuard";
import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

export const loader: LoaderFunction = async ({ params, request }) => {
  try {
    const id = params.id;
    if (!id) return null;
    const cookie = request.headers.get("cookie") || "";
    const { getInstitutionSolicitudByIdService } = await import(
      "~/features/entities/institucion/institutionSolicitudService"
    );
    const data = await getInstitutionSolicitudByIdService(Number(id), cookie);
    return data;
  } catch (err) {
    console.error("Loader institution solicitud detalle error:", err);
    return null;
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const form = await request.formData();
    const id = params.id;
    const actionType = form.get("action");
    const motivo = form.get("motivo") || undefined;
    if (!id || !actionType)
      return Response.json(
        { ok: false, error: "Parámetros inválidos" },
        { status: 400 }
      );

    const idNum = Number(id);
    const cookie = request.headers.get("cookie") || undefined;
    const { updateInstitutionSolicitudStatusService } = await import(
      "~/features/entities/institucion/institutionSolicitudService"
    );
    const estado =
      actionType.toString() === "accept" ? "ACEPTADA" : "RECHAZADA";
    const res = await updateInstitutionSolicitudStatusService(
      idNum,
      estado,
      motivo?.toString(),
      cookie
    );
    return Response.json({ ok: true, data: res });
  } catch (err: any) {
    console.error("Action institution solicitud detalle error:", err);
    return Response.json(
      { ok: false, error: err.message || "Error interno" },
      { status: 500 }
    );
  }
};

export default function InstitutionSolicitudDetail() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const data: any = useLoaderData();

  if (!data) {
    return (
      <AdministradorOnly>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Solicitud no encontrada</h2>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md"
            >
              Volver
            </button>
          </div>
        </div>
      </AdministradorOnly>
    );
  }

  const solicitud = {
    id: data.id_solicitud,
    nombre: data.nombre_institucion,
    tipo: data.tipo,
    email: data.email_contacto,
    telefono: data.telefono_contacto,
    razon: data.razon_solicitud,
    estado: (data.estado || data.status || "PENDIENTE").toLowerCase(),
    fecha: data.fecha_creacion || data.fecha || "-",
  };

  const handleAction = (actionType: "accept" | "reject") => {
    if (actionType === "reject") {
      const ok = window.confirm("¿Confirma que desea rechazar esta solicitud?");
      if (!ok) return;
    }
    const form = new FormData();
    form.append("action", actionType);
    fetcher.submit(form, { method: "post" });
  };

  return (
    <AdministradorOnly>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            Solicitud: {solicitud.nombre}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 bg-gray-100 rounded-md"
            >
              ← Volver
            </button>
            <a
              href="/admin/system"
              className="px-3 py-2 bg-rose-600 text-white rounded-md"
            >
              Ir a Sistema
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-4 mb-4">
            <FaBuilding className="text-2xl text-rose-600" />
            <div>
              <p className="font-medium text-gray-900">{solicitud.nombre}</p>
              <p className="text-sm text-gray-500">Tipo: {solicitud.tipo}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-rose-400" />{" "}
              <span>{solicitud.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-rose-400" />{" "}
              <span>{solicitud.telefono}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">
                Enviado: {solicitud.fecha}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Razón:</h3>
            <p className="text-sm text-gray-600">{solicitud.razon}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAction("accept")}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Aceptar
            </button>
            <button
              onClick={() => handleAction("reject")}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </AdministradorOnly>
  );
}
