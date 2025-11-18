import { useState, useEffect } from "react";
import { useFetcher, useNavigate, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/roleGuards";
import { AnyAdminRole } from "~/components/auth/AdminGuard";

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  tamanio: string;
  estadoAdopcion: string;
  estadoSalud: string;
};

// Loader para obtener la mascota por ID
export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const cookieHeader = request.headers.get("Cookie");
  const { id } = params;

  if (!cookieHeader || !id) {
    throw new Response("No autorizado", { status: 401 });
  }

  try {
    const { getPetByIdService } = await import(
      "~/features/mascotas/petsService"
    );
    const mascota = await getPetByIdService(id, cookieHeader);
    return { mascota };
  } catch (error) {
    console.error("Error obteniendo mascota:", error);
    throw new Response("Mascota no encontrada", { status: 404 });
  }
}

// Action para actualizar la mascota
export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");
  const { id } = params;

  if (!cookieHeader || !id) {
    return Response.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    await requireAdmin(request);

    // Obtener el ID del usuario actual del token
    const { getUserFieldFromCookie, field } = await import("~/lib/authUtil");
    const userId = getUserFieldFromCookie(cookieHeader, field.ID);

    console.log("[EDITAR MASCOTA] ID de usuario:", userId);

    if (!userId) {
      return Response.json(
        { success: false, error: "No se pudo obtener el ID del usuario" },
        { status: 401 }
      );
    }

    // Obtener el ID de la institución del usuario actual
    const { getInstitutionByIdUsuarioService } = await import(
      "~/features/entities/institucion/institutionService"
    );

    let institutionId;
    try {
      const institution = await getInstitutionByIdUsuarioService(
        Number(userId),
        cookieHeader
      );
      institutionId = institution.id_institucion;
      console.log(
        "[EDITAR MASCOTA] ID de institución obtenido:",
        institutionId
      );
    } catch (error) {
      console.error("[EDITAR MASCOTA] Error obteniendo institución:", error);
      return Response.json(
        {
          success: false,
          error: "Institución no encontrada para el usuario actual",
        },
        { status: 404 }
      );
    }

    const { editPetService } = await import("~/features/mascotas/petsService");

    const pet = {
      id: parseInt(id),
      name: "", // Campo vacío, el backend mantiene el nombre existente
      size: formData.get("tamanio") as string,
      adoptionState: formData.get("estadoAdopcion") as string,
      healthState: formData.get("estadoSalud") as string,
      age: parseInt(formData.get("edad") as string),
      race: formData.get("raza") as string,
      species: formData.get("especie") as string,
      id_institution: {
        id_institucion: institutionId,
      },
    };

    console.log("Actualizando mascota:", pet);

    const res = await editPetService(pet, cookieHeader);

    return Response.json({
      success: true,
      message: res.message || "Mascota actualizada exitosamente",
    });
  } catch (err) {
    console.error("Error actualizando mascota:", err);
    return Response.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : "Error al actualizar mascota",
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
  estadoAdopcion?: string;
  estadoSalud?: string;
};

export default function EditarMascota() {
  const { mascota } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    especie: mascota.especie || "",
    raza: mascota.raza || "",
    edad: mascota.edad?.toString() || "",
    tamanio: mascota.tamanio || "",
    estadoAdopcion: mascota.estadoAdopcion || "",
    estadoSalud: mascota.estadoSalud || "",
  });

  const isLoading = fetcher.state === "submitting";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const newErrors: FormErrors = {};

    if (!formData.get("tamanio")) newErrors.tamanio = "El tamaño es requerido";
    if (!formData.get("edad")) newErrors.edad = "La edad es requerida";
    if (!formData.get("raza")) newErrors.raza = "La raza es requerida";
    if (!formData.get("especie")) newErrors.especie = "La especie es requerida";
    if (!formData.get("estadoAdopcion"))
      newErrors.estadoAdopcion = "El estado de adopción es requerido";
    if (!formData.get("estadoSalud"))
      newErrors.estadoSalud = "El estado de salud es requerido";

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
            Editar Mascota #{mascota.id}
          </h1>
          <p className="text-gray-600 mt-2">
            Actualiza la información de la mascota
          </p>
        </div>

        {fetcher.data?.error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            {fetcher.data.error}
          </div>
        )}

        {fetcher.data?.success && (
          <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg border border-green-100">
            ¡Mascota actualizada exitosamente!
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <fetcher.Form method="post" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Especie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="especie"
                  value={formData.especie}
                  onChange={(e) =>
                    setFormData({ ...formData, especie: e.target.value })
                  }
                  className={`w-full px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-rose-500 ${
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raza <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="raza"
                  value={formData.raza}
                  onChange={(e) =>
                    setFormData({ ...formData, raza: e.target.value })
                  }
                  className={`w-full px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-rose-500 ${
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad (años) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="edad"
                  min="0"
                  value={formData.edad}
                  onChange={(e) =>
                    setFormData({ ...formData, edad: e.target.value })
                  }
                  className={`w-full px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-rose-500 ${
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño <span className="text-red-500">*</span>
                </label>
                <select
                  name="tamanio"
                  value={formData.tamanio}
                  onChange={(e) =>
                    setFormData({ ...formData, tamanio: e.target.value })
                  }
                  className={`w-full px-4 py-2 border text-gray-900 rounded-lg focus:ring-2 focus:ring-rose-500 ${
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

              {/* Estado de Adopción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Adopción <span className="text-red-500">*</span>
                </label>
                <select
                  name="estadoAdopcion"
                  value={formData.estadoAdopcion}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoAdopcion: e.target.value })
                  }
                  className={`w-full px-4 py-2 border text-gray-900 rounded-lg focus:ring-2 focus:ring-rose-500 ${
                    errors.estadoAdopcion ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Seleccionar estado</option>
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="ADOPTADO">Adoptado</option>
                </select>
                {errors.estadoAdopcion && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.estadoAdopcion}
                  </p>
                )}
              </div>

              {/* Estado de Salud */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Salud <span className="text-red-500">*</span>
                </label>
                <select
                  name="estadoSalud"
                  value={formData.estadoSalud}
                  onChange={(e) =>
                    setFormData({ ...formData, estadoSalud: e.target.value })
                  }
                  className={`w-full px-4 py-2 border text-gray-900 rounded-lg focus:ring-2 focus:ring-rose-500 ${
                    errors.estadoSalud ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Seleccionar estado</option>
                  <option value="SALUDABLE">Saludable</option>
                  <option value="ENFERMO">Enfermo</option>
                  <option value="CONVALECIENTE">Convaleciente</option>
                </select>
                {errors.estadoSalud && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.estadoSalud}
                  </p>
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
                {isLoading ? "Actualizando..." : "Actualizar Mascota"}
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
