import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";
import ChatContainer from "~/components/chat/ChatContainer";
import type { ChatItem } from "~/components/chat/ChatList";
import type { Message } from "~/components/chat/ChatMessages";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function CommunityChat() {
  const chats: ChatItem[] = [
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

  const messages: Message[] = [
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

  const handleSendMessage = (message: string) => {
    console.log("[CHAT] Sending message:", message);
    // TODO: Implementar envío de mensaje al backend
  };

  const handleChatSelect = (chatId: string) => {
    console.log("[CHAT] Selected chat:", chatId);
    // TODO: Cargar mensajes del chat seleccionado
  };

  return (
    <ChatContainer
      title="Chat Comunitario"
      subtitle="Conecta con otros miembros de la comunidad de amantes de los animales"
      chats={chats}
      messages={messages}
      onSendMessage={handleSendMessage}
      onChatSelect={handleChatSelect}
      showSearch={true}
      showCallButtons={true}
    />
  );
}
