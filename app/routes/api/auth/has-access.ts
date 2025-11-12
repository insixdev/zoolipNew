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
    console.log("has-access API - userRole:", userRole);
    console.log("has-access API - allowedRoles:", allowedRoles);
    const hasAccess = canAccessRoute(userRole, allowedRoles);
    console.log("has-access API - hasAccess result:", hasAccess);

    if (hasAccess) {
      return Response.json({ hasAccess: true, ok: true });
    } else {
      return Response.json({ hasAccess: false, ok: true });
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
