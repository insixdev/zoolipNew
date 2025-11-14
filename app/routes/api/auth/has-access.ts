import { canAccessRoute } from "~/lib/roleGuards";
import { getUserFromRequest } from "~/server/me";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const userData = formData.get("user");
    const allowedRolesData = formData.get("allowedRoles");

    if (
      !userData ||
      !allowedRolesData ||
      typeof userData !== "string" ||
      typeof allowedRolesData !== "string"
    ) {
      return Response.json(
        { hasAccess: false, ok: false, error: "Datos de entrada inválidos" },
        { status: 400 }
      );
    }

    const allowedRoles = JSON.parse(allowedRolesData);
    const user = JSON.parse(userData);

    // error de entrada de datos
    if (!user || !allowedRoles || !Array.isArray(allowedRoles)) {
      return Response.json(
        { hasAccess: false, ok: false, error: "Datos de entrada inválidos" },
        { status: 400 }
      );
    }
    // El user viene como { user: { role: 'ROLE_USER' }, status: 'ok', message: '...' }
    const userRole = user.user?.role || user.role;
    const hasAccess = canAccessRoute(userRole, allowedRoles);
    if (hasAccess) {
      return Response.json({ hasAccess: true, ok: true, user });
    } else {
      return Response.json({ hasAccess: false, ok: true, user });
    }
  } catch (error) {
    console.log(error);
    return Response.json({
      hasAccess: false,
      ok: false,
      error: "Error al verificar el acceso: ${error}",
    });
  }
}

// Agregar método POST para obtener el usuario actual sin verificar roles
export async function loader({ request }) {
  try {
    const userResult = await getUserFromRequest(request);

    if ("succes" in userResult && !userResult.succes) {
      return Response.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    return Response.json({ ok: true, user: userResult });
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return Response.json(
      { ok: false, error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}
