import { Link, useLocation } from "react-router";
import {
  Home,
  Search,
  Heart,
  Info,
  FileText,
  MessageCircle,
  Calendar,
  Settings,
  User,
} from "lucide-react";
import { cn } from "~/lib/generalUtil";

export type SidebarProps = {
  className?: string;
  onlyForUsers?: boolean;
};

const menuItems = [
  {
    label: "Home",
    path: "/community",
    icon: Home,
  },
  {
    label: "Buscar",
    path: "/community/buscar",
    icon: Search,
  },
  {
    label: "Consultas",
    path: "/community/consultas",
    icon: FileText,
  },
  {
    label: "Crear",
    path: "/community/crear",
    icon: User,
  },
  {
    label: "Refugios",
    path: "/community/refugios",
    icon: Heart,
  },
];

export default function Sidebar({
  className = "",
  onlyForUsers = false,
}: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40",
        "flex flex-col border-r border-gray-100",
        className
      )}
    >
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
          Comunidad
        </h2>
        <p className="text-sm text-gray-500 mt-1">Conecta y comparte</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-colors duration-200 group
                    ${
                      active
                        ? "bg-rose-100 text-rose-700 font-medium"
                        : "text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={
                      active
                        ? "text-rose-700"
                        : "text-gray-500 group-hover:text-rose-700"
                    }
                  />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <Settings
            size={20}
            className="text-gray-500 group-hover:text-rose-700"
          />
          <span className="text-sm">Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
