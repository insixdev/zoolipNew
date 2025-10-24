import Button from "~/components/ui/button/Button&Link/Button";
import Link from "~/components/ui/button/Button&Link/Link";

type NavbarProps = {
  className?: string
  signButton?: boolean
}

export default function Navbar({ className = "", signButton = true }: NavbarProps) {
  return (
    <nav className={`w-full bg-white/5 backdrop-blur-sm border-b border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-1 pr-2">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-white hover:text-orange-200 transition-colors duration-200"
          >
            Inicio
          </Link>
          
          {/* Navigation Links - Centrados */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8">
            <Link 
              to="/adopt" 
              className="text-white/80 hover:text-orange-200 transition-colors duration-200 font-medium"
            >
              Adopt
            </Link>
            <Link 
              to="/community" 
              className="text-white/80 hover:text-orange-200 transition-colors duration-200 font-medium"
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className="text-white/80 hover:text-orange-200 transition-colors duration-200 font-medium"
            >
              About
            </Link>
          </div>
          
          {/* Auth Buttons */}
          {signButton && (
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                variant="secondary" 
                size="md"
              >
                Sign in
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
              >
                Sign up
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white/80 hover:text-orange-200 p-2 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  )
}
