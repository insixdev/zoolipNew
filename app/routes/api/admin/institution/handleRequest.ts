import { ActionFunction } from "react-router";
import { updateInstitutionSolicitudStatusService } from "~/features/entities/institucion/institutionSolicitudService";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json(
      { ok: false, error: "Método no permitido" },
      { status: 405 }
    );
  }

  try {
    const form = await request.formData();
    const id = form.get("id");
    const actionType = form.get("action");
    const motivo = form.get("motivo") || undefined;

    if (!id || !actionType) {
      return Response.json(
        { ok: false, error: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    const idNum = Number(id.toString());
    if (Number.isNaN(idNum)) {
      return Response.json(
        { ok: false, error: "ID inválido" },
        { status: 400 }
      );
    }

    const cookie = request.headers.get("cookie") || undefined;

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
    console.error("/api/admin/institution/handleRequest error:", err);
    return Response.json(
      { ok: false, error: err.message || "Error interno" },
      { status: 500 }
    );
  }
};
