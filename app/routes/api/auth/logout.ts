import type { ActionFunctionArgs } from "react-router";
import { logoutService } from "~/features/auth/authServiceCurrent";
import { getHeaderCookie } from "~/server/cookies";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { status: "error", message: "Method not allowed" },
      { status: 405 }
    );
  }

  const navCookie = getHeaderCookie(request);
  if (!navCookie) {
    return Response.json(
      {
        status: "error",
        message: "No hay sesión activa",
      },
      { status: 400 }
    );
  }

  try {
    const logoutResponse = await logoutService(navCookie);
    console.log("🚪 Logout response:", logoutResponse);

    // Limpiar caché del servidor
    const { clearUserCache } = await import("~/server/me");
    clearUserCache();

    // Limpiar la cookie del navegador
    return Response.json(
      { status: "success", message: "Logout exitoso" },
      {
        status: 200,
        headers: {
          "Set-Cookie":
            "AUTH_TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
        },
      }
    );
  } catch (error) {
    console.error("Error en logout:", error);
    return Response.json(
      {
        status: "error",
        message: "Error al cerrar sesión",
      },
      { status: 500 }
    );
  }
}
