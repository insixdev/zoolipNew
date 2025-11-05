import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Users,
  Heart,
} from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function CommunityChat() {
  const chats = [
    {
      id: "1",
      user: "María González",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "¿Alguien ha tenido experiencia con Golden Retrievers?",
      timestamp: "10:30 AM",
      unread: 2,
      online: true,
      type: "usuario",
    },
    {
      id: "2",
      user: "Carlos Mendoza",
      avatar: "https://i.pravatar.cc/150?img=8",
      lastMessage:
        "Mi perro ya se adaptó perfectamente, gracias por los consejos",
      timestamp: "Ayer",
      unread: 0,
      online: false,
      type: "usuario",
    },
    {
      id: "3",
      user: "Ana Silva",
      avatar: "https://i.pravatar.cc/150?img=5",
      lastMessage: "Compartí fotos de mi gato en el grupo",
      timestamp: "2 días",
      unread: 1,
      online: true,
      type: "usuario",
    },
    {
      id: "4",
      user: "Luis Ramírez",
      avatar: "https://i.pravatar.cc/150?img=10",
      lastMessage: "¿Conocen algún parque dog-friendly por aquí?",
      timestamp: "3 días",
      unread: 0,
      online: false,
      type: "usuario",
    },
    {
      id: "5",
      user: "Sofia Torres",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "Mi cachorro ya aprendió a sentarse! 🐕",
      timestamp: "4 días",
      unread: 0,
      online: true,
      type: "usuario",
    },
  ];

  const messages = [
    {
      id: "1",
      sender: "other",
      message:
        "Hola! Vi que también tienes un Golden Retriever. ¿Cómo ha sido tu experiencia?",
      timestamp: "10:15 AM",
      senderName: "María",
    },
    {
      id: "2",
      sender: "user",
      message:
        "¡Increíble! Son súper cariñosos y fáciles de entrenar. ¿El tuyo es cachorro?",
      timestamp: "10:20 AM",
    },
    {
      id: "3",
      sender: "other",
      message:
        "Sí, tiene 4 meses. Estoy buscando consejos para el entrenamiento básico.",
      timestamp: "10:25 AM",
      senderName: "María",
    },
    {
      id: "4",
      sender: "user",
      message:
        'Te recomiendo empezar con comandos simples como "siéntate" y "ven aquí". La consistencia es clave.',
      timestamp: "10:30 AM",
    },
    {
      id: "5",
      sender: "other",
      message:
        "¡Perfecto! ¿Tienes algún truco especial para que preste atención?",
      timestamp: "10:32 AM",
      senderName: "María",
    },
  ];

  const getTypeIcon = (type: string) => {
    // En el chat de comunidad, todos son usuarios normales
    return <Users size={12} className="text-rose-500" />;
  };

  const getTypeBadge = (type: string) => {
    // En el chat de comunidad, no necesitamos badges especiales
    return null;
  };

  return (
    <div className="md:pl-64 h-[calc(100vh-5rem)] bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="text-rose-500" size={24} />
              Chat Comunitario
            </h1>
            <p className="text-sm text-gray-600">
              Conecta con otros miembros de la comunidad de amantes de los
              animales
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none w-64 text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex min-h-0">
        {/* Lista de chats */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <h2 className="font-semibold text-gray-900 text-sm">
              Conversaciones Activas
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
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.user}
                      className="w-10 h-10 rounded-full"
                    />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {chat.user}
                        </h3>
                        {getTypeIcon(chat.type)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {chat.timestamp}
                      </span>
                    </div>

                    {getTypeBadge(chat.type) && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mb-1 inline-block">
                        {getTypeBadge(chat.type)}
                      </span>
                    )}

                    <p className="text-xs text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unread > 0 && (
                    <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
              <div className="relative">
                <img
                  src={chats[0].avatar}
                  alt={chats[0].user}
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm">
                  {chats[0].user}
                  {getTypeIcon(chats[0].type)}
                </h3>
                <p className="text-xs text-gray-500">
                  En línea • Miembro de la comunidad
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
                      ? "bg-rose-500 text-white"
                      : "bg-white text-gray-900 shadow-sm border border-gray-200"
                  }`}
                >
                  {message.sender === "other" && message.senderName && (
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-rose-100"
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
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-gray-900"
              />
              <button className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
