import { useNavigate } from "react-router";
import Button from "~/components/ui/button/Button&Link/Button";
import Link from "~/components/ui/button/Button&Link/Link";

type NavbarProps = {
  className?: string
  signButton?: boolean
}

export default function Navbar({ className = "", signButton = true }: NavbarProps) {
  return (
    <nav className={`w-full shadow-md bg-white/5 backdrop-blur-sm ${className}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Inicio */}
          <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-bold text-white hover:text-orange-200 transition-colors">
             Inicio
            </Link>
          </div>
          
          {/* Links Centrados */}
          <div className="md:flex items-center justify-center gap-4 flex">
            <Link to="/adoptar" variant="primary">Adoptar</Link>
            <Link to="/comunidad" variant="primary">Comunidad</Link>
            <Link to="/acerca" variant="primary">Acerca</Link>
          </div>
          
          {/* Botones de Auth */}
          {signButton && (
            <div className="hidden md:flex  px-2">
              <Button 
                variant="secondary" 
                size="md" 
              >
                Sign in
              </Button>
              <Button 
                variant="secondary" 
                size="md" 
              >
                Sign up
              </Button>
            </div>
          )}
          
          {/* Menú móvil (hamburguesa) - opcional */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  )
}
