import { Link, redirect, useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

export function TuPerfil() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher();

  const { user, logout: clientLogout } = useSmartAuth();

  // Cerrar menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Manejar respuesta del logout
  useEffect(() => {
    if (fetcher.data && fetcher.data.status === "success") {
      // Limpiar estado del cliente
      clientLogout();
      // Redirigir al login
      window.location.href = "/login";

    }

      redirect("/login");
  }, [fetcher.data, clientLogout]);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    fetcher.submit({}, { method: "post", action: "/api/auth/logout" });

  };

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "TU";
    const names = user.username?.split(" ") || [];
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.username?.[0]?.toUpperCase() || "U";
  };

  // Debug: ver si el componente se renderiza y el estado
  console.log("TuPerfil render:", {
    user,
    isProfileMenuOpen,
    hasUser: !!user,
  });

  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => {
          console.log("Toggle menu, current state:", isProfileMenuOpen);
          setIsProfileMenuOpen(!isProfileMenuOpen);
        }}
        className="flex items-center space-x-2 focus:outline-none group"
      >
        {user?.imagen_url ? (
          <img 
            src={user.imagen_url} 
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:shadow-lg transition-all"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-rose-700 font-medium group-hover:shadow-lg transition-all border-2 border-white shadow-sm">
            {getUserInitials()}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 group-hover:text-rose-600">
          {user?.username || "Perfil"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-500 group-hover:text-rose-500 hidden lg:inline-block transition-transform ${
            isProfileMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Menú desplegable */}
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-rose-100 py-1 z-[9999]">
          {/* Información del usuario */}
          {user && (
            <div className="px-4 py-3 border-b border-rose-100">
              <p className="text-sm font-medium text-gray-900">
                {user.username}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
              {user.biografia && (
                <p className="text-xs text-gray-600 mt-2 italic">
                  {user.biografia}
                </p>
              )}
            </div>
          )}

          <Link
            to="/community/profile"
            onClick={() => setIsProfileMenuOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {user ? "Mi perfil" : "Iniciar sesión"}
          </Link>
          <Link
            to="/settings"
            onClick={() => setIsProfileMenuOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Configuración
          </Link>
          <div className="border-t border-rose-100 my-1"></div>
          <div>
            {!user ? (
              <p>no tenes cuenta perra</p>
            ) : (
              <button
                onClick={handleLogout}
                disabled={fetcher.state !== "idle"}
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-3 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {fetcher.state !== "idle"
                  ? "Cerrando sesión..."
                  : "Cerrar sesión"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}