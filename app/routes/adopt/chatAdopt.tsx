import { MessageCircle, Send, ArrowLeft, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useSearchParams, Link, redirect, useLoaderData } from "react-router";
import { requireAuth } from "~/lib/authGuard";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { getUserFromRequest } from "~/server/me";
import { ADMIN_ROLES } from "~/lib/constants";

// Loader para verificar autenticación, redirigir admins y cargar chats
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);

  // Verificar si el usuario es administrador
  const userResult = await getUserFromRequest(request);

  // Verificar que sea un UserResponseHandler con usuario válido
  if (userResult && "user" in userResult && userResult.user) {
    const userRole = userResult.user.role;
    const isAdmin = Object.values(ADMIN_ROLES).includes(userRole as any);

    // Si es admin, redirigir al chat de admin
    if (isAdmin) {
      const url = new URL(request.url);
      const nombreChat =
        url.searchParams.get("Nombre_Chat") ||
        url.searchParams.get("Nombre_chat");

      // Redirigir al chat de admin con los mismos parámetros si existen
      if (nombreChat) {
        throw redirect(
          `/admin/chat?Nombre_Chat=${encodeURIComponent(nombreChat)}`
        );
      } else {
        throw redirect("/admin/chat");
      }
    }
  }

  // Cargar los chats del usuario
  const cookie = request.headers.get("Cookie") || "";
  let chats = [];

  try {
    console.log("[CHAT LOADER] Cargando chats del usuario...");
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
      console.log("[CHAT LOADER] Chats cargados:", chats);
    } else {
      console.error("[CHAT LOADER] Error:", response.status);
    }
  } catch (error) {
    console.error("[CHAT LOADER] Error cargando chats:", error);
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

export default function AdoptChat() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSmartAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasLoadedAdminName = useRef(false);
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
  const institutionId = searchParams.get("institution_id") || "";
  const nombreUsuario =
    searchParams.get("Nombre") || user?.username || "Usuario";
  const [adminName, setAdminName] = useState<string>("");

  console.log("[CHAT] Parametros URL:", {
    nombreChat,
    institutionId,
    nombreUsuario,
    searchParams: Object.fromEntries(searchParams.entries()),
  });

  // Obtener nombre del administrador si se proporciona institution_id
  useEffect(() => {
    if (!institutionId || hasLoadedAdminName.current) return;

    hasLoadedAdminName.current = true;

    const getAdminName = async () => {
      try {
        console.log(
          "[CHAT] Obteniendo nombre del administrador para institución:",
          institutionId
        );
        const response = await fetch(
          `/api/chat/admin-name?institution_id=${institutionId}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("[CHAT] Nombre del administrador:", data.adminName);
          setAdminName(data.adminName);

          // Actualizar el nombre del chat con el formato correcto
          const chatName = `${nombreUsuario}_${data.adminName}`;
          setSearchParams({
            Nombre_Chat: chatName,
            Nombre: nombreUsuario,
          });
        }
      } catch (error) {
        console.error(
          "[CHAT] Error obteniendo nombre del administrador:",
          error
        );
      }
    };

    getAdminName();
  }, [institutionId, nombreUsuario, setSearchParams]);

  console.log("[CHAT] Chats cargados desde loader:", chats);

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
      // Buscar el chat actual en la lista de chats
      const currentChat = chats.find((c) => c.nombreChat === nombreChat);
      if (!currentChat) {
        console.log("[CHAT] Chat no encontrado");
        return;
      }

      try {
        console.log("[CHAT] Cargando mensajes del chat:", currentChat.idChat);
        lastLoadedChat.current = nombreChat; // Marcar como cargado
        setIsLoadingMessages(true);

        const url = `${BASE_CHAT_URL}/obtenerMensajesPorChat?id_chat=${currentChat.idChat}`;
        const response = await fetch(url, {
          credentials: "include",
        });

        if (response.ok) {
          const mensajes = await response.json();
          console.log("[CHAT] Mensajes cargados:", mensajes?.length || 0);

          // Debug: mostrar el primer mensaje completo
          if (mensajes && mensajes.length > 0) {
            console.log("[CHAT] Primer mensaje completo:", mensajes[0]);
            console.log("[CHAT] Campos disponibles:", Object.keys(mensajes[0]));
          }

          const transformedMessages = (mensajes || []).map((msg: any) => {
            // Probar múltiples variaciones de nombres de campos
            const sender =
              msg.nombre_usuario ||
              msg.nombreUsuario ||
              msg.nombre_emisor ||
              msg.nombreEmisor ||
              msg.emisor ||
              "Usuario";
            const message = msg.contenido || msg.mensaje || msg.message || "";
            const timestamp =
              msg.fecha_envio ||
              msg.fechaEnvio ||
              msg.fecha_hora ||
              msg.fechaHora;

            console.log("[CHAT] Mensaje:", { sender, message, timestamp });

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

          console.log("[CHAT] Mensajes transformados:", transformedMessages);
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error("[CHAT] Error cargando mensajes:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [nombreChat, chats]);

  // Crear o verificar que el chat existe antes de conectar WebSocket
  useEffect(() => {
    const ensureChatExists = async () => {
      if (!nombreChat || !nombreUsuario) {
        console.log("[CHAT] No se puede verificar chat - faltan parametros");
        return;
      }

      try {
        console.log("[CHAT] Verificando/creando chat:", nombreChat);

        // Extraer nombres del chat (formato: usuario_admin)
        const [usuario, admin] = nombreChat.split("_");

        const response = await fetch(
          "http://localhost:3050/api/chat/crearChat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              nombreChat: nombreChat,
              nombreUsuario: usuario,
              nombreAdministrador: admin,
            }),
          }
        );

        if (response.ok) {
          console.log("[CHAT] Chat verificado/creado exitosamente");
        } else {
          console.log("[CHAT] Chat ya existe o error:", response.status);
        }
      } catch (error) {
        console.error("[CHAT] Error verificando/creando chat:", error);
      }
    };

    ensureChatExists();
  }, [nombreChat, nombreUsuario]);

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
        reconnectAttempts = 0; // Reset intentos al conectar exitosamente
      };

      ws.onmessage = (event) => {
        console.log("[WS] Mensaje recibido (raw):", event.data);
        console.log("[WS] Tipo de dato:", typeof event.data);

        // El backend envía texto plano
        // Formato esperado: "nombreUsuario: mensaje" o solo "mensaje"
        const messageText = event.data;

        // Intentar extraer el sender del mensaje si viene en formato "usuario: mensaje"
        let sender = "Otro usuario";
        let message = messageText;

        if (messageText.includes(":")) {
          const parts = messageText.split(":");
          sender = parts[0].trim();
          message = parts.slice(1).join(":").trim();
        }

        console.log("[WS] Mensaje parseado:", { sender, message });

        const newMessage: Message = {
          id: `${Date.now()}-${Math.random()}`,
          sender: sender,
          message: message,
          timestamp: new Date().toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        console.log("[WS] Mensaje transformado:", newMessage);
        setMessages((prev) => [...prev, newMessage]);
      };

      ws.onerror = (error) => {
        console.error("[WS] Error en WebSocket:", error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log("[WS] WebSocket desconectado", event.code, event.reason);
        setIsConnected(false);

        // Intentar reconectar si no fue un cierre intencional
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

    // Enviar como TEXTO PLANO (el backend espera texto plano)
    const messageToSend = inputMessage.trim();
    console.log("[WS] Enviando mensaje (TEXTO PLANO):", messageToSend);
    console.log("[WS] Longitud del mensaje:", messageToSend.length);

    wsRef.current.send(messageToSend);
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
    // Los mensajes se cargarán automáticamente por el useEffect
  };

  return (
    <div className="md:pl-64 h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/community/refugios"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="text-orange-500" size={24} />
                {nombreChat ? nombreChat.replace(/_/g, " ") : "Chats"}
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
              Mis Conversaciones
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
                  No tienes conversaciones
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Inicia un chat desde el perfil de un refugio
                </p>
                <Link
                  to="/community/refugios"
                  className="inline-block px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Ver refugios
                </Link>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.idChat}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    nombreChat === chat.nombreChat ? "bg-orange-50" : ""
                  }`}
                >
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    {chat.nombreChat.replace(/_/g, " ")}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Con: {chat.nombreAdministrador}
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
                    ? "Comienza una conversación"
                    : "Selecciona un chat"}
              </h3>
              <p className="text-gray-600 mb-4">
                {isLoadingChats
                  ? "Estamos obteniendo tus chats, espera un momento"
                  : chats.length === 0
                    ? "Visita el perfil de un refugio y presiona el botón 'Enviar Mensaje' para iniciar un chat"
                    : "Elige una conversación de la lista para comenzar"}
              </p>
              {!isLoadingChats && chats.length === 0 && (
                <Link
                  to="/community/refugios"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  Explorar refugios
                </Link>
              )}
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
                      No hay mensajes aún. Inicia la conversación!
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
                              ? "bg-orange-500 text-white"
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
                            className={`text-xs mt-1 ${isCurrentUser ? "text-orange-100" : "text-gray-500"}`}
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
                  className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                />
                <button
                  type="submit"
                  disabled={!isConnected || !inputMessage.trim()}
                  className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
