import { useState, useRef } from "react";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import {
  Search,
  Filter,
  MapPin,
  Heart,
  X,
  Info,
  RotateCcw,
  Settings,
} from "lucide-react";
import { getAllMascotasService } from "~/features/adoption/adoptionService";
import type { MascotaDTO } from "~/features/adoption/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") || "";

  try {
    console.log("🐕 [ADOPT] Loading mascotas...");
    const mascotas = await getAllMascotasService(cookie);
    console.log("🐕 [ADOPT] Mascotas loaded:", mascotas.length);
    return { mascotas };
  } catch (error) {
    console.error("🐕 [ADOPT] Error loading mascotas:", error);
    return { mascotas: [] };
  }
}

type Pet = {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  location: string;
  image: string;
  description: string;
  personality: string[];
  vaccinated: boolean;
  sterilized: boolean;
  weight: string;
};

export default function Adopt() {
  const { mascotas } = useLoaderData<typeof loader>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [likedPets, setLikedPets] = useState<string[]>([]);
  const [passedPets, setPassedPets] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Convertir mascotas del backend al formato de la UI
  const pets: Pet[] = mascotas.map((mascota) => ({
    id: mascota.id.toString(),
    name: mascota.nombre,
    age: `${mascota.edad} ${mascota.edad === 1 ? "año" : "años"}`,
    breed: mascota.raza,
    gender: mascota.sexo || "Desconocido",
    location: "México", // TODO: Agregar ubicación en el backend
    image:
      mascota.imagen_url ||
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
    description: mascota.descripcion || "Sin descripción disponible",
    personality: [], // TODO: Agregar personalidad en el backend
    vaccinated: true, // TODO: Agregar en el backend
    sterilized: true, // TODO: Agregar en el backend
    weight: "N/A", // TODO: Agregar en el backend
  }));

  // Fallback a datos de ejemplo si no hay mascotas del backend
  const petsToShow =
    pets.length > 0
      ? pets
      : [
          {
            id: "max",
            name: "Max",
            age: "2 años",
            breed: "Labrador Mix",
            gender: "Macho",
            location: "Ciudad de México",
            image:
              "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            description: "Perro muy cariñoso y juguetón",
            personality: ["Juguetón", "Cariñoso", "Energético"],
            vaccinated: true,
            sterilized: true,
            weight: "25 kg",
          },
          {
            id: "luna",
            name: "Luna",
            age: "1 año",
            breed: "Golden Retriever",
            gender: "Hembra",
            location: "Guadalajara",
            image:
              "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            description: "Muy tranquila y perfecta para familias",
            personality: ["Tranquila", "Familiar", "Obediente"],
            vaccinated: true,
            sterilized: false,
            weight: "20 kg",
          },
          {
            id: "rocky",
            name: "Rocky",
            age: "3 años",
            breed: "Pastor Alemán",
            gender: "Macho",
            location: "Monterrey",
            image:
              "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            description: "Guardián leal y protector",
            personality: ["Protector", "Leal", "Inteligente"],
            vaccinated: true,
            sterilized: true,
            weight: "35 kg",
          },
          {
            id: "bella",
            name: "Bella",
            age: "6 meses",
            breed: "Mestizo",
            gender: "Hembra",
            location: "Puebla",
            image:
              "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            description: "Cachorra llena de energía",
            personality: ["Energética", "Curiosa", "Sociable"],
            vaccinated: false,
            sterilized: false,
            weight: "8 kg",
          },
          {
            id: "charlie",
            name: "Charlie",
            age: "4 años",
            breed: "Beagle",
            gender: "Macho",
            location: "Tijuana",
            image:
              "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            description: "Perfecto para apartamentos",
            personality: ["Tranquilo", "Adaptable", "Amigable"],
            vaccinated: true,
            sterilized: true,
            weight: "15 kg",
          },
          {
            id: "mia",
            name: "Mía",
            age: "2 años",
            breed: "Husky Siberiano",
            gender: "Hembra",
            location: "Querétaro",
            image:
              "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            description: "Activa y aventurera",
            personality: ["Aventurera", "Activa", "Independiente"],
            vaccinated: true,
            sterilized: true,
            weight: "22 kg",
          },
        ];

  const currentPet = petsToShow[currentIndex];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const threshold = 100;

      if (Math.abs(dragOffset.x) > threshold) {
        if (dragOffset.x > 0) {
          handleLike();
        } else {
          handlePass();
        }
      }

      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleLike = () => {
    if (currentPet) {
      setLikedPets([...likedPets, currentPet.id]);
      nextPet();
    }
  };

  const handlePass = () => {
    if (currentPet) {
      setPassedPets([...passedPets, currentPet.id]);
      nextPet();
    }
  };

  const nextPet = () => {
    if (currentIndex < petsToShow.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Remover de las listas si estaba ahí
      const prevPet = petsToShow[currentIndex - 1];
      setLikedPets(likedPets.filter((id) => id !== prevPet.id));
      setPassedPets(passedPets.filter((id) => id !== prevPet.id));
    }
  };

  const getCardStyle = () => {
    const rotation = dragOffset.x * 0.1;
    const opacity = 1 - Math.abs(dragOffset.x) * 0.002;

    return {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
      opacity: Math.max(opacity, 0.5),
      transition: isDragging ? "none" : "all 0.3s ease-out",
    };
  };

  if (currentIndex >= petsToShow.length) {
    return (
      <div className="min-h-screen bg-gray-100 relative">
        <CommunityNavbar />
        <SidebarContainer showSidebar={false} className="z-80" />

        <div className="flex items-center justify-center min-h-screen pt30">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Has visto todas las mascotas!
            </h2>
            <p className="text-gray-600 mb-6">
              Revisa tus favoritos o espera nuevas mascotas disponibles
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentIndex(0)}
                className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-semibold"
              >
                Empezar de nuevo
              </button>
              <Link
                to="/adopt/favoritos"
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold text-center"
              >
                Ver Favoritos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 relative">
      <CommunityNavbar />
      <SidebarContainer showSidebar={true} className="z-80" />

      <div className="pt-20 pb-10 px-4">
        {/* Header con buscador */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por raza, ubicación..."
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-orange-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900"
              />
            </div>
            <button className="p-3 bg-white border-2 border-orange-200 rounded-2xl hover:bg-orange-50 transition-colors">
              <Filter size={20} className="text-orange-600" />
            </button>
          </div>
        </div>

        {/* Card Stack Container */}
        <div className="max-w-sm mx-auto relative h-[600px]">
          {/* Next card (background) */}
          {currentIndex + 1 < petsToShow.length && (
            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transform scale-95 opacity-50">
              <img
                src={petsToShow[currentIndex + 1].image}
                alt={petsToShow[currentIndex + 1].name}
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          )}

          {/* Current card */}
          <div
            ref={cardRef}
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden"
            style={getCardStyle()}
            onMouseDown={handleMouseDown}
          >
            {/* Swipe indicators */}
            <div
              className={`absolute top-8 left-8 px-4 py-2 rounded-2xl font-bold text-lg border-4 transition-opacity ${
                dragOffset.x > 50
                  ? "opacity-100 bg-green-500 text-white border-green-400"
                  : "opacity-0"
              }`}
            >
              ME GUSTA
            </div>
            <div
              className={`absolute top-8 right-8 px-4 py-2 rounded-2xl font-bold text-lg border-4 transition-opacity ${
                dragOffset.x < -50
                  ? "opacity-100 bg-red-500 text-white border-red-400"
                  : "opacity-0"
              }`}
            >
              PASAR
            </div>

            {/* Pet Image */}
            <div className="relative h-3/4">
              <img
                src={currentPet.image}
                alt={currentPet.name}
                className="w-full h-full object-cover"
              />

              {/* Info button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <Info size={20} className="text-gray-700" />
              </button>
            </div>

            {/* Pet Info */}
            <div className="p-6 h-1/4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentPet.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      currentPet.gender === "Macho"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {currentPet.gender}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-2">
                  <span className="font-medium">{currentPet.age}</span>
                  <span>•</span>
                  <span>{currentPet.breed}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin size={16} />
                  <span className="text-sm">{currentPet.location}</span>
                </div>
              </div>
            </div>

            {/* Details overlay */}
            {showDetails && (
              <div className="absolute inset-0 bg-black/80 flex items-end">
                <div className="bg-white w-full p-6 rounded-t-3xl max-h-2/3 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Detalles de {currentPet.name}
                    </h3>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700">{currentPet.description}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Personalidad
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentPet.personality.map((trait, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Peso</span>
                        <p className="font-semibold">{currentPet.weight}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Vacunado</span>
                        <p className="font-semibold">
                          {currentPet.vaccinated ? "✅ Sí" : "❌ No"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Esterilizado
                        </span>
                        <p className="font-semibold">
                          {currentPet.sterilized ? "✅ Sí" : "❌ No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="max-w-sm mx-auto mt-8">
          <div className="flex items-center justify-center gap-6">
            {/* Undo button */}
            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={24} className="text-gray-600" />
            </button>

            {/* Pass button */}
            <button
              onClick={handlePass}
              className="w-16 h-16 bg-white border-4 border-red-300 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
            >
              <X size={28} className="text-red-500" />
            </button>

            {/* Like button */}
            <button
              onClick={handleLike}
              className="w-16 h-16 bg-white border-4 border-green-300 rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 transition-colors"
            >
              <Heart size={28} className="text-green-500" />
            </button>

            {/* Settings button */}
            <Link
              to="/settings"
              className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
            >
              <Settings size={24} className="text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="max-w-sm mx-auto mt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>
              {currentIndex + 1} de {petsToShow.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / petsToShow.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
