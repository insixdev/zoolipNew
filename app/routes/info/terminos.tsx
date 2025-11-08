import React from "react";
import { Link } from "react-router";

export default function Terminos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/landing" className="text-rose-600 font-semibold text-lg">
            Zoolip
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/community"
              className="text-gray-700 hover:text-rose-600 transition-colors font-medium"
            >
              ← Volver a la Comunidad
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Términos de Servicio
          </h1>
          <p className="text-gray-500 mb-8">
            Última actualización: 29 de octubre de 2025
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Introducción
              </h2>
              <p className="text-gray-700 mb-4">
                Bienvenido a Zoolip. Al acceder y utilizar nuestro servicio,
                aceptas cumplir con estos términos de servicio. Por favor,
                léelos detenidamente.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Uso del Servicio
              </h2>
              <p className="text-gray-700 mb-4">
                Zoolip proporciona una plataforma para compartir y descubrir
                contenido relacionado con mascotas y animales. Al utilizar
                nuestro servicio, aceptas:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                <li>No publicar contenido ofensivo o inapropiado</li>
                <li>Respetar los derechos de autor y propiedad intelectual</li>
                <li>No utilizar la plataforma para actividades ilegales</li>
                <li>Mantener la privacidad de otros usuarios</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Contenido del Usuario
              </h2>
              <p className="text-gray-700 mb-4">
                Eres responsable del contenido que publiques en Zoolip. Al
                compartir contenido, nos otorgas una licencia no exclusiva para
                mostrarlo en nuestra plataforma.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. Privacidad
              </h2>
              <p className="text-gray-600 mb-4">
                Tu privacidad es importante para nosotros. Consulta nuestra{" "}
                <Link
                  to="/info/privacidad"
                  className="text-rose-600 hover:underline"
                >
                  Política de Privacidad
                </Link>{" "}
                para obtener más información sobre cómo manejamos tus datos.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. Modificaciones
              </h2>
              <p className="text-gray-600">
                Nos reservamos el derecho de modificar estos términos en
                cualquier momento. Te notificaremos sobre cambios significativos
                a través de la plataforma o por correo electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                6. Contacto
              </h2>
              <p className="text-gray-600">
                Si tienes alguna pregunta sobre estos términos, contáctanos en{" "}
                <a
                  href="mailto:hola@zoolip.com"
                  className="text-rose-600 hover:underline"
                >
                  hola@zoolip.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-gray-500 text-sm">
                © 2025 Zoolip. Todos los derechos reservados.
              </span>
            </div>
            <div className="flex gap-6">
              <Link
                to="/info/terminos"
                className="text-gray-500 hover:text-rose-600 text-sm transition-colors"
              >
                Términos
              </Link>
              <Link
                to="/privacidad"
                className="text-gray-500 hover:text-rose-600 text-sm transition-colors"
              >
                Privacidad
              </Link>
              <Link
                to="/info/cookies"
                className="text-gray-500 hover:text-rose-600 text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
