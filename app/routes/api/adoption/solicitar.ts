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
    const razon = formData.get("razon");

    if (!id_mascota) {
      return Response.json(
        {
          status: "error",
          message: "ID de mascota es requerido",
        },
        { status: 400 }
      );
    }

    // Crear objeto de solicitud según el modelo del backend
    const solicitudData = {
      mascota: {
        id: Number(id_mascota),
      },
      razon: razon || "",
      estadoSolicitud: "PENDIENTE",
    };

    const response = await createSolicitudAdopcionService(
      solicitudData,
      cookie
    );

    return Response.json(
      {
        status: "success",
        message:
          response.message || "Solicitud de adopción enviada exitosamente",
      },
      { status: 200 }
    );
  } catch (error) {
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
