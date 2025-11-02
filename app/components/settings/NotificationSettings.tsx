import { useState } from "react";
import { Mail, Smartphone, Bell, User, Globe } from "lucide-react";

type NotificationToggleProps = {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

function NotificationToggle({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-gray-400 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
          enabled ? "bg-rose-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    messages: true,
    adoptions: true,
    community: false,
  });

  const updateNotification = (
    key: keyof typeof notifications,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
          Preferencias de Notificaciones
        </h3>

        <div className="space-y-6">
          <NotificationToggle
            icon={Mail}
            title="Notificaciones por email"
            description="Recibe actualizaciones importantes por correo"
            enabled={notifications.email}
            onChange={(value) => updateNotification("email", value)}
          />

          <NotificationToggle
            icon={Smartphone}
            title="Notificaciones push"
            description="Recibe notificaciones en tu dispositivo"
            enabled={notifications.push}
            onChange={(value) => updateNotification("push", value)}
          />

          <NotificationToggle
            icon={Bell}
            title="Mensajes nuevos"
            description="Notificaciones de mensajes directos"
            enabled={notifications.messages}
            onChange={(value) => updateNotification("messages", value)}
          />

          <NotificationToggle
            icon={User}
            title="Actualizaciones de adopción"
            description="Notificaciones sobre el proceso de adopción"
            enabled={notifications.adoptions}
            onChange={(value) => updateNotification("adoptions", value)}
          />

          <NotificationToggle
            icon={Globe}
            title="Actividad de la comunidad"
            description="Notificaciones de publicaciones y comentarios"
            enabled={notifications.community}
            onChange={(value) => updateNotification("community", value)}
          />
        </div>
      </div>
    </div>
  );
}
