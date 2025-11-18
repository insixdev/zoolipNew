import { Link, useLocation } from "react-router";
import { cn } from "~/lib/generalUtil";
import {
  Home,
  ClipboardList,
  Heart,
  Stethoscope,
  Settings,
  User,
  Shield,
  MessageCircle,
} from "lucide-react";
import { ADMIN_ROLES, type AdminRole } from "~/lib/constants";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type AdminSidebarProps = {
  adminRole: AdminRole;
};

export function AdminSidebar({ adminRole }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  // Configurar items del menú según el rol
  const getNavItems = (): NavItem[] => {
    switch (adminRole) {
      case ADMIN_ROLES.SYSTEM:
      case ADMIN_ROLES.ADMINISTRADOR:
        return [
          { to: "/admin", icon: Home, label: "Dashboard" },
          { to: "/admin/system", icon: Shield, label: "Sistema" },
        ];

      case ADMIN_ROLES.VETERINARIO:
        return [
          { to: "/admin", icon: Home, label: "Dashboard" },
          {
            to: "/admin/revision-mascota",
            icon: Stethoscope,
            label: "Revisión Médica",
          },
          { to: "/admin/mascotas", icon: User, label: "Mascotas" },
          {
            to: "/admin/solicitudes",
            icon: ClipboardList,
            label: "Solicitudes",
          },
          { to: "/admin/chat", icon: MessageCircle, label: "Chat" },
        ];

      case ADMIN_ROLES.REFUGIO:
        return [
          { to: "/admin", icon: Home, label: "Dashboard" },
          { to: "/admin/mascotas", icon: User, label: "Mascotas" },
          {
            to: "/admin/solicitudes",
            icon: ClipboardList,
            label: "Solicitudes",
          },
          { to: "/admin/chat", icon: MessageCircle, label: "Chat" },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40",
        "flex flex-col border-r border-gray-100"
      )}
    >
      <div className="p-4 border-b border-gray-100 bg-white">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
          {adminRole === ADMIN_ROLES.SYSTEM ||
          adminRole === ADMIN_ROLES.ADMINISTRADOR
            ? "Sistema"
            : "Administración"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {adminRole === ADMIN_ROLES.VETERINARIO && "Veterinaria"}
          {adminRole === ADMIN_ROLES.REFUGIO && "Refugio"}
          {adminRole === ADMIN_ROLES.ADMINISTRADOR && "Administrador"}
          {adminRole === ADMIN_ROLES.SYSTEM && "Sistema"}
        </p>
      </div>

      {/* Spacer to account for the navbar */}
      <div className="h-2"></div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
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
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
            isActive("/settings")
              ? "bg-rose-100 text-rose-700 font-medium"
              : "text-gray-700 hover:bg-rose-50 hover:text-rose-700"
          }`}
        >
          <Settings
            size={20}
            className={
              isActive("/settings")
                ? "text-rose-700"
                : "text-gray-500 group-hover:text-rose-700"
            }
          />
          <span className="text-sm">Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
