import { User, Bell, Shield, Lock, LucideIcon } from "lucide-react";

type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type SettingsNavigationProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

const tabs: Tab[] = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "privacy", label: "Privacidad", icon: Shield },
  { id: "account", label: "Cuenta", icon: Lock },
];

export default function SettingsNavigation({
  activeTab,
  onTabChange,
}: SettingsNavigationProps) {
  return (
    <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left transition-colors ${
                activeTab === tab.id
                  ? "bg-rose-50 text-rose-700 border-r-2 border-rose-500"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                  activeTab === tab.id
                    ? "text-rose-500"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
