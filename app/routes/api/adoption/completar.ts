import { ActionFunctionArgs } from "react-router";
import { completarSolicitudService } from "~/features/adoption/adoptionService";
import { getHeaderCookie } from "~/server/cookies";
import { requireAdminOrSystem } from "~/lib/roleGuards";

export async function action({ request }: ActionFunctionArgs) {
  // Verificar que sea admin o system
  await requireAdminOrSystem(request);

  const cookie = getHeaderCookie(request);

  if (!cookie) {
    return Response.json(
      {
        status: "error",
        message: "No hay sesión activa",
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const id_solicitud_adopcion = formData.get("id_solicitud_adopcion");
    const estadoSolicitud = formData.get("estadoSolicitud");
    const motivo_decision = formData.get("motivo_decision");

    console.log("[COMPLETAR ADOPCION] Datos recibidos:", {
      id_solicitud_adopcion,
      estadoSolicitud,
      motivo_decision,
    });

    if (!id_solicitud_adopcion) {
      return Response.json(
        {
          status: "error",
          message: "ID de solicitud es requerido",
        },
        { status: 400 }
      );
    }

    if (
      !estadoSolicitud ||
      !["APROBADO", "RECHAZADO"].includes(estadoSolicitud as string)
    ) {
      return Response.json(
        {
          status: "error",
          message:
            "Estado de solicitud inválido. Debe ser APROBADO o RECHAZADO",
        },
        { status: 400 }
      );
    }

    if (!motivo_decision || (motivo_decision as string).trim() === "") {
      return Response.json(
        {
          status: "error",
          message: "El motivo de la decisión es requerido",
        },
        { status: 400 }
      );
    }

    const response = await completarSolicitudService(
      Number(id_solicitud_adopcion),
      estadoSolicitud as "APROBADO" | "RECHAZADO",
      motivo_decision as string,
      cookie
    );

    console.log("[COMPLETAR ADOPCION] Respuesta del backend:", response);

    return Response.json(
      {
        status: "success",
        message:
          response.message ||
          `Solicitud ${estadoSolicitud.toLowerCase()} exitosamente`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COMPLETAR ADOPCION] Error:", error);
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Error al completar solicitud de adopción",
      },
      { status: 500 }
    );
  }
}
