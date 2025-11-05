import {
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  MessageSquare,
  Home,
  Check,
  X,
} from "lucide-react";
import GradientText from "~/components/ui/Texts/GradientText";
import { ClientOnly } from "~/components/childrenComponents/ClientOnly";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function MisAdopciones() {
  const adopciones = [
    {
      id: "1",
      pet: {
        name: "Luna",
        image:
          "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        breed: "Golden Retriever",
      },
      status: "approved",
      date: "2024-01-15",
      refugio: "Refugio Esperanza",
    },
    {
      id: "2",
      pet: {
        name: "Max",
        image:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        breed: "Labrador Mix",
      },
      status: "pending",
      date: "2024-01-20",
      refugio: "Patitas Felices",
    },
    {
      id: "3",
      pet: {
        name: "Rocky",
        image:
          "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        breed: "Pastor Alemán",
      },
      status: "rejected",
      date: "2024-01-10",
      refugio: "Amor Animal",
    },
  ];

  const getProgressSteps = (status: string) => {
    const steps = [
      { id: 1, name: "Solicitud Enviada", icon: FileText },
      { id: 2, name: "En Revisión", icon: Eye },
      { id: 3, name: "Entrevista", icon: MessageSquare },
      { id: 4, name: "Visita al Refugio", icon: Home },
      {
        id: 5,
        name: status === "rejected" ? "Rechazada" : "Aprobada",
        icon: status === "rejected" ? X : Check,
      },
    ];

    let currentStep = 1;
    if (status === "pending") currentStep = 2;
    if (status === "approved") currentStep = 5;
    if (status === "rejected") currentStep = 5;

    return { steps, currentStep };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="mx-auto max-w-6xl md:pl-72 px-4 pt-8 pb-10">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
          <Heart className="text-white" size={32} />
        </div>
        <ClientOnly
          fallback={
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent text-center">
              Mis Adopciones
            </h1>
          }
        >
          <div className="flex justify-center">
            <GradientText
              className="text-4xl font-bold mb-4"
              colors={["#ea580c", "#f97316", "#fb923c", "#fdba74"]}
              animationSpeed={6}
            >
              Mis Adopciones
            </GradientText>
          </div>
        </ClientOnly>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Seguimiento completo de tus solicitudes de adopción y el progreso de
          cada proceso
        </p>
      </div>

      <div className="space-y-8">
        {adopciones.map((adopcion) => {
          const { steps, currentStep } = getProgressSteps(adopcion.status);

          return (
            <div
              key={adopcion.id}
              className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 p-6 lg:p-8"
            >
              {/* Header con información de la mascota */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 lg:mb-8">
                <div className="relative flex-shrink-0">
                  <img
                    src={adopcion.pet.image}
                    alt={adopcion.pet.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-orange-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <Heart className="text-white" size={14} />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {adopcion.pet.name}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600">
                        {adopcion.pet.breed}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Home size={14} className="text-teal-500" />
                        <p className="text-sm text-gray-500">
                          {adopcion.refugio}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border flex items-center gap-2 ${getStatusColor(adopcion.status)}`}
                    >
                      {adopcion.status === "approved" ? (
                        <>
                          <CheckCircle size={16} />
                          Aprobada
                        </>
                      ) : adopcion.status === "pending" ? (
                        <>
                          <Clock size={16} />
                          En Proceso
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          Rechazada
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} className="text-blue-500" />
                    <span>
                      Solicitud enviada:{" "}
                      {new Date(adopcion.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barra de progreso estilo Temu */}
              <div className="mb-6 lg:mb-8">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                  Progreso de Adopción
                </h4>
                <div className="relative">
                  {/* Línea de progreso */}
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 h-1 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        adopcion.status === "approved"
                          ? "bg-gradient-to-r from-blue-500 via-purple-500 via-indigo-500 via-teal-500 to-green-500"
                          : adopcion.status === "rejected"
                            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
                            : currentStep === 1
                              ? "bg-blue-500"
                              : currentStep === 2
                                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                : currentStep === 3
                                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
                                  : "bg-gradient-to-r from-blue-500 via-purple-500 via-indigo-500 to-teal-500"
                      }`}
                      style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Pasos */}
                  <div className="flex justify-between relative">
                    {steps.map((step, index) => {
                      const isCompleted = index + 1 <= currentStep;
                      const isCurrent = index + 1 === currentStep;
                      const isRejected =
                        adopcion.status === "rejected" && step.id === 5;
                      const IconComponent = step.icon;

                      // Colores específicos para cada paso
                      const getStepColors = () => {
                        if (isRejected)
                          return "bg-red-500 border-red-300 text-white";
                        if (isCompleted) {
                          switch (step.id) {
                            case 1:
                              return "bg-blue-500 border-blue-300 text-white";
                            case 2:
                              return "bg-purple-500 border-purple-300 text-white";
                            case 3:
                              return "bg-indigo-500 border-indigo-300 text-white";
                            case 4:
                              return "bg-teal-500 border-teal-300 text-white";
                            case 5:
                              return "bg-green-500 border-green-300 text-white";
                            default:
                              return "bg-orange-500 border-orange-300 text-white";
                          }
                        }
                        if (isCurrent) {
                          switch (step.id) {
                            case 1:
                              return "bg-blue-100 border-blue-300 text-blue-600";
                            case 2:
                              return "bg-purple-100 border-purple-300 text-purple-600";
                            case 3:
                              return "bg-indigo-100 border-indigo-300 text-indigo-600";
                            case 4:
                              return "bg-teal-100 border-teal-300 text-teal-600";
                            case 5:
                              return "bg-green-100 border-green-300 text-green-600";
                            default:
                              return "bg-orange-100 border-orange-300 text-orange-600";
                          }
                        }
                        return "bg-gray-100 border-gray-300 text-gray-400";
                      };

                      return (
                        <div
                          key={step.id}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 sm:border-4 transition-all duration-300 ${getStepColors()}`}
                          >
                            <IconComponent
                              size={16}
                              className="sm:w-5 sm:h-5"
                            />
                          </div>
                          <p
                            className={`text-xs mt-1 sm:mt-2 text-center max-w-16 sm:max-w-20 font-medium leading-tight ${
                              isCompleted ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {step.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 sm:pt-6 border-t border-orange-200">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {adopcion.status === "pending" && (
                    <>
                      <Clock size={16} className="text-orange-500" />
                      Esperando respuesta del refugio
                    </>
                  )}
                  {adopcion.status === "approved" && (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      ¡Felicidades! Tu adopción fue aprobada
                    </>
                  )}
                  {adopcion.status === "rejected" && (
                    <>
                      <XCircle size={16} className="text-red-500" />
                      Lo sentimos, esta solicitud no fue aprobada
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="px-4 sm:px-6 py-2 text-sm border-2 border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-semibold">
                    Ver Detalles
                  </button>
                  {adopcion.status === "pending" && (
                    <button className="px-4 sm:px-6 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold">
                      Cancelar Solicitud
                    </button>
                  )}
                  {adopcion.status === "approved" && (
                    <button className="px-4 sm:px-6 py-2 text-sm bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold">
                      Contactar Refugio
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {adopciones.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No tienes solicitudes de adopción
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            ¡Explora nuestras mascotas disponibles y encuentra tu compañero
            perfecto!
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg">
            🐾 Explorar Mascotas
          </button>
        </div>
      )}
    </div>
  );
}
