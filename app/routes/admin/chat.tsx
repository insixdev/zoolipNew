import { MessageCircle, Send, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useSearchParams, useLoaderData } from "react-router";
import { requireAuth } from "~/lib/authGuard";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { getUserFromRequest } from "~/server/me";
import { ADMIN_ROLES } from "~/lib/constants";
import { redirect } from "react-router";

// Loader para verificar autenticación, rol de administrador y cargar chats
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);

  // Verificar que el usuario sea administrador
  const userResult = await getUserFromRequest(request);

  if (!userResult || !("user" in userResult) || !userResult.user) {
    throw redirect("/login");
  }

  const userRole = userResult.user.role;
  const isAdmin = Object.values(ADMIN_ROLES).includes(userRole as any);

  if (!isAdmin) {
    throw redirect("/community");
  }

  // Cargar los chats del administrador
  const cookie = request.headers.get("Cookie") || "";
  let chats = [];

  try {
    const response = await fetch(
      "http://localhost:3050/api/chat/obtenerChatsPorUsuarioCurrent",
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    if (response.ok) {
      chats = await response.json();
    }
  } catch (error) {
    console.error("[ADMIN CHAT LOADER] Error cargando chats:", error);
  }

  return { chats: chats || [] };
}

type Message = {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
};

type ChatDTO = {
  idChat: number;
  nombreChat: string;
  nombreUsuario: string;
  nombreAdministrador: string;
};

// URL base para el chat - debe coincidir con el backend
const BASE_CHAT_URL = "http://localhost:3050/api/chat";
const BASE_WS_URL = "ws://localhost:3050/chat";

