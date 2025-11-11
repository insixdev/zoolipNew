import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaPhone,
  FaEnvelope,
  FaBuilding,
} from "react-icons/fa";

type Status = "pending" | "accepted" | "rejected";
import { useInstitutionRequest } from "~/context/InstitutionRequestContext";

/**
 * SolicitudeInstitutionInfo
 * Vista para usuarios normales que han registrado su refugio/institución
 * Muestra el estado de su solicitud: Pendiente / Aceptada / Rechazada
 * Sin opciones de editar — es solo lectura para ver el estado
 */
export default function SolicitudeInstitutionInfo() {
  const { submitted } = useInstitutionRequest();
  const [searchParams] = useSearchParams();
  // Obtener estado desde URL (para testing rápido)
  const initialStatus = (searchParams.get("status") || "pending") as Status;
  const [status] = useState<Status>(initialStatus);

  // Info de la solicitud (en producción: cargar desde loader/fetcher por ID)
  const info = useMemo(
    () => ({
      nombreInstitucion: "Refugio Patitas Felices",
      contacto: "María López",
      telefono: "+54 9 11 1234 5678",
      email: "contacto@patitasfelices.org",
      submittedAt: "2025-11-08",
    }),
    []
  );

  // Metadata para cada estado
  const statusMeta: Record<
    Status,
    {
      label: string;
      color: string;
      bgColor: string;
      icon: React.ReactNode;
      desc: string;
    }
  > = {
    pending: {
      label: "Pendiente",
      color: "text-yellow-800",
      bgColor: "bg-yellow-50 border-yellow-200",
      icon: <FaHourglassHalf className="text-3xl text-yellow-600" />,
      desc: "Tu solicitud está en revisión. El equipo de Zoolip la evaluará pronto.",
    },
    accepted: {
      label: "Aceptada",
      color: "text-green-800",
      bgColor: "bg-green-50 border-green-200",
      icon: <FaCheck className="text-3xl text-green-600" />,
      desc: "¡Felicidades! Tu institución fue aceptada. Ya tienes acceso a la plataforma.",
    },
    rejected: {
      label: "Rechazada",
      color: "text-red-800",
      bgColor: "bg-red-50 border-red-200",
      icon: <FaTimes className="text-3xl text-red-600" />,
      desc: "Tu solicitud fue revisada pero no cumple con los requisitos. Puedes contactarnos para más información.",
    },
  };
  const meta = statusMeta[status];

  // If the user hasn't submitted the institution request yet, show a call-to-action
  // linking to the registration form. The shared InstitutionRequest context controls
  // this dynamically (default false).
  if (!submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mt-12 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-8 text-center border border-orange-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Aún no has solicitado un refugio
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Si quieres registrar tu institución, completa el formulario de
              solicitud.
            </p>
            <Link
              to="/community/solcitudeInstitutionForm"
              className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all font-semibold shadow"
            >
              Ir a registrar mi refugio
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Estado de tu Solicitud
          </h1>
          <p className="mt-2 text-gray-600">
            Aquí puedes ver el estado de tu solicitud para unirse a nuestra red
          </p>
        </div>

        {/* Status Card */}
        <div
          className={`rounded-lg border-2 p-8 mb-6 flex flex-col items-center text-center ${meta.bgColor}`}
        >
          <div className="mb-4">{meta.icon}</div>
          <h2 className={`text-2xl font-bold mb-2 ${meta.color}`}>
            {meta.label}
          </h2>
          <p className={`text-sm ${meta.color}`}>{meta.desc}</p>
        </div>

        {/* Institution Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de la Solicitud
          </h3>

          <div className="space-y-4">
            {/* Institution Name */}
            <div className="flex items-start gap-3">
              <FaBuilding className="text-rose-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Institución</p>
                <p className="font-medium text-gray-900">
                  {info.nombreInstitucion}
                </p>
              </div>
            </div>

            {/* Contact Person */}
            <div className="flex items-start gap-3">
              <span className="text-rose-600 mt-1">👤</span>
              <div>
                <p className="text-sm text-gray-500">Contacto</p>
                <p className="font-medium text-gray-900">{info.contacto}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-rose-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium text-gray-900">{info.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <FaPhone className="text-rose-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-900">{info.telefono}</p>
              </div>
            </div>

            {/* Submitted Date */}
            <div className="flex items-start gap-3">
              <span className="text-rose-600 mt-1">📅</span>
              <div>
                <p className="text-sm text-gray-500">Fecha de Solicitud</p>
                <p className="font-medium text-gray-900">{info.submittedAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status-specific messages */}
        {status === "pending" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Información:</strong> Nos comunicaremos contigo pronto
              con actualizaciones sobre tu solicitud. Por favor verifica tu
              correo electrónico regularmente.
            </p>
          </div>
        )}

        {status === "accepted" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>✓ Acceso Concedido:</strong> Ya puedes acceder a todas las
              funciones de institución en la plataforma. ¡Bienvenido!
            </p>
          </div>
        )}

        {status === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>⚠️ Próximos Pasos:</strong> Si crees que esto es un error
              o tienes preguntas, no dudes en{" "}
              <a
                href="mailto:contacto@zoolip.app"
                className="font-semibold underline"
              >
                contactarnos
              </a>
              .
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/community"
            className="inline-block px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            Volver a Comunidad
          </Link>
        </div>
      </div>
    </div>
  );
}
