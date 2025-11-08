import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

interface Pet {
  name: string;
  image: string;
  breed: string;
  age: string;
}

interface Refugio {
  name: string;
  contact: string;
  phone: string;
}

interface SolicitudCardProps {
  id: string;
  pet: Pet;
  refugio: Refugio;
  status: string;
  dateSubmitted: string;
  dateUpdated: string;
  nextStep: string;
  priority: string;
  notes?: string;
}

export function SolicitudCard({
  id,
  pet,
  refugio,
  status,
  dateSubmitted,
  dateUpdated,
  nextStep,
  priority,
  notes,
}: SolicitudCardProps) {
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
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(priority)} border-r border-t border-b border-gray-200 overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {pet.name}
              </h3>
              <p className="text-gray-600 mb-1">
                {pet.breed} • {pet.age}
              </p>
              <p className="text-sm text-gray-500">Refugio: {refugio.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(status)}`}
            >
              {getStatusIcon(status)}
              <span className="text-sm font-medium">
                {getStatusText(status)}
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
                  Enviada: {new Date(dateSubmitted).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={14} />
                <span>
                  Actualizada:{" "}
                  {new Date(dateUpdated).toLocaleDateString("es-ES")}
                </span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <AlertCircle size={14} className="mt-0.5" />
                <span>Siguiente paso: {nextStep}</span>
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
                  href={`mailto:${refugio.contact}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {refugio.contact}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} />
                <a
                  href={`tel:${refugio.phone}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {refugio.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {notes && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Notas</h4>
            <p className="text-sm text-gray-700">{notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex gap-3">
            <Link
              to={`/adopt/${pet.name.toLowerCase()}`}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver mascota
            </Link>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Contactar refugio
            </button>
          </div>

          {status === "pending" && (
            <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Cancelar solicitud
            </button>
          )}

          {status === "approved" && (
            <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Confirmar adopción
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
