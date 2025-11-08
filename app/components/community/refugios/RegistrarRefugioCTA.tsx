export function RegistrarRefugioCTA() {
  return (
    <div className="mt-12 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-8 text-center border border-orange-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        ¿Tienes un refugio?
      </h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Únete a nuestra red de refugios y organizaciones. Ayuda a más animales a
        encontrar un hogar amoroso.
      </p>
      <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl">
        Registrar mi refugio
      </button>
    </div>
  );
}
