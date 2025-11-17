import { Users } from "lucide-react";

export type ChatItem = {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  type: "usuario" | "refugio" | "veterinaria";
};

type ChatListProps = {
  chats: ChatItem[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
};

export default function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
}: ChatListProps) {
  const getTypeIcon = (type: string) => {
    return <Users size={12} className="text-rose-500" />;
  };

  return (
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
            onClick={() => onChatSelect(chat.id)}
            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedChatId === chat.id ? "bg-rose-50" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.user}
                  className="w-10 h-10 rounded-full object-cover"
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

                <p className="text-xs text-gray-600 truncate">
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unread > 0 && (
                <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
