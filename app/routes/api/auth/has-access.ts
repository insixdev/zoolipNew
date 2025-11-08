import { canAccessRoute } from "~/lib/roleGuards";
import { getUserFromRequest } from "~/server/me";

export async function action({ request })  {
  try {
  const formData = await request.formData();

    const allowedRoles = JSON.parse(formData.get('allowedRoles') as string);
    const user = JSON.parse(formData.get('user') as string);


    console.log("has access:" + user , allowedRoles);

    // error de entrada de datos
  if (!user || !allowedRoles || !Array.isArray(allowedRoles)) {
      return Response.json(
        { hasAccess: false, ok: false, error: "Datos de entrada inválidos" },
        { status: 400 }
      );
    }
    const hasAccess = canAccessRoute(user.role, allowedRoles);


    if (hasAccess) {
    return Response.json( {hasAccess: true, ok: true} );
  } else {
    return Response.json({ hasAccess: false });
  }

  }catch(error) {
    console.log(error);
    return Response.json({ hasAccess: false, ok: false, error: "Error al verificar el acceso: ${error}", });
  }

}
