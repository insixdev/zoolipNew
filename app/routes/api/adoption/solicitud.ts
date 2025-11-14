import type { ActionFunctionArgs } from "react-router";
import { createSolicitudAdopcionService } from "~/features/adoption/adoptionService";
import type { SolicitudAdopcionRequest } from "~/features/adoption/types";
import { getUserFieldFromCookie } from "~/lib/authUtil";

/**
 * API endpoint para crear una solicitud de adopción
 */
export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      {
        status: "error",
        message: "No autenticado",
      },
      { status: 401 }
    );
  }

  // Obtener el ID del usuario desde la cookie
  const userId = getUserFieldFromCookie(cookie, "id_usuario");

  if (!userId) {
    return Response.json(
      {
        status: "error",
        message: "Usuario no encontrado",
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const id_mascota = formData.get("id_mascota");

    if (!id_mascota) {
      return Response.json(
        {
          status: "error",
          message: "ID de mascota requerido",
        },
        { status: 400 }
      );
    }

    const solicitud: SolicitudAdopcionRequest = {
      id_mascota: { id: parseInt(id_mascota as string) },
      id_usuario: { id: parseInt(userId) },
      estado: "PENDIENTE",
      fecha_solicitud: new Date().toISOString(),
    };

    console.log("📝 [SOLICITUD] Creating adoption request:", solicitud);

    const response = await createSolicitudAdopcionService(solicitud, cookie);

    console.log("✅ [SOLICITUD] Response:", response);

    return Response.json(
      {
        status: "success",
        message: "Solicitud de adopción creada exitosamente",
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [SOLICITUD] Error:", error);
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

export async function loader() {
  return Response.json({ message: "Método no permitido" }, { status: 405 });
}
