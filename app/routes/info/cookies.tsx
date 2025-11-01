import React from "react";
import { Link } from "react-router";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/community" className="text-rose-600 font-semibold text-lg">
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
            Política de Cookies
          </h1>
          <p className="text-gray-500 mb-8">
            Última actualización: 29 de octubre de 2025
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. ¿Qué son las cookies?
              </h2>
              <p className="text-gray-700 mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en
                tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a
                mejorar tu experiencia de navegación y a entender cómo
                interactúas con nuestra plataforma.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Tipos de cookies que utilizamos
              </h2>
              <p className="text-gray-700 mb-4">
                En Zoolip utilizamos los siguientes tipos de cookies:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Esenciales:</strong> Necesarias para el funcionamiento
                  básico del sitio.
                </li>
                <li>
                  <strong>Rendimiento:</strong> Nos ayudan a entender cómo los
                  visitantes interactúan con nuestro sitio.
                </li>
                <li>
                  <strong>Funcionalidad:</strong> Permiten recordar tus
                  preferencias y configuraciones.
                </li>
                <li>
                  <strong>Publicidad:</strong> Utilizadas para mostrarte
                  anuncios relevantes.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Gestión de cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Puedes gestionar tus preferencias de cookies a través de la
                configuración de tu navegador. Ten en cuenta que deshabilitar
                ciertas cookies puede afectar la funcionalidad de nuestro sitio
                web.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Más información
              </h2>
              <p className="text-gray-700 mb-4">
                Para más información sobre cómo utilizamos tus datos personales,
                por favor consulta nuestra{" "}
                <Link
                  to="/info/privacidad"
                  className="text-rose-600 hover:underline"
                >
                  Política de Privacidad
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
