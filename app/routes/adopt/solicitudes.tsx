import { FileText } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";
import { SolicitudCard } from "~/components/adopt/solicitudes/SolicitudCard";
import { EstadisticasSolicitudes } from "~/components/adopt/solicitudes/EstadisticasSolicitudes";
import { EmptySolicitudesState } from "~/components/adopt/solicitudes/EmptySolicitudesState";
import { ProcesoAdopcion } from "~/components/adopt/solicitudes/ProcesoAdopcion";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function AdoptSolicitudes() {
  const solicitudes = [
    {
      id: "1",
      pet: {
        name: "Luna",
        image:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        breed: "Golden Retriever",
        age: "1 año",
      },
      refugio: {
        name: "Refugio Esperanza",
        contact: "contacto@refugioesperanza.org",
        phone: "+52 33 1234 5678",
      },
      status: "approved",
      dateSubmitted: "2024-01-15",
      dateUpdated: "2024-01-18",
      nextStep: "Visita programada para el 25 de enero",
      priority: "high",
      notes:
        "Solicitud aprobada. Favor de traer identificación y comprobante de domicilio para la visita.",
    },
    {
      id: "2",
      pet: {
        name: "Max",
        image:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        breed: "Labrador Mix",
        age: "2 años",
      },
      refugio: {
        name: "Patitas Felices",
        contact: "info@patitasfelices.org",
        phone: "+52 55 9876 5432",
      },
      status: "pending",
      dateSubmitted: "2024-01-20",
      dateUpdated: "2024-01-20",
      nextStep: "Esperando revisión de documentos",
      priority: "normal",
      notes: "Documentos enviados. El refugio revisará en 2-3 días hábiles.",
    },
    {
      id: "3",
      pet: {
        name: "Rocky",
        image:
          "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        breed: "Pastor Alemán",
        age: "3 años",
      },
      refugio: {
        name: "Amor Animal",
        contact: "adopciones@amoranimal.mx",
        phone: "+52 81 5555 1234",
      },
      status: "rejected",
      dateSubmitted: "2024-01-10",
      dateUpdated: "2024-01-12",
      nextStep: "Solicitud cerrada",
      priority: "low",
      notes:
        "No cumple con los requisitos de espacio. Se sugiere considerar una mascota más pequeña.",
    },
    {
      id: "4",
      pet: {
        name: "Bella",
        image:
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        breed: "Mestizo",
        age: "6 meses",
      },
      refugio: {
        name: "Rescate Urbano",
        contact: "contacto@rescateurbano.org",
        phone: "+52 22 3333 7890",
      },
      status: "interview",
      dateSubmitted: "2024-01-22",
      dateUpdated: "2024-01-23",
      nextStep: "Entrevista telefónica programada",
      priority: "high",
      notes:
        "Entrevista telefónica el 26 de enero a las 10:00 AM. Preparar preguntas sobre experiencia con mascotas.",
    },
  ];

  return (
    <div className="ml-64 px-8 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FileText className="text-orange-500" size={32} />
            Mis Solicitudes de Adopción
          </h1>
          <p className="text-lg text-gray-600">
            Seguimiento completo del proceso de adopción para cada mascota que
            has solicitado
          </p>
        </div>

        {/* Resumen de estadísticas */}
        <EstadisticasSolicitudes solicitudes={solicitudes} />

        {/* Lista de solicitudes */}
        {solicitudes.length > 0 ? (
          <div className="space-y-6">
            {solicitudes.map((solicitud) => (
              <SolicitudCard key={solicitud.id} {...solicitud} />
            ))}
          </div>
        ) : (
          <EmptySolicitudesState />
        )}

        {/* Información adicional */}
        {solicitudes.length > 0 && <ProcesoAdopcion />}
      </div>
    </div>
  );
}
