import { LoaderFunctionArgs } from "react-router";

/**
 * Endpoint para obtener el nombre del administrador de una institución
 * GET /api/chat/admin-name?institution_id=X
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const institutionId = url.searchParams.get("institution_id");
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!institutionId) {
    return Response.json(
      { error: "ID de institución requerido" },
      { status: 400 }
    );
  }

  try {
    // Obtener la institución del backend
    const institutionResponse = await fetch(
      `http://localhost:3050/api/institucion/obtenerPorId?id=${institutionId}`,
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    if (!institutionResponse.ok) {
      throw new Error("Error al obtener institución");
    }

    const institution = await institutionResponse.json();
    console.log("[ADMIN-NAME] Institución:", institution);

    // Obtener el usuario administrador de la institución
    const userId = institution.id_usuario?.id || institution.id_usuario;

    if (!userId) {
      throw new Error("No se encontró el ID del usuario administrador");
    }

    const userResponse = await fetch(
      `http://localhost:3050/api/usuario/obtenerPorId?id=${userId}`,
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Error al obtener usuario administrador");
    }

    const adminUser = await userResponse.json();
    console.log("[ADMIN-NAME] Usuario administrador:", adminUser);

    // Retornar el nombre del administrador
    const adminName = adminUser.nombre || adminUser.username || "Admin";

    return Response.json({ adminName });
  } catch (error) {
    console.error("[ADMIN-NAME] Error:", error);
    return Response.json(
      {
        error: "Error al obtener nombre del administrador",
        adminName: "Admin",
      },
      { status: 500 }
    );
  }
}
