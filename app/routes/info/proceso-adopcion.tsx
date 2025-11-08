import React from "react";
import { Link } from "react-router";

export default function ProcesoAdopcion() {
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
            Proceso de Adopción
          </h1>
          <p className="text-gray-500 mb-8">
            Guía paso a paso para adoptar una mascota
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Encuentra a tu compañero ideal
              </h2>
              <p className="text-gray-700 mb-4">
                Explora nuestro listado de mascotas disponibles para adopción.
                Puedes filtrar por tipo, tamaño, edad y otras características
                para encontrar a tu compañero perfecto.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Completa el formulario de solicitud
              </h2>
              <p className="text-gray-700 mb-4">
                Una vez que encuentres una mascota que te gustaría adoptar,
                completa nuestro formulario de solicitud. Necesitamos esta
                información para asegurarnos de que eres un buen candidato para
                la adopción.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Entrevista y visita al hogar
              </h2>
              <p className="text-gray-700 mb-4">
                Un representante de Zoolip se pondrá en contacto contigo para
                programar una entrevista y, en algunos casos, una visita a tu
                hogar. Esto nos ayuda a garantizar que el entorno sea seguro y
                adecuado para la mascota.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Conoce a tu posible nueva mascota
              </h2>
              <p className="text-gray-700 mb-4">
                Si tu solicitud es aprobada, organizaremos un encuentro para que
                conozcas a la mascota. Es importante que todos los miembros de
                la familia estén presentes en este encuentro.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Firma del contrato de adopción
              </h2>
              <p className="text-gray-700 mb-4">
                Una vez que todos estén de acuerdo, firmarás un contrato de
                adopción y pagarás la tarifa de adopción, que cubre los gastos
                veterinarios básicos.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Lleva a tu nueva mascota a casa
              </h2>
              <p className="text-gray-700 mb-4">
                ¡Felicidades! Ahora eres el orgulloso dueño de una nueva
                mascota. Estaremos en contacto para asegurarnos de que todo vaya
                bien y ofrecerte nuestro apoyo continuo.
              </p>
            </section>

            <div className="mt-12 text-center">
              <Link
                to="/adopt"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
              >
                Ver mascotas en adopción
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
