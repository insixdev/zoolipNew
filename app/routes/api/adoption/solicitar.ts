import type { ActionFunctionArgs } from "react-router";
import { createSolicitudAdopcionService } from "~/features/adoption/adoptionService";

/**
 * API endpoint para solicitar adopción de una mascota
 * POST /api/adoption/solicitar
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Método no permitido" }, { status: 405 });
  }

  const cookie = request.headers.get("Cookie") || "";

  try {
    const formData = await request.formData();
    const id_mascota = Number(formData.get("id_mascota"));

    if (!id_mascota) {
      return Response.json(
        { error: "ID de mascota requerido" },
        { status: 400 }
      );
    }

    console.log(`🐕 [SOLICITAR ADOPCION] Mascota ID: ${id_mascota}`);

    // El backend automáticamente obtiene el usuario del contexto de seguridad
    const result = await createSolicitudAdopcionService(
      { id_mascota: { id: id_mascota } } as any,
      cookie
    );

    return Response.json({
      success: true,
      message: "Solicitud de adopción enviada exitosamente",
      result,
    });
  } catch (error: any) {
    console.error("🐕 [SOLICITAR ADOPCION] Error:", error);

    // Si es error 409 (ya solicitada)
    if (
      error.message?.includes("409") ||
      error.message?.includes("ya solicitada")
    ) {
      return Response.json(
        { error: "Ya has solicitado adoptar esta mascota" },
        { status: 409 }
      );
    }

    return Response.json(
      { error: error.message || "Error al solicitar adopción" },
      { status: 500 }
    );
  }
}
