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

     const nombre = formData.get("nombre") as string | null;
     const email = formData.get("email") as string | null;
     const imagen_url = formData.get("imagen_url") as string | null;
     const biografia = formData.get("biografia") as string | null;

     console.log("[UPDATE USER] === INICIANDO ACTUALIZACIÓN ===");

    console.log("[UPDATE USER] FormData recibida (raw):", {
      nombre: nombre,
      email: email,
      imagen_url: imagen_url,
      biografia: biografia,
    });
    console.log("[UPDATE USER] FormData recibida (truncado):", {
      nombre: nombre ? nombre.substring(0, 20) : "vacío",
      email: email ? email.substring(0, 20) : "vacío",
      imagen_url: imagen_url ? imagen_url.substring(0, 30) : "vacío",
      biografia: biografia ? biografia.substring(0, 30) : "vacío",
    });

    // Solo agregar campos que tienen valor (NO vacíos ni whitespace)
    if (nombre && nombre.trim().length > 0) {
      updateData.nombre = nombre.trim();
      console.log("[UPDATE USER] ✓ Agregando nombre:", updateData.nombre);
    }

    if (email && email.trim().length > 0) {
      updateData.email = email.trim();
      console.log("[UPDATE USER] ✓ Agregando email:", updateData.email);
    }

    // Solo agregar imagen_url si tiene valor
    if (imagen_url && imagen_url.trim().length > 0) {
      updateData.imagen_url = imagen_url.trim();
      console.log("[UPDATE USER] ✓ Agregando imagen_url:", updateData.imagen_url);
    }

    // Biografía puede estar vacía (para borrarla), pero solo si se envió
    if (biografia !== null && biografia !== undefined) {
      updateData.biografia = biografia.trim();
      console.log("[UPDATE USER] ✓ Agregando biografía:", updateData.biografia);
    }

    // Validar que al menos un campo tenga valor
    if (Object.keys(updateData).length === 0) {
      console.warn("[UPDATE USER] ⚠️ No hay campos para actualizar");
      return Response.json(
        {
          status: "error",
          message: "Debe proporcionar al menos un campo para actualizar",
        },
        { status: 400 }
      );
    }

    console.log("[UPDATE USER] Actualizando con datos:", updateData);

    // Llamar al servicio de actualización
    const result = await updateUserService(
      updateData as UpdateUserRequest,
      cookie
    );

    console.log("[UPDATE USER] Result:", result);

    // Limpiar el caché del usuario ANTES de limpiar las cookies
    const { clearUserCache } = await import("~/server/me");
    clearUserCache();
    console.log("[UPDATE USER] ✓ User cache cleared");

    // Limpiar TODAS las cookies de autenticación para forzar re-login
    // Limpiamos tanto AUTH_TOKEN como auth_token por si hay inconsistencias
    const cookieHeaders = [
      "AUTH_TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
      "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
    ];

    console.log("[UPDATE USER] === RESPUESTA EXITOSA ===");
    console.log("[UPDATE USER] Status:", result.status);
    console.log("[UPDATE USER] Message:", result.message);
    console.log("[UPDATE USER] Campos actualizados:", Object.keys(updateData));
    if (updateData.imagen_url) {
      console.log("[UPDATE USER] 📸 Imagen URL actualizada:", updateData.imagen_url);
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message:
          "Usuario actualizado correctamente. Por favor, inicia sesión nuevamente.",
        data: result,
        imagen_url: updateData.imagen_url || null,
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
