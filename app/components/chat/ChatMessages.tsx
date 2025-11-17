export type Message = {
  id: string;
  sender: "user" | "other";
  message: string;
  timestamp: string;
  senderName?: string;
};

type ChatMessagesProps = {
  messages: Message[];
};

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
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
                message.sender === "user" ? "text-rose-100" : "text-gray-500"
              }`}
            >
              {message.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
