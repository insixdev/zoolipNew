import { Link, useLocation } from "react-router";
import { Home, MessageCircle, Heart, Settings, FileText } from "lucide-react";
import { cn } from "~/lib/generalUtil";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

export type AdoptSidebarProps = {
  className?: string;
  onlyForUsers?: boolean;
};

const menuItems = [
  {
    label: "Inicio",
    path: "/adopt",
    icon: Home,
    requiresAuth: false,
    requiresAdoptante: false,
  },
  {
    label: "Mis Adopciones",
    path: "/adopt/mis-adopciones",
    icon: Heart,
    requiresAuth: true,
    requiresAdoptante: true, // Solo para adoptantes
  },
  {
    label: "Chat",
    path: "/adopt/chatAdopt",
    icon: MessageCircle,
    requiresAuth: true,
    requiresAdoptante: false,
  },
  {
    label: "Solicitudes",
    path: "/adopt/solicitudes",
    icon: FileText,
    requiresAuth: true,
    requiresAdoptante: false,
  },
];

export default function AdoptSidebar({
  className = "",
  onlyForUsers = true,
}: AdoptSidebarProps) {
  const location = useLocation();
  const { user } = useSmartAuth();

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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Adopciones
        </h2>
        <p className="text-sm text-gray-500 mt-1">Encuentra tu compañero</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            // Si requiere ser adoptante y el usuario no lo es, no mostrar
            if (item.requiresAdoptante && user?.rol !== "ADOPTANTE") {
              return null;
            }

            // Si requiere autenticación y no hay usuario, mostrar deshabilitado
            if (item.requiresAuth && onlyForUsers) {
              return (
                <li key={item.path}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 line-through opacity-60 cursor-not-allowed`}
                    title="Acceso solo para usuarios registrados"
                    aria-disabled="true"
                  >
                    <Icon size={20} className="text-gray-400" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-colors duration-200 group
                    ${
                      active
                        ? "bg-orange-100 text-orange-700 font-medium"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={
                      active
                        ? "text-orange-700"
                        : "text-gray-500 group-hover:text-orange-700"
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
        >
          <Settings
            size={20}
            className="text-gray-500 group-hover:text-orange-700"
          />
          <span className="text-sm">Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
