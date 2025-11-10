import { Link, useLocation } from "react-router";
import {
  Home,
  Users,
  Heart,
  Info,
  FileText,
  MessageCircle,
  Calendar,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onlyForUsers?: boolean;
};

const menuItems = [
  {
    label: "Inicio",
    path: "/",
    icon: Home,
  },
  {
    label: "Comunidad",
    path: "/community",
    icon: Users,
  },
  {
    label: "Adopciones",
    path: "/adopt",
    icon: Heart,
  },
  {
    label: "Sobre Nosotros",
    path: "/info/about",
    icon: Info,
  },
  {
    label: "Chat",
    path: "/community/chatCommunity",
    icon: MessageCircle,
  },

];

export default function MobileSidebar({
  isOpen,
  onClose,
  onlyForUsers = false,
}: MobileSidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname ]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="w-80 bg-white min-h-screen fixed left-0 top-0 z-50 md:hidden shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Menú</h2>
              <p className="text-sm text-gray-500 mt-1">
                Navega por las secciones
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-400 transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                // If this is the adopt entry and onlyForUsers is true, render disabled
                if (item.path === "/adopt" || onlyForUsers) {
                  return (
                    <li key={item.path}>
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 line-through opacity-60 cursor-not-allowed"
                        title="Acceso solo para usuarios registrados"
                        aria-disabled="true"
                      >
                        <Icon size={20} className="text-gray-400" />
                        <span>{item.label}</span>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${
                          active
                            ? "bg-orange-50 text-orange-600 font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={active ? "text-orange-600" : "text-gray-500"}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} className="text-gray-500" />
              <span>Configuración</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
