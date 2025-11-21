import { Save, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import ImageUploader from "~/components/upload/ImageUploader";
import type { User } from "~/features/entities/User";

interface ProfileSettingsProps {
  user?: User | null;
}

export default function ProfileSettings({ user: propUser }: ProfileSettingsProps) {
  const { user: authUser } = useSmartAuth();
  const user = propUser || authUser;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [imagenUrl, setImagenUrl] = useState<string>("");
  const [biografia, setBiografia] = useState<string>("");

  console.log("[ProfileSettings] Usuario recibido:", {
    username: user?.username,
    email: user?.email,
    imagen_url: user?.imagen_url,
    biografia: user?.biografia,
  });

  // Actualizar states cuando el usuario cambia (cuando llega del loader)
  useEffect(() => {
    if (user) {
      console.log("[ProfileSettings] Actualizando states con usuario:", {
        imagen_url: user.imagen_url,
        biografia: user.biografia,
      });
      setImagenUrl(user.imagen_url || "");
      setBiografia(user.biografia || "");
    }
  }, [user?.id]); // Usar ID como dependencia para evitar loops infinitos

  const isSaving = fetcher.state === "submitting";

  // Redirigir al login cuando la actualización sea exitosa
  useEffect(() => {
    if (fetcher.data?.status === "success" && fetcher.state === "idle") {
      // Mostrar mensaje brevemente antes de redirigir
      const message = imagenUrl 
        ? `✓ Cambios guardados. Imagen actualizada: ${imagenUrl}. Redirigiendo al login...`
        : "✓ Cambios guardados. Redirigiendo al login...";
      setResult(message);
      console.log("[ProfileSettings] ✓ Update success:", {
        imagen_url: imagenUrl,
        response: fetcher.data,
      });
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    }
  }, [fetcher.data, fetcher.state, navigate, imagenUrl]);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleCancelar = () => {
    setShowConfirmation(false);
  };

  const confirmSave = async () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

      // Crear un nuevo FormData solo con los campos que tienen valor
      const cleanFormData = new FormData();

      // Leer del DOM
      const nombre = formData.get("nombre") as string;
      const email = formData.get("email") as string;
      
      // Usar el state para biografia e imagen_url que se actualizaron
      const biografiaValue = biografia;
      const imagen_url = imagenUrl;

      console.log("[confirmSave] Valores extraídos:", {
        nombre,
        email,
        biografia: biografiaValue,
        imagen_url,
        imagenUrlState: imagenUrl,
      });

    if (nombre && nombre.trim()) {
      cleanFormData.append("nombre", nombre.trim());
    }

    if (email && email.trim()) {
      cleanFormData.append("email", email.trim());
    }

    // Enviar imagen_url del state (se actualiza en onUploadSuccess)
    if (imagen_url && imagen_url.trim()) {
      cleanFormData.append("imagen_url", imagen_url.trim());
      console.log("[confirmSave] ✓ Agregando imagen_url:", imagen_url);
    } else {
      console.log("[confirmSave] ⚠️ Sin imagen_url");
    }

    // Siempre enviar biografía (puede estar vacía para borrarla)
    cleanFormData.append("biografia", biografiaValue ? biografiaValue.trim() : "");

    console.log("[confirmSave] FormData a enviar - campos:", 
      Array.from(cleanFormData.entries()).map(([k, v]) => k)
    );
    
    // Debug: mostrar toda la formData
    console.log("[confirmSave] FormData COMPLETA:", {
      nombre,
      email,
      biografia: biografiaValue,
      imagen_url,
      allEntries: Array.from(cleanFormData.entries()),
    });

    fetcher.submit(cleanFormData, {
      method: "post",
      action: "/api/user/update",
    });

    setShowConfirmation(false);
  };

  // Mostrar resultado de error cuando el fetcher termine
  if (fetcher.data && fetcher.state === "idle" && !result) {
    if (fetcher.data.status === "error") {
      setResult(`✗ Error: ${fetcher.data.message}`);
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setResult(null), 5000);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
          Información del Perfil
        </h3>

        {/* Avatar */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            {imagenUrl ? (
              <img
                src={imagenUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-rose-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-rose-700 font-bold text-2xl">
                TU
              </div>
            )}
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
            <p className="text-sm text-gray-500">JPG, GIF o PNG. Máximo 1MB.</p>
          </div>
        </div>

        {/* Formulario */}
        <form ref={formRef} onSubmit={handleGuardar}>
          {/* Campos */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="nombre"
                defaultValue={user?.username || ""}
                disabled
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 line-through">
                Apellido (no disponible)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user?.email || ""}
                disabled
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900 bg-gray-50"
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
          <div className="mt-6 col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Biografía
            </label>
            <textarea
              name="biografia"
              rows={3}
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900"
            />
          </div>

          {/* Subir imagen de perfil */}
          <div className="mt-6 col-span-2">
            <ImageUploader
                onUploadSuccess={(fileUrl) => {
                 // Usar directamente /upload/ sin conversión
                 console.log("[ProfileSettings] Imagen subida exitosamente:", fileUrl);
                 setImagenUrl(fileUrl);
                }}
              currentImage={imagenUrl}
              label="Foto de perfil"
              maxSizeMB={5}
            />
            {/* Input oculto para enviar la URL en el formulario */}
            <input
              type="hidden"
              name="imagen_url"
              value={imagenUrl}
              onChange={() => {}}
            />
            {/* Debug: mostrar el valor */}
            {imagenUrl && (
              <div className="text-xs text-gray-500 mt-2">
                URL guardada: {imagenUrl}
              </div>
            )}
          </div>

          {/* Botón Guardar */}
          <div className="mt-6 flex justify-end col-span-2">

        <p className="pt-0 text-sm text-gray-400 opacity-60 mr-10"> tendras que inciar sesion de vuelta cuando guardes</p>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-rose-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>

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