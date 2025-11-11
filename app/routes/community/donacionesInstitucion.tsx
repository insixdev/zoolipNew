import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  FiltersSection,
  InstitutionCard,
  HowItWorksSection,
  NoResults,
} from "~/components/community/donaciones";

type Institucion = {
  id: number;
  nombre: string;
  tipo: "refugio" | "veterinaria";
  ubicacion: string;
  telefono: string;
  email: string;
  descripcion: string;
  animalesRescatados: number;
  especialidad: string;
  color: string;
};

// Mock data
const instituciones: Institucion[] = [
  {
    id: 1,
    nombre: "Refugio Patitas Felices",
    tipo: "refugio",
    ubicacion: "Buenos Aires, CABA",
    telefono: "+54 9 11 1234 5678",
    email: "contacto@patitasfelices.org",
    descripcion:
      "Centro integral de rescate y rehabilitación de perros y gatos abandonados. Ofrecemos atención veterinaria, socialización y búsqueda de familias adoptivas.",
    animalesRescatados: 847,
    especialidad: "Rescate y Adopción",
    color: "from-rose-500 to-pink-500",
  },
  {
    id: 2,
    nombre: "Veterinaria Amigos Peludos",
    tipo: "veterinaria",
    ubicacion: "CABA, Argentina",
    telefono: "+54 9 11 5678 1234",
    email: "info@amigospeludos.vet",
    descripcion:
      "Clínica veterinaria especializada en cirugías, esterilizaciones y atención de animales rescatados. Disponibilidad 24/7 para emergencias.",
    animalesRescatados: 2345,
    especialidad: "Cirugías y Emergencias",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    nombre: "Refugio Esperanza Animal",
    tipo: "refugio",
    ubicacion: "La Plata, Buenos Aires",
    telefono: "+54 9 221 234 5678",
    email: "esperanza@refugioesperanza.org",
    descripcion:
      "Centro de rescate especializado en animales con necesidades especiales. Brindamos rehabilitación física y psicológica con amor.",
    animalesRescatados: 1203,
    especialidad: "Necesidades Especiales",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    nombre: "Clínica Veterinaria San Felipe",
    tipo: "veterinaria",
    ubicacion: "San Isidro, Buenos Aires",
    telefono: "+54 9 11 9876 5432",
    email: "contacto@vetsfeline.org",
    descripcion:
      "Expertos en medicina felina e intervenciones quirúrgicas. Tratamientos especializados y seguimiento veterinario completo.",
    animalesRescatados: 567,
    especialidad: "Medicina Felina",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 5,
    nombre: "Fundación Patas Argentina",
    tipo: "refugio",
    ubicacion: "Mar del Plata, Buenos Aires",
    telefono: "+54 9 223 567 8901",
    email: "info@patasyamor.org",
    descripcion:
      "Red de voluntarios dedicada al rescate callejero y protección integral de animales abandonados. Trabajamos en la prevención del maltrato.",
    animalesRescatados: 1890,
    especialidad: "Rescate Callejero",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 6,
    nombre: "Centro Veterinario Integral",
    tipo: "veterinaria",
    ubicacion: "La Matanza, Buenos Aires",
    telefono: "+54 9 11 2345 6789",
    email: "centro@vetintegral.com",
    descripcion:
      "Atención veterinaria completa con énfasis en animales de refugios. Servicios de esterilización, vacunación y tratamiento de enfermedades.",
    animalesRescatados: 3456,
    especialidad: "Atención Integral",
    color: "from-indigo-500 to-blue-500",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    title: "Selecciona",
    description: "Elige la institución que quieres apoyar",
  },
  {
    number: "02",
    title: "Ingresa",
    description: "Tu información de pago (tarjeta, PayPal, etc.)",
  },
  {
    number: "03",
    title: "Recibe",
    description: "Comprobante de donación automáticamente",
  },
  {
    number: "04",
    title: "Impacto",
    description: "Tu donación llega 100% a la institución",
  },
];

export default function DonacionesInstitucionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<
    "todos" | "refugio" | "veterinaria"
  >("todos");

  // Obtener monto de query params
  const monto = searchParams.get("monto") || "150";

  const filteredInstituciones = useMemo(() => {
    return instituciones.filter((inst) => {
      const matchesSearch =
        inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo =
        selectedTipo === "todos" || inst.tipo === selectedTipo;
      return matchesSearch && matchesTipo;
    });
  }, [searchTerm, selectedTipo]);

  const handleSelectInstitution = (institucion: Institucion) => {
    // Redirige al checkout con la institución y el monto
    navigate(
      `/community/donaciones/checkout?institucion=${institucion.id}&monto=${monto}`
    );
  };

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fadeInDown">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Elige la Institución a Apoyar
              </h1>
              <p className="text-xl text-gray-600">
                Selecciona el refugio o veterinaria que quieres ayudar con tu
                donación
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <FiltersSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedTipo={selectedTipo}
          onTipoChange={setSelectedTipo}
          resultsCount={filteredInstituciones.length}
        />

        {/* Instituciones Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {filteredInstituciones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInstituciones.map((institucion, idx) => (
                <InstitutionCard
                  key={institucion.id}
                  institucion={institucion}
                  onSelect={handleSelectInstitution}
                  delay={idx * 80}
                />
              ))}
            </div>
          ) : (
            <NoResults />
          )}
        </section>

        {/* How It Works */}
        <HowItWorksSection steps={howItWorksSteps} />

        {/* Back Button */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-2 transition-colors duration-300 animate-fadeInUp"
          >
            ← Volver a montos
          </button>
        </section>

        <style>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fadeInDown {
            animation: fadeInDown 0.6s ease-out;
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
          }

          .animate-slideInLeft {
            animation: slideInLeft 0.6s ease-out;
          }

          .scale-102 {
            transform: scale(1.02);
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
}
