import { useState } from "react";
import { Heart } from "lucide-react";
import { PageHeader } from "~/components/ui/layout";
import { RefugioCard, type Refugio } from "~/components/ui/community";
import { FiltrosRefugios } from "~/components/community/refugios/FiltrosRefugios";
import { EstadisticasRefugios } from "~/components/community/refugios/EstadisticasRefugios";
import { EmptyRefugiosState } from "~/components/community/refugios/EmptyRefugiosState";
import { RegistrarRefugioCTA } from "~/components/community/refugios/RegistrarRefugioCTA";
import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import { getAllInstitutionsService } from "~/features/entities/institucion/institutionService";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";

  // Si no hay cookie, retornar sin instituciones (modo público)
  if (!cookieHeader) {
    return { institutions: [], isPublic: true };
  }

  try {
    const institutions = await getAllInstitutionsService(cookieHeader);
    return { institutions, isPublic: false };
  } catch (error) {
    console.error("Error loading institutions:", error);
    return { institutions: [], isPublic: false };
  }
}

export default function CommunityRefugios() {
  const { institutions, isPublic } = useLoaderData<typeof loader>();
  const { user } = useSmartAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // Vista simplificada para usuarios no autenticados
  if (!user || isPublic) {
    return (
      <div className="mx-auto max-w-7xl md:pl-64 px-4 pt-8 pb-10">
        <PageHeader
          title="Refugios y Organizaciones"
          description="Conoce los refugios y organizaciones que trabajan incansablemente por el bienestar animal"
          icon={Heart}
          compact={true}
          gradient={true}
        />

        {/* Mensaje para usuarios no autenticados */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 border-2 border-rose-200 rounded-2xl p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Descubre Refugios y Organizaciones
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Inicia sesión para explorar refugios, veterinarias y
              organizaciones que trabajan por el bienestar animal. Conecta con
              ellos y descubre cómo puedes ayudar.
            </p>
            <div className="flex gap-4 justify-center mb-8">
              <a
                href="/login?redirectTo=/community/refugios"
                className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Iniciar sesión
              </a>
              <a
                href="/register"
                className="px-8 py-4 border-2 border-rose-500 text-rose-600 rounded-xl hover:bg-rose-50 transition-all font-semibold text-lg"
              >
                Registrarse
              </a>
            </div>
          </div>

          {/* Call to action para registrar refugio */}
          <div className="mt-12">
            <RegistrarRefugioCTA />
          </div>
        </div>
      </div>
    );
  }

  // Convertir instituciones del backend al formato de Refugio
  const refugios: Refugio[] = institutions.map((inst) => ({
    id: inst.id_institucion.toString(),
    name: inst.nombre,
    description: inst.descripcion || "Sin descripción disponible",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=300&fit=crop",
    logo: inst.imagen_url || inst.imagenUrl || "",
    location: "Ubicación no disponible", // Agregar ubicación por defecto
    address: "Dirección no disponible",
    phone: "Teléfono no disponible",
    email: inst.email,
    website: undefined,
    established: "N/A",
    animalsRescued: 0,
    adoptionsCompleted: 0,
    currentAnimals: 0,
    specialties: [inst.tipo],
    workingHours: `${inst.horario_Inicio} - ${inst.horario_Fin}`,
    availablePets: [],
    verified: true,
  }));

  // Filtrar refugios
  const filteredRefugios = refugios.filter((refugio) => {
    const matchesSearch =
      refugio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refugio.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refugio.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      selectedLocation === "all" || refugio.location === selectedLocation;

    const matchesSpecialty =
      selectedSpecialty === "all" ||
      refugio.specialties.some((specialty) =>
        specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  const handleContact = async (
    refugioId: string,
    method: "phone" | "message" | "website"
  ) => {
    const refugio = refugios.find((r) => r.id === refugioId);
    if (!refugio) return;

    switch (method) {
      case "phone":
        window.open(`tel:${refugio.phone}`);
        break;
      case "message":
        try {
          // Obtener el nombre del administrador de la institución
          const currentUserName = user?.username || "Usuario";
          const institutionId = refugio.id;

          console.log(
            "[REFUGIOS] Obteniendo administrador para institución:",
            institutionId
          );

          // Obtener el administrador de la institución
          const response = await fetch(
            `/api/user/by-institution/${institutionId}`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("No se pudo obtener el administrador");
          }

          const adminUser = await response.json();
          console.log("[REFUGIOS] Administrador obtenido:", adminUser);

          const adminName = adminUser?.nombre || "Admin";
          const nombreChat = `${currentUserName}_${adminName}`;

          console.log("[REFUGIOS] Abriendo chat:", {
            currentUserName,
            adminName,
            nombreChat,
          });

          // Redirigir al chat con el nombre correcto
          navigate(
            `/adopt/chatAdopt?Nombre_Chat=${encodeURIComponent(nombreChat)}&Nombre=${encodeURIComponent(currentUserName)}`
          );
        } catch (error) {
          console.error("[REFUGIOS] Error al abrir chat:", error);
          alert("Error al abrir el chat. Por favor, intenta de nuevo.");
        }
        break;
      case "website":
        if (refugio.website) {
          window.open(refugio.website, "_blank");
        }
        break;
    }
  };

  const handleViewPets = (refugioId: string) => {
    // Navegar a la página de detalle del refugio
    navigate(`/community/refugio/${refugioId}`);
  };

  return (
    <div className="mx-auto max-w-7xl md:pl-64 px-4 pt-8 pb-10">
      <PageHeader
        title="Refugios y Organizaciones"
        description="Conoce los refugios y organizaciones que trabajan incansablemente por el bienestar animal"
        icon={Heart}
        compact={true}
        gradient={true}
      />

      {/* Filtros */}
      <FiltrosRefugios
        searchTerm={searchTerm}
        selectedLocation={selectedLocation}
        selectedSpecialty={selectedSpecialty}
        onSearchChange={setSearchTerm}
        onLocationChange={setSelectedLocation}
        onSpecialtyChange={setSelectedSpecialty}
      />

      {/* Estadísticas generales */}
      <EstadisticasRefugios refugios={refugios} />

      {/* Lista de refugios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRefugios.map((refugio) => (
          <RefugioCard
            key={refugio.id}
            refugio={refugio}
            onContact={handleContact}
            onViewPets={handleViewPets}
          />
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredRefugios.length === 0 && <EmptyRefugiosState />}

      {/* Call to action */}
      <RegistrarRefugioCTA />
    </div>
  );
}
