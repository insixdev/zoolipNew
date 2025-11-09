import { Link, useLocation } from "react-router";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/generalUtil";
import { TuPerfil } from "~/components/layout/shared/TuPerfil";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";
import { FaUserShield } from "react-icons/fa";

// NavItem component for navigation items
const NavItem = ({
  to,
  icon,
  label,
  isActive,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center transition-colors group ${
      isActive ? "text-rose-700" : "text-rose-500/90 hover:text-rose-700"
    }`}
  >
    <div
      className={`p-2 rounded-lg transition-all ${
        isActive ? "bg-rose-200/70" : "group-hover:bg-rose-100/50"
      }`}
    >
      {icon}
    </div>
    <span className="text-xs mt-1">{label}</span>
    {isActive && <div className="w-8 h-1 bg-rose-500 rounded-full mt-1" />}
  </Link>
);

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

type CommunityNavbarProps = {
  className?: string;
};

export default function CommunityNavbar({
  className = "",
}: CommunityNavbarProps) {
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Cerrar menús cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-20",
        "bg-white border-b border-rose-100",
        "transition-all duration-200 h-20", // Altura fija
        className
      )}
    >
      <div className="w-full max-w-8xl mx-auto pr-8 pl-24 h-20 flex items-center">
        {/* Navegación central */}
        <div className="flex-1 flex items-center justify-center space-x-10">
          {/* Admin Link - Only visible to admins */}
          <AuthRoleComponent allowedRoles={[USER_ROLES.ADMIN]}>
            <NavItem
              to="/admin"
              icon={
                <FaUserShield className="h-5 w-5" />
              }
              label="Admin"
              isActive={isActive('/admin')}
            />
          </AuthRoleComponent>
          
          <NavItem
            to="/adopt"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            label="Adoptar"
            isActive={isActive("/adopt")}
            key="adopt"
          />
          <NavItem
            to="/community"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            label="Comunidad"
            isActive={isActive("/community")}
            key="community"
          />
        </div>
        {/* Mensajes, notificaciones y perfil a la derecha */}
        <div className="ml-auto flex items-center space-x-1">
          {/* Messages - Solo para usuarios autenticados */}
          <AuthRoleComponent
            allowedRoles={[
              USER_ROLES.ADMIN,
              USER_ROLES.ADOPTANTE,
              USER_ROLES.USER,
            ]}
          >
            <Link
              to="/community/chatCommunity"
              className="p-2 rounded-full hover:bg-rose-50 transition-colors relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 hover:text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
            </Link>
          </AuthRoleComponent>

          {/* Notifications - Solo para usuarios autenticados */}
          <AuthRoleComponent
            allowedRoles={[
              USER_ROLES.ADMIN,
              USER_ROLES.ADOPTANTE,
              USER_ROLES.USER,
            ]}
          >
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-rose-50 transition-colors relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 hover:text-rose-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Menú desplegable de notificaciones */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-rose-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-rose-50">
                    <h3 className="font-medium text-gray-900">
                      Notificaciones
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Notificación de mensajes */}
                    <Link
                      to="/community/chatCommunity"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-rose-50 transition-colors border-b border-rose-50"
                    >
                      <div className="bg-rose-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-rose-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Nuevos mensajes
                        </p>
                        <p className="text-xs text-gray-500">
                          Tienes 3 mensajes sin leer
                        </p>
                      </div>
                      <span className="text-xs text-rose-500">Ahora</span>
                    </Link>

                    {/* Notificación de actividad */}
                    <Link
                      to="/activity"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-rose-50 transition-colors border-b border-rose-50"
                    >
                      <div className="bg-amber-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Nueva actividad
                        </p>
                        <p className="text-xs text-gray-500">
                          5 publicaciones nuevas
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">5 min</span>
                    </Link>
                  </div>
                  <div className="px-4 py-2 border-t border-rose-50 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-sm font-medium text-rose-600 hover:text-rose-700"
                    >
                      Ver todas las notificaciones
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </AuthRoleComponent>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-200 mx-1"></div>

          {/* Perfil */}
          <TuPerfil />
        </div>
      </div>
    </nav>
  );
}
