import { canAccessRoute } from "~/lib/roleGuards";
import { getUserFromRequest } from "~/server/me";

export async function action({ request })  {
  try {
  const { allowedRoles, user} = await request.formData();
  const hasAccess = canAccessRoute(user.role, allowedRoles);


  if (hasAccess) {
    return { hasAccess: true };
  } else {
    return { hasAccess: false };
  }

  }catch(error) {
    console.log(error);
    return {
      hasAccess: false,
      ok: false,
      error: "Error al verificar el acceso: ${error}",
    };
  }


}
