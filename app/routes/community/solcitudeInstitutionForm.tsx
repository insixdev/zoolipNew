import React, { useEffect, useState } from "react";
import { useFetcher, type ActionFunction, useNavigate } from "react-router";
import { useInstitutionRequest } from "~/context/InstitutionRequestContext";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaRegCommentDots,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { createInstitutionSolicitudService } from "~/features/entities/institucion/institutionSolicitudService";
import { solicitudeSuccesInstitutionEmail } from "~/features/solicitudes/solicitudesEmail";

type FormState = {
  nombre_institucion: string;
  email_contacto: string;
  telefono_contacto: string;
  razon_solicitud: string;
  tipo: "refugio" | "veterinaria" | "";
};

type ActionData = {
  success?: boolean;
  message?: string;
  error?: string;
  id_solicitud?: number;
};

/**
 * Server action para crear solicitud de institución
 */
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({
      error: "Método no permitido",
      success: false,
    });
  }

  try {
    const formData = await request.formData();

    const solicitud = {
      nombre_institucion: formData.get("nombre_institucion") as string,
      tipo: (formData.get("tipo") as string).toUpperCase(),
      email_contacto: formData.get("email_contacto") as string,
      telefono_contacto: formData.get("telefono_contacto") as string,
      razon_solicitud: formData.get("razon_solicitud") as string,
    };

    // Validar que todos los campos estén presentes
    if (
      !solicitud.nombre_institucion ||
      !solicitud.tipo ||
      !solicitud.email_contacto ||
      !solicitud.telefono_contacto ||
      !solicitud.razon_solicitud
    ) {
      return Response.json({
        error: "Todos los campos son obligatorios",
        success: false,
      });
    }

    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(solicitud.email_contacto)) {
      return Response.json({
        error: "El email ingresado no es válido",
        success: false,
      });
    }

    // Validar tipo
    if (!["REFUGIO", "VETERINARIA"].includes(solicitud.tipo)) {
      return Response.json({
        error: "El tipo de institución debe ser REFUGIO o VETERINARIA",
        success: false,
      });
    }

    console.log("Enviando solicitud al backend:", solicitud);

    // Llamar al servicio para crear la solicitud
    const response = await createInstitutionSolicitudService(solicitud);

    console.log("Respuesta del backend:", response);

    // Normalizar respuesta del backend: status === "success" es éxito
    const isSuccess = response.status === "success";
    const httpCode = response.httpCode || 200;

    if (httpCode !== 200 && httpCode !== 201) {
      return Response.json({
        error: response.message || "Error al crear la solicitud en el servidor",
        success: false,
      });
    }

    if (!isSuccess) {
      return Response.json({
        error: response.message || "Error al crear la solicitud en el servidor",
        success: false,
      });
    }
    //
    // // Enviar email de confirmación
    // const emailRes = await solicitudeSuccesInstitutionEmail(
    //   solicitud.email_contacto,
    //   solicitud.nombre_institucion
    // );

    //console.log("Respuesta de email:", emailRes);
    //
    // const emailStatus =
    //   emailRes.status === "ok"
    //     ? ` Se envió un correo de confirmación a ${solicitud.email_contacto}`
    //     : ` No se pudo enviar el correo de confirmación a ${solicitud.email_contacto}, pero tu solicitud fue registrada`;

    const emailStatus = "mode dev";
    // La solicitud fue exitosa, incluso si el email falla
    return Response.json({
      success: true,
      message: `Solicitud creada exitosamente. ${emailStatus}`,
      id_solicitud: response.id_solicitud,
    });
  } catch (err: any) {
    console.error("Error en action de solicitud:", err);

    // Extraer mensaje de error más descriptivo
    let errorMessage = "Error al procesar la solicitud";

    if (err.message) {
      errorMessage = err.message;
    }

    if (err.cause) {
      errorMessage += ` - ${err.cause}`;
    }

    return Response.json(
      {
        error: errorMessage,
        success: false,
      },
      {
        status: 400,
      }
    );
  }
};

// Modal de Éxito
const SuccessModal: React.FC<{ email: string; onClose: () => void }> = ({
  email,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      onClose();
    }
  }, [countdown, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
            <FaCheckCircle className="w-20 h-20 text-green-500 relative" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Solicitud Enviada!
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          Tu solicitud ha sido recibida exitosamente.
        </p>

        {/* Email Check */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium mb-1">
            Próximos pasos:
          </p>
          <p className="text-sm text-blue-800">
            Revisa tu correo en <strong>{email}</strong> para recibir
            actualizaciones. Nuestro equipo se pondrá en contacto contigo
            pronto.
          </p>
        </div>

        {/* Auto redirect message */}
        <p className="text-xs text-gray-500 mb-4">
          Redirigiendo en <strong>{countdown}</strong> segundo
          {countdown !== 1 ? "s" : ""}...
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-green-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
        >
          Ir a Comunidad Ahora
        </button>
      </div>
    </div>
  );
};

