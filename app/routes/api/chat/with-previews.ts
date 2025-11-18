import { LoaderFunctionArgs } from "react-router";

/**
 * Endpoint optimizado para obtener los chats del usuario actual con previews
 * GET /api/chat/with-previews
 *
 * Hace UNA sola petición al backend que devuelve chats con último mensaje
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      { error: "No autenticado", chats: [] },
      { status: 401 }
    );
  }

  try {
    // Llamar al endpoint del backend que devuelve chats con previews
    const response = await fetch(
      "http://localhost:3050/api/chat/obtenerChatsConPreviews",
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const chats = await response.json();
    return Response.json({ chats });
  } catch (error) {
    console.error("[CHAT WITH PREVIEWS] Error:", error);

    // Fallback: si el endpoint no existe, devolver chats sin previews
    try {
      const fallbackResponse = await fetch(
        "http://localhost:3050/api/chat/obtenerChatsPorUsuarioCurrent",
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      if (fallbackResponse.ok) {
        const chats = await fallbackResponse.json();
        return Response.json({ chats });
      }
    } catch (fallbackError) {
      console.error("[CHAT WITH PREVIEWS] Fallback error:", fallbackError);
    }

    return Response.json(
      { error: "Error al obtener chats", chats: [] },
      { status: 500 }
    );
  }
}
