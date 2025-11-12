import {
  ChatCreateRequest,
  ChatResponse,
  ChatGetResponse,
  MessageGetResponse,
} from "./types";

/** URL base del backend de chats */
const BASE_CHAT_URL =
  process.env.BASE_CHAT_URL || "http://localhost:3050/api/chat/";

/**
 * Crea un nuevo chat
 * @param chat - Datos del chat a crear
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function createChatService(
  chat: ChatCreateRequest,
  cookie: string
): Promise<ChatResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_CHAT_URL}crearChat`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(chat),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al crear chat");
    }

    return data;
  } catch (err) {
    console.error("Create chat error:", err);
    throw err;
  }
}

/**
 * Elimina un chat del sistema
 * @param id - ID del chat a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deleteChatService(
  id: number,
  cookie: string
): Promise<ChatResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_CHAT_URL}eliminarChat`, {
      method: "DELETE",
      headers: hd,
      body: JSON.stringify({ id_chat: id }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar chat");
    }

    return data;
  } catch (err) {
    console.error("Delete chat error:", err);
    throw err;
  }
}

/**
 * Obtiene chats de un usuario
 * @param userId - ID del usuario
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de chats
 * @throws Error si falla la petición
 */
export async function getChatsByUserService(
  userId: number,
  cookie: string
): Promise<ChatGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(
      `${BASE_CHAT_URL}obtenerChatsPorUsuario?id_usuario=${userId}`,
      {
        method: "GET",
        headers: hd,
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener chats del usuario");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get chats by user error:", err);
    throw err;
  }
}

/**
 * Obtiene mensajes de un chat
 * @param chatId - ID del chat
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de mensajes
 * @throws Error si falla la petición
 */
export async function getMessagesByChatService(
  chatId: number,
  cookie: string
): Promise<MessageGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(
      `${BASE_CHAT_URL}obtenerMensajesPorChat?id_chat=${chatId}`,
      {
        method: "GET",
        headers: hd,
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener mensajes del chat");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get messages by chat error:", err);
    throw err;
  }
}
