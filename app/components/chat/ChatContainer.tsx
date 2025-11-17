import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import ChatList, { type ChatItem } from "./ChatList";
import ChatHeader from "./ChatHeader";
import ChatMessages, { type Message } from "./ChatMessages";
import ChatInput from "./ChatInput";

type ChatContainerProps = {
  title: string;
  subtitle: string;
  chats: ChatItem[];
  messages: Message[];
  onSendMessage: (message: string) => void;
  onChatSelect?: (chatId: string) => void;
  showSearch?: boolean;
  showCallButtons?: boolean;
};

export default function ChatContainer({
  title,
  subtitle,
  chats,
  messages,
  onSendMessage,
  onChatSelect,
  showSearch = true,
  showCallButtons = true,
}: ChatContainerProps) {
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    onChatSelect?.(chatId);
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const filteredChats = chats.filter((chat) =>
    chat.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="md:pl-64 h-[calc(100vh-5rem)] bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="text-rose-500" size={24} />
              {title}
            </h1>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          {showSearch && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar conversaciones..."
                  className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none w-64 text-gray-900"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex min-h-0">
        {/* Lista de chats */}
        <ChatList
          chats={filteredChats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
        />

        {/* Chat activo */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-white min-w-0">
            <ChatHeader
              chat={selectedChat}
              onPhoneCall={showCallButtons ? () => {} : undefined}
              onVideoCall={showCallButtons ? () => {} : undefined}
              onMoreOptions={() => {}}
            />
            <ChatMessages messages={messages} />
            <ChatInput onSendMessage={onSendMessage} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-gray-600">
                Elige un chat de la lista para comenzar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
