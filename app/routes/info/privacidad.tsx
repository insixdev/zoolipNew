import React from 'react';
import { Link } from 'react-router';

export default function Privacidad() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
          <p className="text-gray-500 mb-8">Última actualización: 29 de octubre de 2025</p>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Información que Recopilamos</h2>
              <p className="text-gray-700 mb-4">
                Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, publicas contenido o te comunicas con nosotros. Esto puede incluir:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                <li>Información de registro (nombre, correo electrónico)</li>
                <li>Contenido que publicas en la plataforma</li>
                <li>Mensajes que envías a otros usuarios</li>
                <li>Información de pago (si aplica)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Cómo Usamos tu Información</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos la información que recopilamos para:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                <li>Personalizar tu experiencia en la plataforma</li>
                <li>Comunicarnos contigo sobre actualizaciones y notificaciones</li>
                <li>Proteger contra actividades fraudulentas o no autorizadas</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Compartir Información</h2>
              <p className="text-gray-600 mb-4">
                No vendemos ni compartimos tu información personal con terceros, excepto en los siguientes casos:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                <li>Con tu consentimiento explícito</li>
                <li>Para cumplir con requisitos legales</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Tus Derechos</h2>
              <p className="text-gray-600 mb-4">
                Tienes derecho a acceder, corregir o eliminar tu información personal. Puedes gestionar tus preferencias de privacidad en la configuración de tu cuenta o contactándonos directamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Contacto</h2>
              <p className="text-gray-600">
                Si tienes preguntas sobre esta política de privacidad, contáctanos en <a href="mailto:privacidad@zoolip.com" className="text-rose-600 hover:underline">privacidad@zoolip.com</a>.
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
              <span className="text-gray-500 text-sm">© 2025 Zoolip. Todos los derechos reservados.</span>
            </div>
            <div className="flex gap-6">
              <Link to="/terminos" className="text-gray-500 hover:text-rose-600 text-sm transition-colors">Términos</Link>
              <Link to="/privacidad" className="text-rose-600 font-medium text-sm">Privacidad</Link>
              <Link to="/cookies" className="text-gray-500 hover:text-rose-600 text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
