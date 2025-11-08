import { useState } from "react";
import { Heart } from "lucide-react";
import { PageHeader } from "~/components/ui/layout";
import { RefugioCard, type Refugio } from "~/components/ui/community";
import { FiltrosRefugios } from "~/components/community/refugios/FiltrosRefugios";
import { EstadisticasRefugios } from "~/components/community/refugios/EstadisticasRefugios";
import { EmptyRefugiosState } from "~/components/community/refugios/EmptyRefugiosState";
import { RegistrarRefugioCTA } from "~/components/community/refugios/RegistrarRefugioCTA";

export default function CommunityRefugios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // Datos de ejemplo de refugios
  const refugios: Refugio[] = [
    {
      id: "1",
      name: "Refugio Esperanza Animal",
      description:
        "Dedicados al rescate y rehabilitación de perros y gatos abandonados. Más de 15 años ayudando a encontrar hogares amorosos para nuestros amigos de cuatro patas.",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=300&fit=crop",
      logo: "https://i.pravatar.cc/100?img=50",
      location: "Ciudad de México",
      address: "Av. Insurgentes Sur 1234, Col. Del Valle",
      phone: "+52 55 1234-5678",
      email: "contacto@esperanzaanimal.org",
      website: "https://esperanzaanimal.org",
      established: "2008",
      animalsRescued: 2847,
      adoptionsCompleted: 2156,
      currentAnimals: 89,
      specialties: ["Perros", "Gatos", "Rehabilitación", "Cirugías"],
      workingHours: "Lun-Dom 9:00-18:00",
      availablePets: [
        {
          id: "p1",
          name: "Max",
          type: "dog",
          age: "2 años",
          image:
            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
        },
        {
          id: "p2",
          name: "Luna",
          type: "cat",
          age: "1 año",
          image:
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
        },
        {
          id: "p3",
          name: "Rocky",
          type: "dog",
          age: "3 años",
          image:
            "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=100&h=100&fit=crop",
        },
        {
          id: "p4",
          name: "Mimi",
          type: "cat",
          age: "6 meses",
          image:
            "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop",
        },
        {
          id: "p5",
          name: "Buddy",
          type: "dog",
          age: "4 años",
          image:
            "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
        },
      ],
      verified: true,
    },
    {
      id: "2",
      name: "Patitas Felices A.C.",
      description:
        "Organización sin fines de lucro enfocada en el rescate de cachorros y gatitos huérfanos. Contamos con veterinarios especializados y programas de adopción responsable.",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=300&fit=crop",
      logo: "https://i.pravatar.cc/100?img=51",
      location: "Guadalajara",
      address: "Calle Libertad 567, Col. Americana",
      phone: "+52 33 9876-5432",
      email: "info@patitasfelices.mx",
      website: "https://patitasfelices.mx",
      established: "2012",
      animalsRescued: 1523,
      adoptionsCompleted: 1287,
      currentAnimals: 45,
      specialties: [
        "Cachorros",
        "Gatitos",
        "Cuidados intensivos",
        "Socialización",
      ],
      workingHours: "Mar-Dom 10:00-17:00",
      availablePets: [
        {
          id: "p6",
          name: "Bella",
          type: "dog",
          age: "8 meses",
          image:
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop",
        },
        {
          id: "p7",
          name: "Whiskers",
          type: "cat",
          age: "3 meses",
          image:
            "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=100&h=100&fit=crop",
        },
        {
          id: "p8",
          name: "Charlie",
          type: "dog",
          age: "1 año",
          image:
            "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop",
        },
      ],
      verified: true,
    },
    {
      id: "3",
      name: "Amor Animal Monterrey",
      description:
        "Refugio especializado en perros de razas grandes y animales con necesidades especiales. Brindamos atención médica integral y terapias de rehabilitación.",
      image:
        "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&h=300&fit=crop",
      logo: "https://i.pravatar.cc/100?img=52",
      location: "Monterrey",
      address: "Carretera Nacional Km 15, San Pedro",
      phone: "+52 81 5555-1234",
      email: "rescate@amoranimal.org",
      established: "2015",
      animalsRescued: 892,
      adoptionsCompleted: 654,
      currentAnimals: 67,
      specialties: [
        "Razas grandes",
        "Necesidades especiales",
        "Rehabilitación",
        "Terapias",
      ],
      workingHours: "Lun-Sáb 8:00-16:00",
      availablePets: [
        {
          id: "p9",
          name: "Thor",
          type: "dog",
          age: "5 años",
          image:
            "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=100&h=100&fit=crop",
        },
        {
          id: "p10",
          name: "Simba",
          type: "cat",
          age: "2 años",
          image:
            "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=100&h=100&fit=crop",
        },
        {
          id: "p11",
          name: "Duke",
          type: "dog",
          age: "6 años",
          image:
            "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=100&h=100&fit=crop",
        },
        {
          id: "p12",
          name: "Princess",
          type: "cat",
          age: "4 años",
          image:
            "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=100&h=100&fit=crop",
        },
      ],
      verified: false,
    },
    {
      id: "4",
      name: "Refugio San Francisco",
      description:
        "Hogar temporal para animales rescatados de la calle. Nos enfocamos en la esterilización, vacunación y búsqueda de familias responsables para cada uno de nuestros rescatados.",
      image:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=300&fit=crop",
      logo: "https://i.pravatar.cc/100?img=53",
      location: "Puebla",
      address: "Blvd. 5 de Mayo 890, Col. Centro",
      phone: "+52 222 333-4567",
      email: "adopciones@sanfrancisco.org.mx",
      website: "https://refugiosanfrancisco.org",
      established: "2010",
      animalsRescued: 1756,
      adoptionsCompleted: 1432,
      currentAnimals: 78,
      specialties: [
        "Esterilización",
        "Vacunación",
        "Animales callejeros",
        "Educación",
      ],
      workingHours: "Lun-Vie 9:00-17:00, Sáb 9:00-14:00",
      availablePets: [
        {
          id: "p13",
          name: "Canela",
          type: "dog",
          age: "3 años",
          image:
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100&h=100&fit=crop",
        },
        {
          id: "p14",
          name: "Mittens",
          type: "cat",
          age: "1 año",
          image:
            "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop",
        },
        {
          id: "p15",
          name: "Toby",
          type: "dog",
          age: "2 años",
          image:
            "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=100&h=100&fit=crop",
        },
        {
          id: "p16",
          name: "Shadow",
          type: "cat",
          age: "5 años",
          image:
            "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=100&h=100&fit=crop",
        },
        {
          id: "p17",
          name: "Coco",
          type: "dog",
          age: "1 año",
          image:
            "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=100&h=100&fit=crop",
        },
        {
          id: "p18",
          name: "Fluffy",
          type: "cat",
          age: "3 años",
          image:
            "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=100&h=100&fit=crop",
        },
      ],
      verified: true,
    },
    {
      id: "5",
      name: "Hogar Canino Tijuana",
      description:
        "Refugio fronterizo dedicado al rescate de perros abandonados. Trabajamos en coordinación con refugios de Estados Unidos para facilitar adopciones internacionales.",
      image:
        "https://images.unsplash.com/photo-1601758174493-bea9f8b00db6?w=600&h=300&fit=crop",
      logo: "https://i.pravatar.cc/100?img=54",
      location: "Tijuana",
      address: "Zona Río, Paseo de los Héroes 2345",
      phone: "+52 664 789-0123",
      email: "contacto@hogarcanino.mx",
      established: "2018",
      animalsRescued: 567,
      adoptionsCompleted: 445,
      currentAnimals: 34,
      specialties: [
        "Perros",
        "Adopciones internacionales",
        "Transporte",
        "Documentación",
      ],
      workingHours: "Lun-Vie 10:00-18:00",
      availablePets: [
        {
          id: "p19",
          name: "Pancho",
          type: "dog",
          age: "4 años",
          image:
            "https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=100&h=100&fit=crop",
        },
        {
          id: "p20",
          name: "Frida",
          type: "dog",
          age: "2 años",
          image:
            "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=100&h=100&fit=crop",
        },
        {
          id: "p21",
          name: "Diego",
          type: "dog",
          age: "6 años",
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
        },
      ],
      verified: true,
    },
  ];

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
        // Navegar al chat interno con el refugio
        // En una implementación real, esto abriría el sistema de chat de la app
        console.log(`Abrir chat con ${refugio.name}`);
        // Ejemplo: navigate(`/chat/refugio/${refugioId}`);
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
    // Aquí podrías navegar a una página de detalle del refugio
    console.log(`Ver mascotas del refugio ${refugioId}`);
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
