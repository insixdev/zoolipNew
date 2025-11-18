import { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/server/me";
import { ADMIN_ROLES } from "~/lib/constants";

/**
 * Endpoint para obtener los chats del administrador actual
 * GET /api/chat/admin-current
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      { error: "No autenticado", chats: [] },
      { status: 401 }
    );
  }

  // Verificar que el usuario sea administrador
  const userResult = await getUserFromRequest(request);

  if (!userResult || !userResult.user) {
    return Response.json(
      { error: "No autenticado", chats: [] },
      { status: 401 }
    );
  }

  const userRole = userResult.user.role;
  const isAdmin = Object.values(ADMIN_ROLES).includes(userRole as any);

  if (!isAdmin) {
    return Response.json(
      { error: "No autorizado - Solo administradores", chats: [] },
      { status: 403 }
    );
  }

  try {
    // Llamar al backend para obtener los chats del administrador
    const response = await fetch(
      "http://localhost:3050/api/chat/obtenerChatsPorAdministradorCurrent",
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    if (!response.ok) {
      console.error("[ADMIN CHAT] Error del backend:", response.status);
      return Response.json({ chats: [] });
    }

    const chats = await response.json();
    console.log("[ADMIN CHAT] Chats del administrador:", chats);

    return Response.json({ chats: chats || [] });
  } catch (error) {
    console.error("[ADMIN CHAT] Error:", error);
    return Response.json(
      { error: "Error al obtener chats", chats: [] },
      { status: 500 }
    );
  }
}
