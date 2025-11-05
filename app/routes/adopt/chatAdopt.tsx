import { MessageCircle, Send, Phone, Video, MoreVertical } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function AdoptChat() {
  const chats = [
    {
      id: "1",
      refugio: "Refugio Esperanza",
      avatar: "https://i.pravatar.cc/150?img=20",
      lastMessage: "Hola! Me interesa adoptar a Luna",
      timestamp: "10:30 AM",
      unread: 2,
      pet: "Luna",
    },
    {
      id: "2",
      refugio: "Patitas Felices",
      avatar: "https://i.pravatar.cc/150?img=21",
      lastMessage: "Perfecto, podemos coordinar la visita",
      timestamp: "Ayer",
      unread: 0,
      pet: "Max",
    },
    {
      id: "3",
      refugio: "Amor Animal",
      avatar: "https://i.pravatar.cc/150?img=22",
      lastMessage: "Gracias por tu interés en Rocky",
      timestamp: "2 días",
      unread: 1,
      pet: "Rocky",
    },
  ];

  const messages = [
    {
      id: "1",
      sender: "refugio",
      message:
        "Hola! Gracias por tu interés en Luna. ¿Te gustaría conocer más sobre ella?",
      timestamp: "10:15 AM",
    },
    {
      id: "2",
      sender: "user",
      message: "Sí, me encantaría! ¿Podrías contarme sobre su personalidad?",
      timestamp: "10:20 AM",
    },
    {
      id: "3",
      sender: "refugio",
      message:
        "Luna es muy cariñosa y tranquila. Le encanta jugar pero también disfruta de momentos de calma. Es perfecta para familias.",
      timestamp: "10:25 AM",
    },
    {
      id: "4",
      sender: "user",
      message: "Suena perfecta! ¿Cuándo podríamos visitarla?",
      timestamp: "10:30 AM",
    },
  ];

  return (
    <div className="md:pl-64 h-[calc(100vh-5rem)] bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="text-orange-500" size={24} />
              Chat con Refugios
            </h1>
            <p className="text-sm text-gray-600">
              Comunícate directamente con refugios y veterinarios sobre
              adopciones
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex min-h-0">
        {/* Lista de chats */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <h2 className="font-semibold text-gray-900 text-sm">
              Conversaciones con Refugios
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {chats.length} conversaciones
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={chat.avatar}
                    alt={chat.refugio}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {chat.refugio}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Sobre: {chat.pet}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat activo */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Header del chat */}
          <div className="p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={chats[0].avatar}
                alt={chats[0].refugio}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  {chats[0].refugio}
                </h3>
                <p className="text-xs text-gray-500">
                  Conversación sobre {chats[0].pet}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Phone size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Video size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-900 shadow-sm border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-orange-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de mensaje */}
          <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900"
              />
              <button className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
