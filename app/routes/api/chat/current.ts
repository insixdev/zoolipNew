import { LoaderFunctionArgs } from "react-router";
import { getCurrentUserChatsService } from "~/features/chat/chatService";

/**
 * Endpoint para obtener los chats del usuario actual
 * GET /api/chat/current
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
    const chats = await getCurrentUserChatsService(cookie);
    return Response.json({ chats });
  } catch (error) {
    console.error("[CHAT CURRENT] Error:", error);
    return Response.json(
      { error: "Error al obtener chats", chats: [] },
      { status: 500 }
    );
  }
}
