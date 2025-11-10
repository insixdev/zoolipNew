
import { Save, Camera } from "lucide-react";
import { useState } from "react";
import { LoaderFunctionArgs } from "react-router";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

// opcional, si después querés cargar algo del backend
export async function loader({ request }: LoaderFunctionArgs) {}

export default function ProfileSettings() {
  const { user } = useSmartAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleCancelar = () => {
    setShowConfirmation(false);
  };

  const confirmSave = async () => {
    setIsSaving(true);

    // Simula un delay de guardado (por ejemplo, una llamada API)
    await new Promise((r) => setTimeout(r, 1200));

    setIsSaving(false);
    setShowConfirmation(false);
    setResult("Cambios guardados correctamente");
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
          Información del Perfil
        </h3>

        {/* Avatar */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-rose-700 font-bold text-2xl">
              TU
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Foto de perfil
            </h4>
            <p className="text-sm text-gray-500">
              JPG, GIF o PNG. Máximo 1MB.
            </p>
          </div>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              defaultValue={user?.username || "Tu Usuario"}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 line-through">
              Apellido
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email || "usuario@ejemplo.com"}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>

          <div className="field-disabled px-4 py-5 sm:p-6">
            <label
              className="
                block text-sm font-medium text-gray-700
                transition-all duration-300
                hover:line-through hover:text-gray-500
              "
            >
              Teléfono
            </label>
            <input
              type="tel"
              disabled
              readOnly
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Biografía */}
        <div className="mt-6">
          <label className="line-through block text-sm font-medium text-gray-700">
            Biografía
          </label>
          <textarea
            rows={3}
            disabled
            defaultValue="Amante de los animales y defensor de la adopción responsable."
            className="mt-1 line-through block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
          />
        </div>

        {/* Botón Guardar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGuardar}
            className="bg-rose-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </button>
        </div>

        {/* Mensaje de resultado */}
        {result && (
          <div className="flex justify-center mt-6 px-6">
            <div
              className={`
                px-6 py-3 rounded-lg text-sm font-semibold shadow-md transition-all duration-300
                ${
                  result.includes("error") || result.includes("Error")
                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }
              `}
            >
              {result}
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Estás seguro?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Los cambios se guardarán de forma permanente.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelar}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSave}
                  className="px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-60"
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

