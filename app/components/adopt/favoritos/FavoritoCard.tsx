import {
  Heart,
  MapPin,
  Calendar,
  Share2,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

interface FavoritoCardProps {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  location: string;
  image: string;
  description: string;
  refugio: string;
  dateAdded: string;
  status: string;
  urgency: string;
}

export function FavoritoCard({
  id,
  name,
  age,
  breed,
  gender,
  location,
  image,
  description,
  refugio,
  dateAdded,
  status,
  urgency,
}: FavoritoCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Disponible
          </span>
        );
      case "adopted":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            Adoptado
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            En proceso
          </span>
        );
      default:
        return null;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === "high") {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          Urgente
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge(status)}
          {getUrgencyBadge(urgency)}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart size={18} className="text-red-500 fill-red-500" />
          </button>
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Trash2 size={18} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              gender === "Macho"
                ? "bg-blue-100 text-blue-800"
                : "bg-pink-100 text-pink-800"
            }`}
          >
            {gender}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Edad:</span> {age}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Raza:</span> {breed}
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <MapPin size={14} />
            {location}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Refugio:</span> {refugio}
          </p>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>
              Guardado: {new Date(dateAdded).toLocaleDateString("es-ES")}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/adopt/${id}`}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors text-sm"
          >
            Ver detalles
          </Link>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle size={16} />
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
