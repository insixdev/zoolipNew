import type { LoaderFunctionArgs } from "react-router";
import { getUserByIdService } from "~/features/user/userService";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      {
        status: "error",
        message: "No hay cookie de autenticación",
      },
      { status: 401 }
    );
  }

  const userId = params.id;

  if (!userId) {
    return Response.json(
      {
        status: "error",
        message: "ID de usuario requerido",
      },
      { status: 400 }
    );
  }

  try {
    const user = await getUserByIdService(parseInt(userId), cookie);

    return Response.json(
      {
        status: "success",
        user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al obtener perfil de usuario:", err);
    return Response.json(
      {
        status: "error",
        message: "Error al obtener perfil de usuario",
      },
      { status: 500 }
    );
  }
}
