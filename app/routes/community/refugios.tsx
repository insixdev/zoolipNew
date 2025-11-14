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

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";

  try {
    const institutions = await getAllInstitutionsService(cookieHeader);
    return { institutions };
  } catch (error) {
    console.error("Error loading institutions:", error);
    return { institutions: [] };
  }
}

export default function CommunityRefugios() {
  const { institutions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // Convertir instituciones del backend al formato de Refugio
  const refugios: Refugio[] = institutions.map((inst) => ({
    id: inst.id_institucion.toString(),
    name: inst.nombre,
    description: inst.descripcion || "Sin descripción disponible",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=300&fit=crop",
    logo: "https://i.pravatar.cc/100?img=" + (inst.id_institucion % 60),
    location: "México",
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

  const handleContact = (
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
        console.log(`Abrir chat con ${refugio.name}`);
        alert(
          `Abriendo chat con ${refugio.name}...\n\nEn una implementación real, esto abriría el sistema de mensajería interno de la app.`
        );
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
