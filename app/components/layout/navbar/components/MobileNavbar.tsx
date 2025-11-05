import Link from "~/components/ui/button/Button&Link/Link";
import Button from "~/components/ui/button/Button&Link/Button";
import type { NavbarProps } from "../Navbar";
import { User } from "~/features/user/User";

interface MobileNavbarProps extends NavbarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export default function MobileNavbar({
  variant = "dark",
  isOpen,
  onClose,
  signButton = true,
  user = null,
}: MobileNavbarProps) {
  const isDark = variant === "dark";

  const navLinks = [
    { to: "/adopt", text: "Adopt" },
    { to: "/community", text: "Community" },
    { to: "/about", text: "About" },
  ];

  return (
    <div
      className={`md:hidden fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}
    >
      {/* Overlay with better opacity */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile menu panel - now on the right */}
      <div
        className={`fixed inset-y-0 right-0 w-72 max-w-full bg-white/5 backdrop-blur-xl shadow-2xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out ${
          isDark ? "bg-gray-900/80" : "bg-white/95"
        }`}
      >
        {/* Header with close button */}
        <div
          className={`flex items-center justify-between px-6 py-4 ${
            isDark ? "border-b border-white/10" : "border-b border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 -mr-2 rounded-full transition-colors duration-200 ${
              isDark
                ? "text-white/80 hover:text-orange-300 hover:bg-white/10"
                : "text-gray-500 hover:text-orange-500 hover:bg-gray-100"
            }`}
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navLinks.map(({ to, text }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isDark
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-gray-800 hover:text-orange-600 hover:bg-white/20"
                }`}
                onClick={onClose}
              >
                {text}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Solo mostrar si el usuario NO está autenticado */}
          {signButton && !user && (
            <div
              className={`mt-8 pt-6 px-2 space-y-4 ${
                isDark ? "border-t border-white/10" : "border-t border-white/20"
              }`}
            >
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center text-base font-medium"
                  onClick={onClose}
                >
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center text-base font-medium"
                  onClick={onClose}
                >
                  Registrarse
                </Button>
              </Link>
            </div>
          )}

          {/* User Menu - Solo mostrar si el usuario está autenticado */}
          {user && (
            <div
              className={`mt-8 pt-6 px-2 space-y-4 ${
                isDark ? "border-t border-white/10" : "border-t border-white/20"
              }`}
            >
              <div
                className={`text-center text-sm ${isDark ? "text-white/80" : "text-gray-600"}`}
              >
                Hola, {user.username}
              </div>
              <Link to="/profile">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center text-base font-medium"
                  onClick={onClose}
                >
                  Mi Perfil
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
