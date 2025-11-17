import { Phone, Video, MoreVertical, Users } from "lucide-react";
import type { ChatItem } from "./ChatList";

type ChatHeaderProps = {
  chat: ChatItem;
  onPhoneCall?: () => void;
  onVideoCall?: () => void;
  onMoreOptions?: () => void;
};

export default function ChatHeader({
  chat,
  onPhoneCall,
  onVideoCall,
  onMoreOptions,
}: ChatHeaderProps) {
  const getTypeIcon = (type: string) => {
    return <Users size={12} className="text-rose-500" />;
  };

  return (
    <div className="p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
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
        <div>
          <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm">
            {chat.user}
            {getTypeIcon(chat.type)}
          </h3>
          <p className="text-xs text-gray-500">
            {chat.online ? "En línea" : "Desconectado"} • Miembro de la
            comunidad
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onPhoneCall && (
          <button
            onClick={onPhoneCall}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Phone size={20} />
          </button>
        )}
        {onVideoCall && (
          <button
            onClick={onVideoCall}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Video size={20} />
          </button>
        )}
        {onMoreOptions && (
          <button
            onClick={onMoreOptions}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
