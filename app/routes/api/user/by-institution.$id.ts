import { LoaderFunctionArgs } from "react-router";

/**
 * Endpoint para obtener el usuario administrador de una institución
 * GET /api/user/by-institution/:id
 */
export async function loader({ params, request }: LoaderFunctionArgs) {
  const institutionId = params.id;
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
    console.log(
      "[USER BY INSTITUTION] Obteniendo usuario para institución:",
      institutionId
    );

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
    console.log("[USER BY INSTITUTION] Institución:", institution);

    // Obtener el ID del usuario administrador
    const userId = institution.id_usuario?.id || institution.id_usuario;

    if (!userId) {
      throw new Error("No se encontró el ID del usuario administrador");
    }

    console.log("[USER BY INSTITUTION] ID de usuario:", userId);

    // Obtener el usuario administrador
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
    console.log("[USER BY INSTITUTION] Usuario administrador:", adminUser);

    return Response.json(adminUser);
  } catch (error) {
    console.error("[USER BY INSTITUTION] Error:", error);
    return Response.json(
      { error: "Error al obtener usuario administrador" },
      { status: 500 }
    );
  }
}
