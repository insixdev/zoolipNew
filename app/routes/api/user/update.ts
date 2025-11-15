import { ActionFunctionArgs } from "react-router";
import {
  updateUserService,
  UpdateUserRequest,
} from "~/features/user/userService";
import { getUserFieldFromCookie, field } from "~/lib/authUtil";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      { status: "error", message: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    // Obtener el ID del usuario desde la cookie
    const userId = getUserFieldFromCookie(cookie, field.id);

    if (!userId) {
      return Response.json(
        { status: "error", message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    // Construir el objeto de actualización
    const updateData: UpdateUserRequest = {
      id: parseInt(userId),
      nombre: formData.get("nombre") as string,
      email: formData.get("email") as string,
      rol: (formData.get("rol") as string) || undefined,
      imagen_url: (formData.get("imagen_url") as string) || undefined,
      biografia: (formData.get("biografia") as string) || undefined,
    };

    console.log("[UPDATE USER] Updating user with data:", updateData);

    // Llamar al servicio de actualización
    const result = await updateUserService(updateData, cookie);

    return Response.json(
      {
        status: "success",
        message: "Usuario actualizado correctamente",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[UPDATE USER] Error:", error);
    return Response.json(
      {
        status: "error",
        message: `Error al actualizar usuario: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function loader() {
  return Response.json({ message: "Método no permitido" }, { status: 405 });
}
