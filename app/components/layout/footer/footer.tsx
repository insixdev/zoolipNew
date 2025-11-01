import Link from "~/components/ui/button/Button&Link/Link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-orange-200/20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Zoolip</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Conectando corazones, salvando vidas. Una plataforma que une
              rescatistas, veterinarios y familias para dar segundas
              oportunidades.
            </p>
          </div>

          {/* Enlaces principales */}
          <div>
            <h4 className="text-white font-semibold mb-4">Adopción</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/adopcion"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Todo sobre adopción
                </Link>
              </li>
              <li>
                <Link
                  to="/adopt"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Ver mascotas disponibles
                </Link>
              </li>
              <li>
                <Link
                  to="/proceso-adopcion"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Cómo adoptar
                </Link>
              </li>
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h4 className="text-white font-semibold mb-4">Comunidad</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/community"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Únete a la comunidad
                </Link>
              </li>
              <li>
                <Link
                  to="/login?redirect=/volunteer"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Ser voluntario
                </Link>
              </li>
              <li>
                <Link
                  to="/stories"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Historias de éxito
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-white font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-300 hover:text-orange-200 transition-colors text-sm"
                >
                  Centro de ayuda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Zoolip. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/info/privacidad"
                className="text-gray-400 hover:text-orange-200 transition-colors text-sm"
              >
                Privacidad
              </Link>
              <Link
                to="/info/terminos"
                className="text-gray-400 hover:text-orange-200 transition-colors text-sm"
              >
                Términos
              </Link>
              <Link
                to="/info/cookies"
                className="text-gray-400 hover:text-orange-200 transition-colors text-sm"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
