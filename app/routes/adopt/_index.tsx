import { useState, useRef } from "react";
import { Link } from "react-router";
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

export default function AdoptIndex() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInfoButtonPressed, setIsInfoButtonPressed] = useState(false);
  const [likedPets, setLikedPets] = useState<string[]>([]);
  const [passedPets, setPassedPets] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const pets = [
    {
      id: "max",
      name: "Max",
      age: "2 años",
      breed: "Labrador Mix",
      gender: "Macho",
      location: "Ciudad de México",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "Perro muy cariñoso y juguetón que ama estar con su familia",
      personality: ["Juguetón", "Cariñoso", "Energético"],
      vaccinated: true,
      sterilized: true,
      weight: "25 kg",
      shelter: "Refugio Esperanza",
      adoptionFee: "$500",
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
      description: "Muy tranquila y perfecta para familias con niños pequeños",
      personality: ["Tranquila", "Familiar", "Obediente"],
      vaccinated: true,
      sterilized: false,
      weight: "20 kg",
      shelter: "Patitas Felices",
      adoptionFee: "$600",
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
      description: "Guardián leal y protector, ideal para casas con jardín",
      personality: ["Protector", "Leal", "Inteligente"],
      vaccinated: true,
      sterilized: true,
      weight: "35 kg",
      shelter: "Amor Animal",
      adoptionFee: "$700",
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
      description: "Cachorra llena de energía que necesita una familia activa",
      personality: ["Energética", "Curiosa", "Sociable"],
      vaccinated: false,
      sterilized: false,
      weight: "8 kg",
      shelter: "Refugio San Francisco",
      adoptionFee: "$300",
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
      description: "Perfecto para apartamentos, muy tranquilo y adaptable",
      personality: ["Tranquilo", "Adaptable", "Amigable"],
      vaccinated: true,
      sterilized: true,
      weight: "15 kg",
      shelter: "Hogar Canino",
      adoptionFee: "$450",
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
      description:
        "Activa y aventurera, perfecta para personas que aman el ejercicio",
      personality: ["Aventurera", "Activa", "Independiente"],
      vaccinated: true,
      sterilized: true,
      weight: "22 kg",
      shelter: "Refugio Norte",
      adoptionFee: "$800",
    },
  ];

  const currentPet = pets[currentIndex];
  const handleMouseDown = (e: React.MouseEvent) => {
    if (showDetails) return;

    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = (e.clientY - startY) * 0.2;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const threshold = 80;
      const finalX = e.clientX - startX;

      console.log("Drag ended:", { finalX, threshold });

      if (Math.abs(finalX) > threshold) {
        if (finalX > 0) {
          console.log("Liking pet");
          handleLike();
        } else {
          console.log("Passing pet");
          handlePass();
        }
      } else {
        setDragOffset({ x: 0, y: 0 });
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showDetails) return;

    setIsDragging(true);
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = (touch.clientY - startY) * 0.2;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      setIsDragging(false);
      const threshold = 80;
      const touch = e.changedTouches[0];
      const finalX = touch.clientX - startX;

      console.log("Touch ended:", { finalX, threshold });

      if (Math.abs(finalX) > threshold) {
        if (finalX > 0) {
          console.log("Liking pet (touch)");
          handleLike();
        } else {
          console.log("Passing pet (touch)");
          handlePass();
        }
      } else {
        setDragOffset({ x: 0, y: 0 });
      }

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };
  const handleLike = () => {
    if (currentPet) {
      setLikedPets([...likedPets, currentPet.id]);
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
      setTimeout(() => {
        nextPet();
      }, 300);
    }
  };

  const handlePass = () => {
    if (currentPet) {
      setPassedPets([...passedPets, currentPet.id]);
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
      setTimeout(() => {
        nextPet();
      }, 300);
    }
  };

  const nextPet = () => {
    if (currentIndex < pets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
      setIsAnimating(false);
    }
  };

  const handleShowDetails = () => {
    setIsInfoButtonPressed(true);

    // Animación del botón primero
    setTimeout(() => {
      setShowDetails(true);
      setIsAnimating(true);
      setIsInfoButtonPressed(false);
    }, 200);
  };

  const handleHideDetails = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 300); // Duración de la animación
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevPet = pets[currentIndex - 1];
      setLikedPets(likedPets.filter((id) => id !== prevPet.id));
      setPassedPets(passedPets.filter((id) => id !== prevPet.id));
    }
  };

  const getCardStyle = () => {
    const rotation = dragOffset.x * 0.05;
    const opacity = Math.max(1 - Math.abs(dragOffset.x) * 0.0008, 0.8);
    const scale = Math.max(1 - Math.abs(dragOffset.x) * 0.0002, 0.95);

    return {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
      opacity,
      transition: isDragging
        ? "none"
        : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    };
  };

  if (currentIndex >= pets.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
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
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col overflow-hidden">
      {/* Header compacto */}
      <div className="flex-shrink-0 px-4 pt-0 pb-1">
        <div className="w-full max-w-6xl mx-auto flex justify-end">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-shrink-0">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar mascotas..."
                className="w-44 pl-9 pr-3 py-2 bg-white/90 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 text-sm"
              />
            </div>

            <select className="px-3 py-2 bg-white/90 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 text-sm flex-shrink-0">
              <option>Edad</option>
              <option>Cachorro</option>
              <option>Joven</option>
              <option>Adulto</option>
              <option>Senior</option>
            </select>

            <button className="p-2 bg-white/90 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex-shrink-0">
              <Filter size={16} className="text-orange-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col px-4 min-h-0">
        {/* Card Stack Container */}
        <div className="flex-1 max-w-sm mx-auto relative w-full mb-2">
          {/* Next card (background) */}
          {currentIndex + 1 < pets.length && (
            <div className="absolute inset-4 bg-white rounded-2xl shadow-lg transform scale-95 opacity-40 rotate-1">
              <img
                src={pets[currentIndex + 1].image}
                alt={pets[currentIndex + 1].name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          )}

          {/* Current card */}
          <div
            ref={cardRef}
            className="absolute inset-0 bg-white rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden select-none"
            style={getCardStyle()}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Swipe indicators */}
            <div
              className={`absolute top-6 left-6 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-200 z-10 ${
                dragOffset.x > 60
                  ? "opacity-100 bg-green-500 text-white border-green-400 scale-110 shadow-lg"
                  : "opacity-0"
              }`}
            >
              <Heart size={32} fill="white" />
            </div>
            <div
              className={`absolute top-6 right-6 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-200 z-10 ${
                dragOffset.x < -60
                  ? "opacity-100 bg-red-500 text-white border-red-400 scale-110 shadow-lg"
                  : "opacity-0"
              }`}
            >
              <X size={32} />
            </div>
            {/* Pet Image */}
            <div className="relative h-3/5">
              <img
                src={currentPet.image}
                alt={currentPet.name}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Info button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDetails();
                }}
                className={`absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 active:scale-95 ${
                  isInfoButtonPressed
                    ? "scale-125 bg-orange-500 shadow-2xl shadow-orange-500/50 animate-bounce"
                    : ""
                }`}
              >
                <Info
                  size={18}
                  className={`transition-all duration-200 ${
                    isInfoButtonPressed
                      ? "text-white scale-110"
                      : "text-gray-700"
                  }`}
                />

                {/* Ripple effects */}
                {isInfoButtonPressed && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></div>
                    <div
                      className="absolute inset-0 rounded-full bg-orange-300 animate-ping opacity-50"
                      style={{ animationDelay: "100ms" }}
                    ></div>
                    <div
                      className="absolute -inset-2 rounded-full bg-orange-200 animate-ping opacity-25"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                  </>
                )}
              </button>
            </div>

            {/* Pet Info - Información resumida */}
            <div className="p-4 h-2/5 flex flex-col justify-between">
              {/* Header con nombre y género */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentPet.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    currentPet.gender === "Macho"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-pink-100 text-pink-800"
                  }`}
                >
                  {currentPet.gender}
                </span>
              </div>

              {/* Información básica */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="font-medium text-lg">{currentPet.age}</span>
                  <span>•</span>
                  <span className="text-lg">{currentPet.breed}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-orange-500" />
                  <span>{currentPet.location}</span>
                </div>
              </div>

              {/* Descripción corta */}
              <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                {currentPet.description}
              </p>

              {/* Personalidad resumida */}
              <div className="flex flex-wrap gap-1">
                {currentPet.personality.slice(0, 2).map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{currentPet.personality.length - 2} más
                </span>
              </div>
            </div>
            {/* Details overlay */}
            {showDetails && (
              <div
                className={`fixed inset-0 z-50 flex flex-col transition-all duration-300 ease-out ${
                  isAnimating ? "bg-black/90 backdrop-blur-sm" : "bg-black/0"
                }`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    handleHideDetails();
                  }
                }}
              >
                {/* Header con botón de cerrar */}
                <div
                  className={`flex-shrink-0 p-4 flex justify-between items-center transition-all duration-300 ease-out ${
                    isAnimating
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                >
                  <button
                    onClick={handleHideDetails}
                    className="flex items-center gap-2 text-white hover:text-orange-300 transition-all duration-200 hover:scale-105"
                  >
                    <X size={20} />
                    <span className="font-medium">Volver</span>
                  </button>
                  <h3 className="text-lg font-bold text-white">
                    Detalles de {currentPet.name}
                  </h3>
                  <div className="w-16"></div> {/* Spacer for centering */}
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div
                    className={`bg-white w-full max-w-sm mx-auto p-4 rounded-t-2xl min-h-full transition-all duration-300 ease-out ${
                      isAnimating
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-8 scale-95"
                    }`}
                  >
                    {/* Contenido del overlay */}
                    <div
                      className={`space-y-4 transition-all duration-500 ease-out ${
                        isAnimating
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: isAnimating ? "150ms" : "0ms" }}
                    >
                      <div
                        className={`transition-all duration-400 ease-out ${
                          isAnimating
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3"
                        }`}
                        style={{
                          transitionDelay: isAnimating ? "200ms" : "0ms",
                        }}
                      >
                        <p className="text-gray-700 leading-relaxed">
                          {currentPet.description}
                        </p>
                      </div>

                      <div
                        className={`transition-all duration-400 ease-out ${
                          isAnimating
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3"
                        }`}
                        style={{
                          transitionDelay: isAnimating ? "250ms" : "0ms",
                        }}
                      >
                        <h4 className="font-bold text-gray-900 mb-2">
                          Refugio
                        </h4>
                        <p className="text-gray-700">{currentPet.shelter}</p>
                      </div>

                      <div
                        className={`transition-all duration-400 ease-out ${
                          isAnimating
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3"
                        }`}
                        style={{
                          transitionDelay: isAnimating ? "300ms" : "0ms",
                        }}
                      >
                        <h4 className="font-bold text-gray-900 mb-2">
                          Personalidad Completa
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentPet.personality.map((trait, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                                isAnimating
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-90"
                              }`}
                              style={{
                                transitionDelay: isAnimating
                                  ? `${350 + index * 50}ms`
                                  : "0ms",
                              }}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        className={`grid grid-cols-2 gap-3 transition-all duration-400 ease-out ${
                          isAnimating
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3"
                        }`}
                        style={{
                          transitionDelay: isAnimating ? "400ms" : "0ms",
                        }}
                      >
                        {[
                          {
                            label: "Peso",
                            value: currentPet.weight,
                            color: "text-gray-900",
                          },
                          {
                            label: "Costo de Adopción",
                            value: currentPet.adoptionFee,
                            color: "text-green-600",
                          },
                          {
                            label: "Vacunado",
                            value: currentPet.vaccinated ? "✅ Sí" : "❌ No",
                            color: "font-bold",
                          },
                          {
                            label: "Esterilizado",
                            value: currentPet.sterilized ? "✅ Sí" : "❌ No",
                            color: "font-bold",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`bg-gray-50 p-3 rounded-xl transition-all duration-300 ease-out hover:bg-gray-100 hover:scale-105 ${
                              isAnimating
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-2 scale-95"
                            }`}
                            style={{
                              transitionDelay: isAnimating
                                ? `${450 + index * 50}ms`
                                : "0ms",
                            }}
                          >
                            <span className="text-xs text-gray-500 block">
                              {item.label}
                            </span>
                            <p className={`font-bold ${item.color}`}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                          isAnimating
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-4 scale-95"
                        }`}
                        style={{
                          transitionDelay: isAnimating ? "650ms" : "0ms",
                        }}
                      >
                        Contactar {currentPet.shelter}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Action buttons - Siempre visibles */}
        <div className="flex-shrink-0 pb-2">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-4 mb-2">
              {/* Undo button */}
              <button
                onClick={handleUndo}
                disabled={currentIndex === 0}
                className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <RotateCcw size={16} className="text-gray-600" />
              </button>

              {/* Pass button */}
              <button
                onClick={handlePass}
                className="w-14 h-14 bg-white border-3 border-red-400 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
              >
                <X size={24} className="text-red-500" />
              </button>

              {/* Like button */}
              <button
                onClick={handleLike}
                className="w-14 h-14 bg-white border-3 border-green-400 rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 hover:scale-110 transition-all duration-200"
              >
                <Heart size={24} className="text-green-500" />
              </button>

              {/* Settings button */}
              <Link
                to="/settings"
                className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:scale-110 transition-all duration-200"
              >
                <Settings size={16} className="text-gray-600" />
              </Link>
            </div>

            {/* Progress indicator compacto */}
            <div className="text-center">
              <div className="text-xs font-medium text-gray-700 mb-1">
                {currentIndex + 1} de {pets.length}
              </div>
              <div className="w-full bg-white/50 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIndex + 1) / pets.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
