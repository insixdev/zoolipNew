import { ActionFunctionArgs } from "react-router";
import { ADMIN_ROLES } from "~/lib/constants";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const allowedAdminRolesStr = formData.get("allowedAdminRoles");
    const userStr = formData.get("user");

    if (!allowedAdminRolesStr || !userStr) {
      return Response.json(
        { ok: false, error: "Missing required data" },
        { status: 400 }
      );
    }

    const allowedAdminRoles = JSON.parse(allowedAdminRolesStr as string);
    const user = JSON.parse(userStr as string);

    // Verificar que el usuario tenga el campo "tipo"
    if (!user.role) {
      return Response.json({ ok: true, hasAccess: false });
    }

    // Verificar si el tipo del usuario está en los roles permitidos
    const hasAccess = allowedAdminRoles.includes(user.role);

    return Response.json({ ok: true, hasAccess });
  } catch (error) {
    console.error("Error checking admin access:", error);
    return Response.json(
      { ok: false, error: "Error checking admin access" },
      { status: 500 }
    );
  }
}
