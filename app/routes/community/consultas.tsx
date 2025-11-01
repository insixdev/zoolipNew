import { MessageCircle, ThumbsUp, Clock, User } from "lucide-react";

export default function CommunityConsultas() {
  const consultas = [
    {
      id: "1",
      title: "¿Cómo ayudar a mi perro con ansiedad por separación?",
      author: "María González",
      avatar: "https://i.pravatar.cc/150?img=1",
      timestamp: "Hace 2 horas",
      responses: 12,
      likes: 24,
      category: "Comportamiento",
    },
    {
      id: "2",
      title: "¿Qué vacunas necesita un gato adoptado?",
      author: "Carlos Veterinario",
      avatar: "https://i.pravatar.cc/150?img=12",
      timestamp: "Hace 5 horas",
      responses: 8,
      likes: 15,
      category: "Salud",
    },
    {
      id: "3",
      title: "Consejos para la primera semana con mascota adoptada",
      author: "Ana Silva",
      avatar: "https://i.pravatar.cc/150?img=5",
      timestamp: "Hace 1 día",
      responses: 25,
      likes: 45,
      category: "Adopción",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl md:pl-64 px-4 pt-8 pb-10">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl mb-4 shadow-md">
          <MessageCircle className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Consultas de la Comunidad
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Haz preguntas y comparte conocimientos con otros amantes de los
          animales
        </p>
      </div>

      {/* Nueva consulta */}
      <div className="bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-md border border-rose-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="text-white" size={16} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Hacer una pregunta
          </h2>
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

      {/* Lista de consultas */}
      <div className="space-y-8">
        {consultas.map((consulta) => (
          <div
            key={consulta.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  src={consulta.avatar}
                  alt={consulta.author}
                  className="w-14 h-14 rounded-full ring-4 ring-rose-100"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-rose-600 transition-colors mb-2 line-clamp-2 pr-4">
                      {consulta.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium text-gray-700">
                        por {consulta.author}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {consulta.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 text-sm font-semibold rounded-full border border-rose-200 whitespace-nowrap">
                      {consulta.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-6">
                  <div className="flex items-center gap-3 text-gray-600 hover:text-rose-600 transition-colors cursor-pointer">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MessageCircle size={18} />
                    </div>
                    <span className="font-medium">
                      {consulta.responses} respuestas
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 hover:text-rose-600 transition-colors cursor-pointer">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <ThumbsUp size={18} />
                    </div>
                    <span className="font-medium">
                      {consulta.likes} me gusta
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Clock size={18} />
                    </div>
                    <span className="font-medium">
                      Activa {consulta.timestamp.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
