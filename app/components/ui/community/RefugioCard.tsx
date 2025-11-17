import {
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Heart,
  Users,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export type Refugio = {
  id: string;
  name: string;
  description: string;
  image: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  established: string;
  animalsRescued: number;
  adoptionsCompleted: number;
  currentAnimals: number;
  specialties: string[];
  workingHours: string;
  availablePets: {
    id: string;
    name: string;
    type: "dog" | "cat" | "other";
    age: string;
    image: string;
  }[];
  verified: boolean;
};

type RefugioCardProps = {
  refugio: Refugio;
  onContact?: (
    refugioId: string,
    method: "phone" | "message" | "website"
  ) => void;
  onViewPets?: (refugioId: string) => void;
};

export default function RefugioCard({
  refugio,
  onContact,
  onViewPets,
}: RefugioCardProps) {
  return (
    <Card className="bg-white border border-gray-200 hover:border-rose-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={refugio.image}
          alt={refugio.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Logo and Verification */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          {refugio.logo && (
            <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg">
              <img
                src={refugio.logo}
                alt={`${refugio.name} logo`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          )}
          {refugio.verified && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              ✓ Verificado
            </div>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{refugio.name}</h3>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin size={16} />
            <span className="text-sm">{refugio.location}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{refugio.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-600">
              {refugio.animalsRescued}
            </div>
            <div className="text-xs text-gray-500">Rescatados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {refugio.adoptionsCompleted}
            </div>
            <div className="text-xs text-gray-500">Adoptados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {refugio.currentAnimals}
            </div>
            <div className="text-xs text-gray-500">Disponibles</div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {refugio.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
            {refugio.specialties.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{refugio.specialties.length - 3} más
              </span>
            )}
          </div>
        </div>

        {/* Available Pets Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">
              Mascotas Disponibles
            </h4>
            <button
              onClick={() => onViewPets?.(refugio.id)}
              className="text-rose-600 hover:text-rose-700 text-sm font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="flex -space-x-2">
            {refugio.availablePets.slice(0, 4).map((pet, index) => (
              <div
                key={pet.id}
                className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                title={`${pet.name} - ${pet.age}`}
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {refugio.availablePets.length > 4 && (
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                +{refugio.availablePets.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock size={16} />
          <span>{refugio.workingHours}</span>
        </div>

        {/* Contact Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onContact?.(refugio.id, "phone")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Phone size={16} />
            <span className="text-sm font-medium">Llamar</span>
          </button>

          <button
            onClick={() => onContact?.(refugio.id, "message")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <MessageCircle size={16} />
            <span className="text-sm font-medium">Mensaje</span>
          </button>

          {refugio.website && (
            <button
              onClick={() => onContact?.(refugio.id, "website")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Globe size={16} />
              <span className="text-sm font-medium">Web</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
