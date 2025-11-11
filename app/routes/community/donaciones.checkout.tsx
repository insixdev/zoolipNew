import React, { useState, useMemo } from "react";
import {
  useSearchParams,
  useNavigate,
  type ActionFunction,
} from "react-router";
import {
  FaArrowLeft,
  FaHeart,
  FaShieldAlt,
  FaCreditCard,
  FaPaypal,
  FaUniversity,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

type CheckoutState = "info" | "payment" | "success" | "error";

/**
 * Datos que se envían al backend para procesar la donación
 */
interface CheckoutData {
  id_institucion: number;
  monto: number;
  metodo_pago: "tarjeta" | "paypal" | "transferencia";
  nombre_donante: string;
  email_donante: string;
  mensaje?: string;
  anonimo: boolean;
}

/**
 * Server action para procesar la donación
 */
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return { error: "Método no permitido" };
  }

  try {
    const formData = await request.formData();

    const checkout: CheckoutData = {
      id_institucion: parseInt(formData.get("id_institucion") as string),
      monto: parseFloat(formData.get("monto") as string),
      metodo_pago: (formData.get("metodo_pago") as any) || "tarjeta",
      nombre_donante: (formData.get("nombre_donante") as string) || "",
      email_donante: (formData.get("email_donante") as string) || "",
      mensaje: (formData.get("mensaje") as string) || "",
      anonimo: formData.get("anonimo") === "true",
    };

    console.log("Procesando donación:", checkout);

    // Validaciones
    if (!checkout.id_institucion || checkout.id_institucion <= 0) {
      return Response.json({
        success: false,
        error: "Institución inválida",
      });
    }

    if (!checkout.monto || checkout.monto <= 0) {
      return Response.json({
        success: false,
        error: "Monto debe ser mayor a 0",
      });
    }

    if (!checkout.anonimo) {
      if (!checkout.nombre_donante || checkout.nombre_donante.trim() === "") {
        return Response.json({
          success: false,
          error: "El nombre es obligatorio",
        });
      }

      if (
        !checkout.email_donante ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.email_donante)
      ) {
        return Response.json({
          success: false,
          error: "El email es inválido",
        });
      }
    }

    // TODO: Integrar con proveedor de pagos (Stripe, MercadoPago, etc)
    // Por ahora simular éxito
    const mockDonationId = Math.floor(Math.random() * 10000) + 1;

    return Response.json({
      success: true,
      message: "Donación procesada exitosamente",
      donacion_id: mockDonationId,
      monto: checkout.monto,
    });
  } catch (err: any) {
    console.error("Error en checkout:", err);
    return Response.json({
      success: false,
      error: err.message || "Error al procesar la donación",
    });
  }
};

