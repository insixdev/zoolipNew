import React from 'react';
import { Link } from 'react-router';

export default function InfoAdopcion() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/community" className="text-rose-600 font-semibold text-lg">
            Zoolip
          </Link>
          <nav className="flex gap-6">
            <Link to="/community" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
              ← Volver a la Comunidad
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Información sobre Adopción</h1>
          <p className="text-gray-500 mb-8">Todo lo que necesitas saber sobre la adopción responsable</p>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">¿Por qué adoptar?</h2>
              <p className="text-gray-700 mb-4">
                Adoptar una mascota es un acto de amor que cambia vidas. No solo le das un hogar a un animal necesitado, sino que también obtienes un compañero leal que llenará tu vida de alegría.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Beneficios de la adopción</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                <li>Salvas una vida y le das una segunda oportunidad</li>
                <li>Recibes una mascota que ha sido evaluada y atendida médicamente</li>
                <li>Ayudas a reducir el número de animales en situación de calle</li>
                <li>Recibes el apoyo y asesoramiento de nuestro equipo</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Proceso de adopción</h2>
              <p className="text-gray-700 mb-4">
                Nuestro proceso de adopción está diseñado para garantizar el mejor resultado tanto para las mascotas como para las familias adoptivas. Conoce los pasos a seguir:
              </p>
              <Link 
                to="/proceso-adopcion" 
                className="inline-flex items-center text-rose-600 hover:underline font-medium"
              >
                Ver proceso de adopción completo →
              </Link>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preguntas frecuentes</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800">¿Qué incluye la adopción?</h3>
                  <p className="text-gray-700 mt-1">Todas nuestras mascotas están esterilizadas, vacunadas, desparasitadas y con chip de identificación.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">¿Puedo adoptar si vivo en un piso?</h3>
                  <p className="text-gray-700 mt-1">Sí, siempre que puedas ofrecer los cuidados y paseos necesarios para el bienestar del animal.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">¿Qué debo hacer si ya no puedo cuidar de mi mascota?</h3>
                  <p className="text-gray-700 mt-1">Contáctanos de inmediato. Nunca abandones a un animal. Juntos encontraremos la mejor solución.</p>
                </div>
              </div>
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
