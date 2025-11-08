import React from "react";
import { Link } from "react-router";

export default function About() {
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
            Sobre Nosotros
          </h1>
          <p className="text-gray-500 mb-8">
            Conoce más sobre Zoolip y nuestra misión
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Nuestra Historia
              </h2>
              <p className="text-gray-700 mb-4">
                Zoolip nació en 2023 con un objetivo claro: crear una comunidad
                donde los amantes de los animales pudieran conectarse, compartir
                experiencias y, lo más importante, ayudar a encontrar hogares
                amorosos para mascotas necesitadas.
              </p>
              <p className="text-gray-700 mb-4">
                Lo que comenzó como un pequeño proyecto entre amigos se ha
                convertido en una plataforma vibrante que conecta a miles de
                personas apasionadas por el bienestar animal.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Nuestra Misión
              </h2>
              <p className="text-gray-700 mb-4">
                En Zoolip nos comprometemos a:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                <li>Facilitar la adopción responsable de mascotas</li>
                <li>
                  Crear una comunidad solidaria de amantes de los animales
                </li>
                <li>Promover la tenencia responsable de mascotas</li>
                <li>Educar sobre el cuidado y bienestar animal</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Nuestro Equipo
              </h2>
              <p className="text-gray-700 mb-4">
                Somos un equipo multidisciplinario de amantes de los animales,
                desarrolladores, diseñadores y especialistas en bienestar
                animal. Lo que nos une es nuestra pasión por crear un mundo
                mejor para las mascotas y sus dueños.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Únete a Nuestra Comunidad
              </h2>
              <p className="text-gray-700 mb-6">
                Ya sea que estés buscando adoptar, compartir historias de tu
                mascota o simplemente conectarte con otros amantes de los
                animales, ¡te damos la bienvenida a Zoolip!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/community"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                >
                  Explorar la Comunidad
                </Link>
                <Link
                  to="/adopt"
                  className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                >
                  Ver Mascotas en Adopción
                </Link>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contáctanos
              </h2>
              <p className="text-gray-700 mb-4">
                ¿Tienes preguntas o comentarios? Nos encantaría saber de ti.
              </p>
              <p className="text-gray-700">
                Email:{" "}
                <a
                  href="mailto:hola@zoolip.com"
                  className="text-rose-600 hover:underline"
                >
                  hola@zoolip.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