// Modal de Éxito
const SuccessModal: React.FC<{
  donationId: number;
  amount: number;
  onClose: () => void;
}> = ({ donationId, amount, onClose }) => {
  const [countdown, setCountdown] = useState(5);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
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
          ¡Donación Exitosa!
        </h2>

        {/* Amount */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Monto donado:</p>
          <p className="text-4xl font-bold text-green-600">
            ${amount.toLocaleString()}
          </p>
        </div>

        {/* Donation ID */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium mb-1">
            ID de donación:
          </p>
          <p className="text-lg font-mono text-blue-800">#{donationId}</p>
          <p className="text-xs text-blue-600 mt-2">
            Guarda este número para tu referencia
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
          Volver a Donaciones
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
          Error en la Donación
        </h2>

        {/* Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left max-h-32 overflow-y-auto">
          <p className="text-sm text-red-800 whitespace-pre-wrap break-words font-mono">
            {error}
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300"
        >
          Intentar de Nuevo
        </button>
      </div>
    </div>
  );
};

export default function DonacionesCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parámetros de la URL
  const idInstitucion = searchParams.get("institucion");
  const monto = searchParams.get("monto");

  const [state, setState] = useState<CheckoutState>("info");
  const [formData, setFormData] = useState({
    nombre_donante: "",
    email_donante: "",
    mensaje: "",
    anonimo: false,
    metodo_pago: "tarjeta" as const,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const montoNumerico = useMemo(() => {
    return parseFloat(monto || "0");
  }, [monto]);

  const handleContinue = () => {
    // Validación básica
    if (!formData.anonimo) {
      if (!formData.nombre_donante.trim()) {
        setErrorMessage("Por favor ingresa tu nombre");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_donante)) {
        setErrorMessage("Por favor ingresa un email válido");
        return;
      }
    }

    setState("payment");
  };

  const handlePayment = async (
    metodo: "tarjeta" | "paypal" | "transferencia"
  ) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const form = new FormData();
      form.append("id_institucion", idInstitucion || "");
      form.append("monto", montoNumerico.toString());
      form.append("metodo_pago", metodo);
      form.append("nombre_donante", formData.nombre_donante);
      form.append("email_donante", formData.email_donante);
      form.append("mensaje", formData.mensaje);
      form.append("anonimo", formData.anonimo.toString());

      const response = await fetch(window.location.pathname, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (data.success) {
        setSuccessData(data);
        setState("success");
      } else {
        setErrorMessage(data.error || "Error al procesar la donación");
        setState("error");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error al procesar la donación");
      setState("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    navigate("/community/donaciones");
  };

  const handleCloseError = () => {
    setState("info");
  };

  if (!idInstitucion || !monto) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Parámetros faltantes
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 md:pl-72">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-4 transition-colors"
          >
            <FaArrowLeft /> Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Confirmar Donación
          </h1>
          <p className="text-gray-600 mt-2">
            Completa tu donación de manera segura
          </p>
        </div>

        {/* Info Section */}
        {state === "info" && (
          <div className="space-y-6">
            {/* Monto Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Monto a donar:</span>
                <span className="text-3xl font-bold text-rose-600">
                  ${montoNumerico.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <FaShieldAlt /> Tu donación es 100% segura
              </div>
            </div>

            {/* Donor Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaHeart className="text-rose-500" /> Información del donante
              </h2>

              <div className="space-y-4">
                {/* Anonymous Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonimo"
                    checked={formData.anonimo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        anonimo: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                  />
                  <label htmlFor="anonimo" className="text-sm text-gray-700">
                    Donar de forma anónima
                  </label>
                </div>

                {/* Name */}
                {!formData.anonimo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tu nombre <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_donante}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nombre_donante: e.target.value,
                        }))
                      }
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-colors text-gray-900"
                    />
                  </div>
                )}

                {/* Email */}
                {!formData.anonimo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tu email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email_donante}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email_donante: e.target.value,
                        }))
                      }
                      placeholder="juan@example.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-colors text-gray-900"
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mensaje: e.target.value,
                      }))
                    }
                    placeholder="Comparte por qué esta causa es importante para ti..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-colors text-gray-900"
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full mt-6 bg-rose-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-rose-600 transition-colors duration-300"
              >
                Continuar al Pago
              </button>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {state === "payment" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCreditCard className="text-rose-500" /> Método de pago
            </h2>

            <div className="space-y-3 mb-6">
              {/* Tarjeta */}
              <button
                onClick={() => handlePayment("tarjeta")}
                disabled={isSubmitting}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-rose-500 rounded-lg transition-colors group disabled:opacity-50"
              >
                <FaCreditCard className="text-2xl text-gray-400 group-hover:text-rose-500" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">
                    Tarjeta de Crédito/Débito
                  </p>
                  <p className="text-sm text-gray-500">
                    Visa, Mastercard, American Express
                  </p>
                </div>
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-500"></div>
                )}
              </button>

              {/* PayPal */}
              <button
                onClick={() => handlePayment("paypal")}
                disabled={isSubmitting}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-blue-600 rounded-lg transition-colors group disabled:opacity-50"
              >
                <FaPaypal className="text-2xl text-gray-400 group-hover:text-blue-600" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">PayPal</p>
                  <p className="text-sm text-gray-500">
                    Paga con tu cuenta de PayPal
                  </p>
                </div>
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              </button>

              {/* Transferencia */}
              <button
                onClick={() => handlePayment("transferencia")}
                disabled={isSubmitting}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-green-600 rounded-lg transition-colors group disabled:opacity-50"
              >
                <FaUniversity className="text-2xl text-gray-400 group-hover:text-green-600" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">
                    Transferencia Bancaria
                  </p>
                  <p className="text-sm text-gray-500">
                    Realiza una transferencia directa
                  </p>
                </div>
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                )}
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setState("info")}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Volver
            </button>
          </div>
        )}

        {/* Success Modal */}
        {state === "success" && successData && (
          <SuccessModal
            donationId={successData.donacion_id}
            amount={successData.monto}
            onClose={handleCloseSuccess}
          />
        )}

        {/* Error Modal */}
        {state === "error" && (
          <ErrorModal error={errorMessage} onClose={handleCloseError} />
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
