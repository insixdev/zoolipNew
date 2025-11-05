import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-500" size={20} />;
      case "pending":
        return <Clock className="text-yellow-500" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      case "interview":
        return <AlertCircle className="text-blue-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobada";
      case "pending":
        return "En revisión";
      case "rejected":
        return "Rechazada";
      case "interview":
        return "Entrevista";
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "normal":
        return "border-l-yellow-500";
      case "low":
        return "border-l-gray-500";
      default:
        return "border-l-gray-300";
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {solicitudes.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {solicitudes.filter((s) => s.status === "approved").length}
            </div>
            <div className="text-sm text-gray-600">Aprobadas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {
                solicitudes.filter(
                  (s) => s.status === "pending" || s.status === "interview"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">En proceso</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {solicitudes.filter((s) => s.status === "rejected").length}
            </div>
            <div className="text-sm text-gray-600">Rechazadas</div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        {solicitudes.length > 0 ? (
          <div className="space-y-6">
            {solicitudes.map((solicitud) => (
              <div
                key={solicitud.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(solicitud.priority)} border-r border-t border-b border-gray-200 overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={solicitud.pet.image}
                        alt={solicitud.pet.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {solicitud.pet.name}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          {solicitud.pet.breed} • {solicitud.pet.age}
                        </p>
                        <p className="text-sm text-gray-500">
                          Refugio: {solicitud.refugio.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(solicitud.status)}`}
                      >
                        {getStatusIcon(solicitud.status)}
                        <span className="text-sm font-medium">
                          {getStatusText(solicitud.status)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Información de la Solicitud
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} />
                          <span>
                            Enviada:{" "}
                            {new Date(
                              solicitud.dateSubmitted
                            ).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={14} />
                          <span>
                            Actualizada:{" "}
                            {new Date(solicitud.dateUpdated).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <AlertCircle size={14} className="mt-0.5" />
                          <span>Siguiente paso: {solicitud.nextStep}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Contacto del Refugio
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} />
                          <a
                            href={`mailto:${solicitud.refugio.contact}`}
                            className="hover:text-orange-600 transition-colors"
                          >
                            {solicitud.refugio.contact}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} />
                          <a
                            href={`tel:${solicitud.refugio.phone}`}
                            className="hover:text-orange-600 transition-colors"
                          >
                            {solicitud.refugio.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {solicitud.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Notas
                      </h4>
                      <p className="text-sm text-gray-700">{solicitud.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <Link
                        to={`/adopt/${solicitud.pet.name.toLowerCase()}`}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Ver mascota
                      </Link>
                      <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Contactar refugio
                      </button>
                    </div>

                    {solicitud.status === "pending" && (
                      <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        Cancelar solicitud
                      </button>
                    )}

                    {solicitud.status === "approved" && (
                      <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Confirmar adopción
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Estado vacío
          <div className="text-center py-16">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes solicitudes de adopción
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando envíes una solicitud de adopción, aparecerá aquí para que
              puedas hacer seguimiento.
            </p>
            <Link
              to="/adopt"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Explorar mascotas
            </Link>
          </div>
        )}

        {/* Información adicional */}
        {solicitudes.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Proceso de Adopción
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <p className="font-medium">Solicitud</p>
                <p className="text-gray-600">Envías tu solicitud</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <p className="font-medium">Revisión</p>
                <p className="text-gray-600">El refugio revisa</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <p className="font-medium">Entrevista</p>
                <p className="text-gray-600">Entrevista y visita</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  4
                </div>
                <p className="font-medium">Adopción</p>
                <p className="text-gray-600">¡Tu nueva mascota!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
