import { useState } from "react";
import { useLocation } from "react-router";
import Button from "~/components/ui/button/Button&Link/Button";
import Link from "~/components/ui/button/Button&Link/Link";
import { Link as LinkRouter} from "react-router";
import MobileNavbar from "./components/MobileNavbar";

export type LandingNavbarProps = {
  className?: string
  signButton?: boolean
  variant?: 'dark' | 'light'
  hideMobile?: boolean
  floating?: boolean
  fill?: boolean
  hideHome?: boolean
  linkHoverStyle?: string
}

export default function LandingNavbar({ 
  className = "", 
  signButton = true, 
  variant = 'dark',
  hideMobile = false,
  floating = false,
  fill = false,
  hideHome = false,
  linkHoverStyle = ""
}: LandingNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const isDark = variant === 'dark';
  const isDarkNav = isDark
    ? 'bg-white/5 border border-white/10'
    : [
      'bg-pink-200/20 bg-blend-multiply',
      'shadow-inner-[inset_0_5px_6px_rgba(0,2,2,0)]',
      'rounded-md',
      'shadow-xl drop-shadow-sm shadow-pink-300/20',
      'filter saturate-100 backdrop-filter backdrop-contrast-105',
      'hover:bg-pink-500-30transition-colors duration-300',
    ].join(' ');  const floatingStyles = floating ? 'mx-3 mt-1 rounded-2xl backdrop-blur-md shadow-lg border ' : '';
  const fillStyle = fill ? 'bg-white' : (variant === 'dark' ? 'bg-transparent' : 'bg-white');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${floatingStyles} ${fillStyle} ${className} ${isDarkNav}`}>
      <div className="max-w-8xl mx-auto px-11">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button (only visible on mobile) */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isDark 
                  ? 'text-white/80 hover:text-orange-200 hover:bg-white/10' 
                  : 'text-gray-600 hover:text-orange-500 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Logo/Home (optional) - Centered on mobile, normal on desktop */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-none">
            {!hideHome && (
              <div className="relative">
                <Link 
                  to="/" 
                  className={`text-2xl font-bold transition-colors duration-200 ${
                    isDark 
                      ? 'text-white hover:text-orange-200' 
                      : 'text-gray-800 hover:text-orange-500'
                  } ${linkHoverStyle}`}
                >
                Zoolip
                </Link>
              </div>
            )}
          </div>
          
          {/* Navigation Links - Centered (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-10">
            <LinkRouter 
              to="/adopt" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/adopt')
                  ? (isDark ? 'text-orange-200 font-semibold' : 'text-orange-600 font-semibold')
                  : (isDark ? 'text-white/80 hover:text-orange-200' : 'text-gray-600 hover:text-orange-500')
              }`}
            >
              Adoptar
            </LinkRouter>

            <LinkRouter 
              to="/" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/')
                  ? (isDark ? 'text-orange-200 font-semibold' : 'text-orange-600 font-semibold')
                  : (isDark ? 'text-white/80 hover:text-orange-200' : 'text-gray-600 hover:text-orange-500')
              }`}
            >
              Comunidad
            </LinkRouter>
            <LinkRouter 
              to="/landing" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/landing')
                  ? (isDark ? 'text-orange-200 font-semibold' : 'text-orange-600 font-semibold')
                  : (isDark ? 'text-white/80 hover:text-orange-200' : 'text-gray-600 hover:text-orange-500')
              }`}
            >
              Acerca
            </LinkRouter>
          </div>
          
          {/* Right side - Auth only */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons */}
            {signButton && (
              <div className="hidden md:flex items-center space-x-3">
                <LinkRouter to="/login">
                  <Button 
                    variant="secondary" 
                    size="sm"
                  >
                    Iniciar sesión
                  </Button>
                </LinkRouter>
                <LinkRouter to="/register">
                  <Button 
                    variant="secondary" 
                    size="sm"
                  >
                    Registrarse
                  </Button>
                </LinkRouter>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {!hideMobile && (
        <MobileNavbar 
          isOpen={isMenuOpen} 
          onClose={toggleMenu} 
          variant={variant} 
          signButton={signButton} 
        />
      )}
    </header>
  )
}