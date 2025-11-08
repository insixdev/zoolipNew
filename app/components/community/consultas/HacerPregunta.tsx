import { MessageCircle } from "lucide-react";

export function HacerPregunta() {
  return (
    <div className="bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-md border border-rose-100 p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
          <MessageCircle className="text-white" size={16} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Hacer una pregunta</h2>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="¿Cuál es tu pregunta?"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-gray-900 placeholder-gray-500"
        />
        <textarea
          placeholder="Describe tu consulta con más detalle..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none transition-all text-gray-900 placeholder-gray-500"
        />
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <select className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-gray-900">
            <option>Seleccionar categoría</option>
            <option>Comportamiento</option>
            <option>Salud</option>
            <option>Adopción</option>
            <option>Alimentación</option>
            <option>Entrenamiento</option>
          </select>
          <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold">
            Publicar pregunta
          </button>
        </div>
      </div>
    </div>
  );
}
