import { useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/roleGuards";
import { AnyAdminRole } from "~/components/auth/AdminGuard";
import { getInstitutionByIdUsuarioService } from "~/features/entities/institucion/institutionService";

// Loader para verificar autenticación
export async function loader({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  return null;
}

// Action para crear la mascota
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return Response.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    // Verificar que sea admin
    await requireAdmin(request);

    // Obtener id_institucion del JWT payload
    const token = cookieHeader.split("AUTH_TOKEN=")[1]?.split(";")[0];
    if (!token) {
      return Response.json(
        { success: false, error: "Token no encontrado" },
        { status: 401 }
      );
    }

    // Decodificar el token para obtener id_usuario
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload || !payload.id_usuario) {
      return Response.json(
        { success: false, error: "Token no válido" },
        { status: 401 }
      );
    }

    // Obtener la institución del usuario
    const institutionData = await getInstitutionByIdUsuarioService(
      payload.id_usuario,
      cookieHeader
    );

    if (!institutionData || !institutionData.id_institucion) {
      return Response.json(
        { success: false, error: "No tienes una institución asociada" },
        { status: 400 }
      );
    }

    // Preparar datos de la mascota usando el servicio
    const { addPetService } = await import("~/features/mascotas/petsService");

    const pet = {
      name: "", // Campo vacío, el backend lo generará
      size: formData.get("tamanio") as string,
      adoptionState: "DISPONIBLE",
      healthState: "SALUDABLE",
      age: parseInt(formData.get("edad") as string),
      race: formData.get("raza") as string,
      species: formData.get("especie") as string,
      id_institution: {
        id_institucion: institutionData.id_institucion,
      },
    };

    // Validar datos
    if (!pet.size || !pet.age || !pet.race || !pet.species) {
      return Response.json(
        { success: false, error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    console.log("Creando mascota:", pet);

    // Llamar al servicio
    const res = await addPetService(pet, cookieHeader);

    return Response.json({
      success: true,
      message: res.message || "Mascota creada exitosamente",
    });
  } catch (err) {
    console.error("Create pet error:", err);
    return Response.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Error al crear mascota",
      },
      { status: 500 }
    );
  }
}

type FormErrors = {
  tamanio?: string;
  edad?: string;
  raza?: string;
  especie?: string;
};

export default function CrearMascota() {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});

  const isLoading = fetcher.state === "submitting";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const newErrors: FormErrors = {};

    // Validaciones
    if (!formData.get("tamanio")) {
      newErrors.tamanio = "El tamaño es requerido";
    }
    if (!formData.get("edad")) {
      newErrors.edad = "La edad es requerida";
    }
    if (!formData.get("raza")) {
      newErrors.raza = "La raza es requerida";
    }
    if (!formData.get("especie")) {
      newErrors.especie = "La especie es requerida";
    }

    if (Object.keys(newErrors).length > 0) {
      e.preventDefault();
      setErrors(newErrors);
      return;
    }

    setErrors({});
  };

  return (
    <AnyAdminRole
      fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes acceso a esta sección</p>
        </div>
      }
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/mascotas")}
            className="text-gray-900 hover:text-gray-700 flex items-center gap-2 mb-4 font-medium"
          >
            ← Volver a mascotas
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Agregar Nueva Mascota
          </h1>
          <p className="text-gray-600 mt-2">
            Completa el formulario para registrar una nueva mascota en el
            sistema
          </p>
        </div>

        {fetcher.data?.error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            {fetcher.data.error}
          </div>
        )}

        {fetcher.data?.success && (
          <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg border border-green-100">
            ¡Mascota creada exitosamente!
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <fetcher.Form method="post" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Especie */}
              <div>
                <label
                  htmlFor="especie"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Especie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="especie"
                  name="especie"
                  placeholder="Ej: Perro, Gato"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 text-black focus:ring-rose-500 focus:border-transparent ${
                    errors.especie ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.especie && (
                  <p className="mt-1 text-sm text-red-500">{errors.especie}</p>
                )}
              </div>

              {/* Raza */}
              <div>
                <label
                  htmlFor="raza"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Raza <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="raza"
                  name="raza"
                  placeholder="Ej: Labrador, Siamés"
                  className={`w-full px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                    errors.raza ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.raza && (
                  <p className="mt-1 text-sm text-red-500">{errors.raza}</p>
                )}
              </div>

              {/* Edad */}
              <div>
                <label
                  htmlFor="edad"
                  className="block text-black text-sm font-medium gray-700 mb-2"
                >
                  Edad (años) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  min="0"
                  placeholder="Ej: 2"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 text-black focus:ring-rose-500 focus:border-transparent ${
                    errors.edad ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.edad && (
                  <p className="mt-1 text-sm text-red-500">{errors.edad}</p>
                )}
              </div>

              {/* Tamaño */}
              <div>
                <label
                  htmlFor="tamanio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tamaño <span className="text-red-500">*</span>
                </label>
                <select
                  id="tamanio"
                  name="tamanio"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 ${
                    errors.tamanio ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Seleccionar tamaño</option>
                  <option value="PEQUENIO">Pequeño</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                </select>
                {errors.tamanio && (
                  <p className="mt-1 text-sm text-red-500">{errors.tamanio}</p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creando mascota...
                  </span>
                ) : (
                  "Crear Mascota"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/mascotas")}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </fetcher.Form>
        </div>
      </div>
    </AnyAdminRole>
  );
}
