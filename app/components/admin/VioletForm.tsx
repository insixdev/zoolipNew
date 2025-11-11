import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaLink,
  FaCopy,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";
import { AdministradorOnly } from "~/components/auth/AdminGuard";
import { ADMIN_ROLES } from "~/lib/constants";

type FormErrors = {
  nombre?: string;
  email?: string;
  tipo?: string;
};

export default function VioletForm() {
  const fetcher = useFetcher<{ inviteLink?: string; error?: string }>();
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isSubmitting = fetcher.state === "submitting";
  const inviteLink = fetcher.data?.inviteLink;
  const serverError = fetcher.data?.error;

  // Limpiar el formulario luego de un exito
  useEffect(() => {
    if (fetcher.data?.inviteLink) {
      const form = document.getElementById("admin-form") as HTMLFormElement;
      if (form) form.reset();
      setErrors({});
      setTouched({});
    }
  }, [fetcher.data]);
  // que sea un email valido
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3)
          return "El nombre debe tener al menos 3 caracteres";
        return undefined;

      case "email":
        if (!value.trim()) return "El correo electrónico es obligatorio";
        if (!validateEmail(value))
          return "Ingresa un correo electrónico válido";
        return undefined;

      case "tipo":
        if (!value) return "Debes seleccionar un tipo de administrador";
        return undefined;

      default:
        return undefined;
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Validar todos los campos
    const newErrors: FormErrors = {};
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const tipo = formData.get("tipo") as string;

    newErrors.nombre = validateField("nombre", nombre);
    newErrors.email = validateField("email", email);
    newErrors.tipo = validateField("tipo", tipo);

    // Marcar todos como touched
    setTouched({ nombre: true, email: true, tipo: true });
    setErrors(newErrors);

    // Si hay errores, no enviar
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Enviar con fetcher
    fetcher.submit(formData, {
      method: "post",
      action: "/api/admin/invitation",
    });
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AdministradorOnly
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Acceso denegado
            </h1>
            <p className="text-gray-600">
              Solo administradores de sistema pueden registrar nuevos admins
            </p>
            <p className="text-gray-600">
              <Link to="/" className="text-rose-500">
                Volver al inicio
              </Link>
            </p>
          </div>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Registrar Nuevo Administrador
          </h1>
          <p className="text-gray-600">
            Crea una invitación para un nuevo administrador del sistema
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
            <div className="flex items-center gap-3 text-white">
              <FaShieldAlt className="text-2xl" />
              <h2 className="text-xl font-semibold">
                Información del Administrador
              </h2>
            </div>
          </div>

          <form
            id="admin-form"
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
          >
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre completo <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser
                    className={
                      errors.nombre && touched.nombre
                        ? "text-red-400"
                        : "text-rose-400"
                    }
                  />
                </div>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-black ${
                    errors.nombre && touched.nombre
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
                  }`}
                  placeholder="Juan Pérez"
                />
              </div>
              {errors.nombre && touched.nombre && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <FaExclamationCircle className="text-xs" />
                  <span>{errors.nombre}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope
                    className={
                      errors.email && touched.email
                        ? "text-red-400"
                        : "text-rose-400"
                    }
                  />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-black ${
                    errors.email && touched.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
                  }`}
                  placeholder="admin@ejemplo.com"
                />
              </div>
              {errors.email && touched.email && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <FaExclamationCircle className="text-xs" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Tipo de Admin */}
            <div>
              <label
                htmlFor="tipo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipo de administrador <span className="text-rose-500">*</span>
              </label>
              <select
                id="tipo"
                name="tipo"
                onBlur={handleBlur}
                onChange={handleChange}
                className={`block w-full px-3 py-2.5 border rounded-lg focus:ring-2 transition-colors text-black ${
                  errors.tipo && touched.tipo
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-rose-500 focus:border-rose-500"
                }`}
              >
                <option value="">Selecciona un tipo</option>
                <option value={ADMIN_ROLES.VETERINARIO}>Veterinaria</option>
                <option value={ADMIN_ROLES.PROTECTORA}>Protectora</option>
                <option value={ADMIN_ROLES.REFUGIO}>Refugio</option>
                <option value={ADMIN_ROLES.ADMINISTRADOR}>
                  Administrador del Sistema
                </option>
              </select>
              {errors.tipo && touched.tipo && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <FaExclamationCircle className="text-xs" />
                  <span>{errors.tipo}</span>
                </div>
              )}
            </div>

            {/* Organización (opcional) */}
            <div>
              <label
                htmlFor="organizacion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de la organización{" "}
                <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="text"
                id="organizacion"
                name="organizacion"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-black"
                placeholder="Refugio Patitas Felices"
              />
            </div>

            {/* Server Error message */}
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                <div className="flex items-center gap-2">
                  <FaExclamationCircle className="text-red-600" />
                  <p className="text-sm text-red-600">{serverError}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generando invitación...</span>
                </>
              ) : (
                <>
                  <FaShieldAlt />
                  <span>Generar Link de Invitación</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Link de invitación generado */}
        {inviteLink && (
          <div className="mt-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-sm border-2 border-rose-200 overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4">
              <div className="flex items-center gap-2 text-white">
                <FaCheck className="text-xl" />
                <h3 className="font-semibold">
                  ¡Invitación generada exitosamente!
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                Comparte este link con el nuevo administrador para que complete
                su registro:
              </p>

              {/* Link en rejilla */}
              <div className="bg-white rounded-lg border-2 border-rose-300 p-4">
                <div className="flex items-center gap-3">
                  <FaLink className="text-rose-500 text-xl flex-shrink-0" />
                  <code className="flex-1 text-sm text-gray-700 break-all font-mono bg-rose-50 px-3 py-2 rounded">
                    {inviteLink}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 p-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                    title="Copiar link"
                  >
                    {copied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>

              {copied && (
                <div className="flex items-center gap-2 text-green-600 text-sm animate-fadeIn">
                  <FaCheck />
                  <span>¡Link copiado al portapapeles!</span>
                </div>
              )}

              <div className="bg-rose-100 border border-rose-300 rounded-lg p-4">
                <p className="text-sm text-rose-800">
                  <strong>Nota:</strong> Este link es de un solo uso y expirará
                  en 7 días. El administrador deberá usarlo para completar su
                  registro.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </AdministradorOnly>
  );
}
