import { ActionFunctionArgs } from "react-router";
import { createSolicitudAdopcionService } from "~/features/adoption/adoptionService";
import { getHeaderCookie } from "~/server/cookies";

export async function action({ request }: ActionFunctionArgs) {
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
    const id_mascota = formData.get("id_mascota");
    const razon_solicitud = formData.get("razon");

    console.log("[ADOPTION] Datos recibidos:", { id_mascota, razon_solicitud });

    if (!id_mascota) {
      return Response.json(
        {
          status: "error",
          message: "ID de mascota es requerido",
        },
        { status: 400 }
      );
    }

    // Crear objeto de solicitud según el formato del backend
    const solicitudData = {
      mascota: {
        id: Number(id_mascota),
      },
      razon_solicitud: razon_solicitud || "",
    };

    console.log("[ADOPTION] Enviando solicitud:", solicitudData);

    const response = await createSolicitudAdopcionService(
      solicitudData as any,
      cookie
    );

    console.log("[ADOPTION] Respuesta del backend:", response);

    return Response.json(
      {
        status: "success",
        message:
          response.message || "Solicitud de adopción enviada exitosamente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADOPTION] Error al crear solicitud:", error);
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Error al crear solicitud de adopción",
      },
      { status: 500 }
    );
  }
}
