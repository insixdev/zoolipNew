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

    // Construir el objeto de actualización solo con campos que tienen valor
    // El ID y rol se obtienen del token en el backend, NO se envían
    const updateData: Partial<UpdateUserRequest> = {};

    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const imagen_url = formData.get("imagen_url") as string;
    const biografia = formData.get("biografia") as string;

    // Solo agregar campos que tienen valor
    if (nombre && nombre.trim()) {
      updateData.nombre = nombre.trim();
    }

    if (email && email.trim()) {
      updateData.email = email.trim();
    }

    // Solo agregar imagen_url si tiene valor
    if (imagen_url && imagen_url.trim()) {
      updateData.imagen_url = imagen_url.trim();
    }

    // Siempre agregar biografía (puede estar vacía para borrarla)
    if (biografia !== null && biografia !== undefined) {
      updateData.biografia = biografia.trim();
    }

    console.log("[UPDATE USER] Updating user with data:", updateData);

    // Llamar al servicio de actualización
    const result = await updateUserService(
      updateData as UpdateUserRequest,
      cookie
    );

    console.log("[UPDATE USER] Result:", result);

    // Limpiar TODAS las cookies de autenticación para forzar re-login
    // Limpiamos tanto AUTH_TOKEN como auth_token por si hay inconsistencias
    const cookieHeaders = [
      "AUTH_TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
      "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
    ];

    return new Response(
      JSON.stringify({
        status: "success",
        message:
          "Usuario actualizado correctamente. Por favor, inicia sesión nuevamente.",
        data: result,
      }),
      {
        status: 200,
        headers: [
          ["Set-Cookie", cookieHeaders[0]],
          ["Set-Cookie", cookieHeaders[1]],
        ],
      }
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
