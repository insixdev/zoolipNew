
import { Link, Navigate, useNavigate } from "react-router";
import Button from "~/components/ui/button/Button";

type NavbarProps = {
  className?: string
  signButton?: boolean
}

export default function Navbar({ className = "", signButton=true }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <div className={`navbar shadow-sm w-full ${className}`}>
      <div className="w-full max-w-screen-2x1 mx-auto px-4 md:px-4 lg:px-4 xl:px-4 flex items-center justify-between">
        {/* Inicio */}
        <div className="flex-none">
          <Link to="/" className="btn btn-ghost normal-case text-2xl font-semibold">Inicio</Link>
        </div>

        {/* Links */}
        <div className="flex gap-2 ml-20 justify-between">
          <Link to="/adoptar" className="btn btn-ghost normal-case text-md">Adoptar</Link>
          <Link to="/comunidad" className="btn btn-ghost normal-case text-md">Comunidad</Link>
          <Link to="/acerca" className="btn btn-ghost normal-case text-md">Acerca</Link>
        </div>

        <div className="flex-1"></div>

        {/* Botones */}

        {signButton && (
          <>
            <Button variant="secondary" size="md" handleClick={() => {navigate("/login")}}>Sign in</Button>
            <Button variant="secondary" size="md" handleClick={() => {navigate("/register")}}>Sign up</Button>

          </>
        )}
      </div>
    </div>
  )
}