// Modal de Error
const ErrorModal: React.FC<{ error: string; onClose: () => void }> = ({
  error,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
            <FaTimesCircle className="w-20 h-20 text-red-500 relative" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Error al Enviar
        </h2>

        {/* Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left max-h-32 overflow-y-auto">
          <p className="text-sm text-red-800 whitespace-pre-wrap break-words font-mono">
            {error}
          </p>
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-500 mb-4">
          Por favor, intenta nuevamente o contacta a soporte si el problema
          persiste.
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default function SolicitudeInstitutionForm() {
  const navigate = useNavigate();
  const fetcher = useFetcher<ActionData>();
  const { setSubmitted } = useInstitutionRequest();

  const [form, setForm] = useState<FormState>({
    nombre_institucion: "",
    email_contacto: "",
    telefono_contacto: "",
    razon_solicitud: "",
    tipo: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fetchError, setFetchError] = useState<string>();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [modalEmail, setModalEmail] = useState("");

  // Detectar éxito desde la action - usar fetcher.data en lugar de useActionData
  useEffect(() => {
    console.log("fetcher.state:", fetcher.state);
    console.log("fetcher.data:", fetcher.data);

    // Limpiar errores cuando se comienza a hacer submit
    if (fetcher.state === "submitting") {
      setShowModal(false);
      return;
    }

    // Solo procesar cuando se completa la acción
    if (fetcher.state !== "idle") {
      return;
    }

    // Si tenemos datos de respuesta
    if (fetcher.data) {
      if (fetcher.data.success === true) {
        setModalType("success");
        setModalMessage(
          fetcher.data.message || "Solicitud enviada exitosamente"
        );
        setModalEmail(form.email_contacto);
        setShowModal(true);
      } else if (fetcher.data.success === false) {
        setModalType("error");
        setModalMessage(
          fetcher.data.error ||
            fetcher.data.message ||
            "Error al procesar la solicitud"
        );
        setShowModal(true);
      }
    }
  }, [fetcher.data, fetcher.state, form.email_contacto]);

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/community");
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombre_institucion.trim())
      e.nombre_institucion = "Nombre de la institución obligatorio";
    if (!form.email_contacto.trim())
      e.email_contacto = "Email de contacto obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_contacto))
      e.email_contacto = "Email inválido";
    if (!form.telefono_contacto.trim())
      e.telefono_contacto = "Teléfono obligatorio";
    if (!form.razon_solicitud.trim())
      e.razon_solicitud = "Indica el motivo de la solicitud";
    if (!form.tipo) e.tipo = "Selecciona el tipo (refugio o veterinaria)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("nombre_institucion", form.nombre_institucion);
    formData.append("email_contacto", form.email_contacto);
    formData.append("telefono_contacto", form.telefono_contacto);
    formData.append("razon_solicitud", form.razon_solicitud);
    formData.append("tipo", form.tipo);

    fetcher.submit(formData, { method: "post" });
  };

  const onChange = (k: keyof FormState, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const isSubmitting =
    fetcher.state === "submitting" || fetcher.state === "loading";

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Solicitud de Institución
            </h1>
            <p className="text-gray-600">
              Completa el formulario para solicitar que tu institución se una a
              Zoolip.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
              <div className="flex items-center gap-3 text-white">
                <FaBuilding className="text-2xl" />
                <h2 className="text-xl font-semibold">
                  Información de la institución
                </h2>
              </div>
            </div>

            <fetcher.Form
              method="post"
              className="p-6 space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre_institucion"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre de la institución{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-rose-400" />
                  </div>
                  <input
                    id="nombre_institucion"
                    name="nombre_institucion"
                    value={form.nombre_institucion}
                    onChange={(e) =>
                      onChange("nombre_institucion", e.target.value)
                    }
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-gray-900 ${
                      errors.nombre_institucion
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-rose-500"
                    }`}
                    placeholder="Refugio Patitas Felices"
                    disabled={isSubmitting}
                  />
                  {errors.nombre_institucion && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.nombre_institucion}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email_contacto"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email de contacto <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-rose-400" />
                  </div>
                  <input
                    id="email_contacto"
                    name="email_contacto"
                    type="email"
                    value={form.email_contacto}
                    onChange={(e) => onChange("email_contacto", e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-gray-900 ${
                      errors.email_contacto
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-rose-500"
                    }`}
                    placeholder="contacto@ejemplo.org"
                    disabled={isSubmitting}
                  />
                  {errors.email_contacto && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.email_contacto}
                    </div>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label
                  htmlFor="telefono_contacto"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Teléfono de contacto <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-rose-400" />
                  </div>
                  <input
                    id="telefono_contacto"
                    name="telefono_contacto"
                    value={form.telefono_contacto}
                    onChange={(e) =>
                      onChange("telefono_contacto", e.target.value)
                    }
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-gray-900 ${
                      errors.telefono_contacto
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-rose-500"
                    }`}
                    placeholder="+54 9 11 1234 5678"
                    disabled={isSubmitting}
                  />
                  {errors.telefono_contacto && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.telefono_contacto}
                    </div>
                  )}
                </div>
              </div>

              {/* Tipo y Razón */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tipo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={form.tipo}
                    onChange={(e) => onChange("tipo", e.target.value)}
                    className={`block w-full px-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-gray-900 ${
                      errors.tipo
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-rose-500"
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona...</option>
                    <option value="refugio">Refugio</option>
                    <option value="veterinaria">Veterinaria</option>
                  </select>
                  {errors.tipo && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.tipo}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="razon_solicitud"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Razón de la solicitud{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRegCommentDots className="text-rose-400" />
                    </div>
                    <textarea
                      id="razon_solicitud"
                      name="razon_solicitud"
                      value={form.razon_solicitud}
                      onChange={(e) =>
                        onChange("razon_solicitud", e.target.value)
                      }
                      className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-gray-900 ${
                        errors.razon_solicitud
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-rose-500"
                      }`}
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.razon_solicitud && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.razon_solicitud}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando solicitud...</span>
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      <span>Enviar solicitud</span>
                    </>
                  )}
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>

        {/* Modales */}
        {showModal && modalType === "success" && (
          <SuccessModal email={modalEmail} onClose={handleCloseModal} />
        )}

        {showModal && modalType === "error" && (
          <ErrorModal
            error={modalMessage}
            onClose={() => setShowModal(false)}
          />
        )}

        <style>{styles}</style>
      </div>
    </div>
  );
}

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;
