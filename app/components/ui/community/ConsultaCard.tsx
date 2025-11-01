import { MessageCircle, ThumbsUp, Clock } from "lucide-react";

export type Consulta = {
  id: string;
  title: string;
  author: string;
  avatar: string;
  timestamp: string;
  responses: number;
  likes: number;
  category: string;
};

type ConsultaCardProps = {
  consulta: Consulta;
  onClick?: (consultaId: string) => void;
};

export default function ConsultaCard({ consulta, onClick }: ConsultaCardProps) {
  return (
    <div
      onClick={() => onClick?.(consulta.id)}
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
              <span className="font-medium">{consulta.likes} me gusta</span>
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
  );
}
