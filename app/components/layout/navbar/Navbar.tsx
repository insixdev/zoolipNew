import { useState } from "react";
import Button from "~/components/ui/button/Button&Link/Button";
import Link from "~/components/ui/button/Button&Link/Link";
import { Link as LinkRouter} from "react-router";
import MobileNavbar from "./components/MobileNavbar";

export type NavbarProps = {
  className?: string
  signButton?: boolean
  variant?: 'dark' | 'light'
  hideMobile?: boolean
}

export default function Navbar({ 
  className = "", 
  signButton = true, 
  variant = 'dark',
  hideMobile = false 
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const isDark = variant === 'dark';
  const isDarkNav = isDark 
    ? 'bg-white/5 border-white/10' 
    : 'bg-white border-gray-200'

  return (
    <nav className={`w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-sm ${isDarkNav} ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
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
          
          {/* Logo - Centered on mobile, normal on desktop */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-none">
            <Link 
              to="/" 
              className={`text-2xl font-bold transition-colors duration-200 ${
                isDark 
                  ? 'text-white hover:text-orange-200' 
                  : 'text-gray-800 hover:text-orange-500'
              }`}
            >
              Inicio
            </Link>
          </div>
          
          {/* Navigation Links - Centered (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8">
            <Link 
              to="/adopt" 
              className={`transition-colors duration-200 font-medium ${
                isDark 
                  ? 'text-white/80 hover:text-orange-200' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Adopt
            </Link>
            <Link 
              to="/community" 
              className={`transition-colors duration-200 font-medium ${
                isDark 
                  ? 'text-white/80 hover:text-orange-200' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-200 font-medium ${
                isDark 
                  ? 'text-white/80 hover:text-orange-200' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              About
            </Link>
          </div>
          
          {/* Auth Buttons (Desktop) */}
          {signButton && (
            <div className="hidden md:flex items-center space-x-3">
              <LinkRouter to="/login">
                <Button 
                  variant="secondary" 
                  size="sm"
                >
                  Sign in
                </Button>
              </LinkRouter>
              <LinkRouter to="/login">
                <Button 
                  variant="secondary" 
                  size="sm"
                >
                  Sign up
                </Button>

              </LinkRouter>
            </div>
          )}
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
    </nav>
  )
}