export default function AdminChat() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSmartAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastLoadedChat = useRef<string>("");

  // Transformar los chats del loader
  const chats: ChatDTO[] = (loaderData.chats || []).map((chat: any) => ({
    idChat: chat.idChat || chat.id_chat,
    nombreChat: chat.nombreChat || chat.nombre_chat || "Chat",
    nombreUsuario: chat.nombreUsuario || chat.nombre_usuario || "",
    nombreAdministrador:
      chat.nombreAdministrador || chat.nombre_administrador || "Admin",
  }));

  const isLoadingChats = false; // Ya no necesitamos estado de carga

  // Obtener parámetros de la URL (soportar ambos formatos por compatibilidad)
  const nombreChat =
    searchParams.get("Nombre_Chat") || searchParams.get("Nombre_chat") || "";
  // Usar el nombre del usuario actual (administrador)
  const nombreUsuario = user?.nombre || user?.username || "Admin";

  console.log("[ADMIN CHAT] Parametros URL:", {
    nombreChat,
    nombreUsuario,
    chatsLength: chats.length,
    searchParams: Object.fromEntries(searchParams.entries()),
  });

  console.log("[ADMIN CHAT] Chats cargados:", chats);

  // Scroll automático al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar mensajes históricos del chat
  useEffect(() => {
    // Evitar bucle infinito: solo cargar si el chat cambió
    if (
      !nombreChat ||
      chats.length === 0 ||
      lastLoadedChat.current === nombreChat
    ) {
      return;
    }

    const loadMessages = async () => {
      const currentChat = chats.find((c) => c.nombreChat === nombreChat);
      if (!currentChat) return;

      try {
        console.log("[ADMIN CHAT] Cargando mensajes:", currentChat.idChat);
        lastLoadedChat.current = nombreChat; // Marcar como cargado

        const response = await fetch(
          `${BASE_CHAT_URL}/obtenerMensajesPorChat?id_chat=${currentChat.idChat}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const mensajes = await response.json();
          console.log("[ADMIN CHAT] Mensajes cargados (raw):", mensajes);
          console.log(
            "[ADMIN CHAT] Cantidad de mensajes:",
            mensajes?.length || 0
          );

          // Debug: mostrar el primer mensaje para ver los campos
          if (mensajes && mensajes.length > 0) {
            console.log("[ADMIN CHAT] Primer mensaje completo:", mensajes[0]);
            console.log("[ADMIN CHAT] Campos:", Object.keys(mensajes[0]));
          }

          // Transformar mensajes del backend al formato del frontend
          const transformedMessages = (mensajes || []).map((msg: any) => {
            // Probar todas las variaciones posibles de nombre
            let sender =
              msg.nombre_usuario ||
              msg.nombreUsuario ||
              msg.nombre_emisor ||
              msg.nombreEmisor ||
              msg.emisor ||
              msg.nombre || // Campo genérico "nombre"
              msg.sender ||
              "Usuario";
            let message = msg.contenido || msg.mensaje || msg.message || "";
            let timestamp =
              msg.fecha_envio ||
              msg.fechaEnvio ||
              msg.fecha_hora ||
              msg.fechaHora ||
              msg.timestamp;

            // Si el mensaje es un JSON string, parsearlo
            if (
              message &&
              typeof message === "string" &&
              message.startsWith("{")
            ) {
              try {
                const parsedMessage = JSON.parse(message);
                sender = parsedMessage.sender || sender;
                message = parsedMessage.message || message;
                timestamp = parsedMessage.timestamp || timestamp;
              } catch (e) {
                // Si falla el parseo, usar el mensaje original
                console.log(
                  "[ADMIN CHAT] No se pudo parsear mensaje JSON:",
                  message
                );
              }
            }

            return {
              id:
                msg.id_mensaje?.toString() ||
                msg.idMensaje?.toString() ||
                `${Date.now()}-${Math.random()}`,
              sender: sender,
              message: message,
              timestamp: timestamp
                ? new Date(timestamp).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
            };
          });

          console.log(
            "[ADMIN CHAT] Mensajes transformados:",
            transformedMessages
          );
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error("[ADMIN CHAT] Error cargando mensajes:", error);
      }
    };

    loadMessages();
  }, [nombreChat, chats]);

  // Conectar al WebSocket con reconexión automática
  useEffect(() => {
    console.log("[WS] Efecto WebSocket ejecutado", {
      nombreChat,
      nombreUsuario,
      hasNombreChat: !!nombreChat,
      hasNombreUsuario: !!nombreUsuario,
    });

    if (!nombreChat || !nombreUsuario) {
      console.log("[WS] No se puede conectar - faltan parametros");
      return;
    }

    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      const wsUrl = `${BASE_WS_URL}?Nombre_Chat=${encodeURIComponent(nombreChat)}&Nombre=${encodeURIComponent(nombreUsuario)}`;
      console.log("[WS] Conectando a WebSocket:", wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] WebSocket conectado");
        setIsConnected(true);
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        console.log("[ADMIN WS] Mensaje recibido (raw):", event.data);
        console.log("[ADMIN WS] Tipo de dato:", typeof event.data);

        try {
          // Intentar parsear como JSON primero
          const data = JSON.parse(event.data);
          console.log("[ADMIN WS] Mensaje parseado como JSON:", data);

          const newMessage: Message = {
            id: `${Date.now()}-${Math.random()}`,
            sender:
              data.sender || data.nombre_usuario || data.nombre || "Usuario",
            message: data.message || data.contenido || data.mensaje || "",
            timestamp: new Date().toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          console.log("[ADMIN WS] Mensaje transformado:", newMessage);
          setMessages((prev) => [...prev, newMessage]);
        } catch (error) {
          // Si no es JSON, tratar como texto plano
          console.log("[ADMIN WS] No es JSON, tratando como texto plano");
          const messageText = event.data;
          let sender = "Usuario";
          let message = messageText;

          if (messageText.includes(":")) {
            const parts = messageText.split(":");
            sender = parts[0].trim();
            message = parts.slice(1).join(":").trim();
          }

          const newMessage: Message = {
            id: `${Date.now()}-${Math.random()}`,
            sender: sender,
            message: message,
            timestamp: new Date().toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      };

      ws.onerror = (error) => {
        console.error("[WS] Error en WebSocket:", error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log("[WS] WebSocket desconectado", event.code, event.reason);
        setIsConnected(false);

        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          setIsReconnecting(true);
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          console.log(
            `[WS] Reintentando conexion en ${delay}ms (intento ${reconnectAttempts}/${maxReconnectAttempts})`
          );
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
            setIsReconnecting(false);
          }, delay);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          setIsReconnecting(false);
        }
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Component unmounted");
      }
    };
  }, [nombreChat, nombreUsuario]);

  // Enviar mensaje
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !inputMessage.trim() ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    const messageData = {
      sender: nombreUsuario,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Agregar el mensaje localmente de inmediato (optimistic update)
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      sender: nombreUsuario,
      message: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);

    console.log("[WS] Enviando mensaje:", messageData);
    wsRef.current.send(JSON.stringify(messageData));
    setInputMessage("");

    // Hacer scroll al final después de agregar el mensaje
    setTimeout(() => scrollToBottom(), 100);
  };

  // Seleccionar un chat
  const handleSelectChat = (chat: ChatDTO) => {
    setSearchParams({
      Nombre_Chat: chat.nombreChat,
      Nombre: nombreUsuario,
    });
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="text-purple-500" size={24} />
                {nombreChat ? nombreChat.replace(/_/g, " ") : "Chat Admin"}
              </h1>
              {nombreChat && (
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected
                        ? "bg-green-500"
                        : isReconnecting
                          ? "bg-yellow-500 animate-pulse"
                          : "bg-red-500"
                    }`}
                  ></span>
                  <p className="text-sm text-gray-600">
                    {isConnected
                      ? "Conectado"
                      : isReconnecting
                        ? "Reconectando..."
                        : "Desconectado"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Lista de chats */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} />
              Conversaciones
            </h2>
            <p className="text-xs text-gray-500 mt-1">{chats.length} chats</p>
          </div>

          <div className="flex-1 overflow-hidden">
            {isLoadingChats ? (
              <div className="p-4 text-center text-gray-500">
                Cargando chats...
              </div>
            ) : chats.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle
                  className="mx-auto mb-3 text-gray-300"
                  size={48}
                />
                <p className="text-sm font-medium text-gray-700 mb-2">
                  No hay conversaciones
                </p>
                <p className="text-xs text-gray-500">
                  Los usuarios iniciarán chats contigo
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.idChat}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    nombreChat === chat.nombreChat ? "bg-purple-50" : ""
                  }`}
                >
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    {chat.nombreChat.replace(/_/g, " ")}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Usuario: {chat.nombreUsuario}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Área de mensajes */}
        {!nombreChat ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md px-6">
              <MessageCircle className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isLoadingChats
                  ? "Cargando conversaciones..."
                  : chats.length === 0
                    ? "Esperando conversaciones"
                    : "Selecciona un chat"}
              </h3>
              <p className="text-gray-600 mb-4">
                {isLoadingChats
                  ? "Estamos obteniendo tus chats, espera un momento"
                  : chats.length === 0
                    ? "Los usuarios podrán iniciar conversaciones contigo desde los refugios"
                    : "Elige una conversación de la lista para responder"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
            {/* Mensajes */}
            <div className="flex-1 overflow-hidden p-4 bg-gray-50 flex flex-col-reverse">
              <div className="space-y-3 flex flex-col">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle
                      className="mx-auto text-gray-300 mb-4"
                      size={48}
                    />
                    <p className="text-gray-500">
                      No hay mensajes aún en esta conversación
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.sender === nombreUsuario;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            isCurrentUser
                              ? "bg-purple-500 text-white"
                              : "bg-white text-gray-900 shadow-sm border border-gray-200"
                          }`}
                        >
                          {!isCurrentUser && (
                            <p className="text-xs font-semibold mb-1 text-gray-600">
                              {message.sender}
                            </p>
                          )}
                          <p className="text-sm break-words">
                            {message.message}
                          </p>
                          <p
                            className={`text-xs mt-1 ${isCurrentUser ? "text-purple-100" : "text-gray-500"}`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Input de mensaje */}
            <div className="p-4 pb-6 border-t border-gray-200 bg-white flex-shrink-0">
              <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-3"
              >
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={
                    isConnected
                      ? "Escribe un mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
                      : "Conectando al chat..."
                  }
                  disabled={!isConnected}
                  rows={3}
                  className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                />
                <button
                  type="submit"
                  disabled={!isConnected || !inputMessage.trim()}
                  className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
