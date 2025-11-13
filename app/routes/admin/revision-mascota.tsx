import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";
import { VeterinariaOnly } from "~/components/auth/AdminGuard";

// Solo veterinarias pueden acceder
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);

  // Verificar que sea una veterinaria
  if (user.user?.role !== "ROLE_VETERINARIA") {
    throw new Response("Acceso denegado. Solo veterinarias pueden acceder.", {
      status: 403,
    });
  }

  return { user };
}

export default function RevisionMascota() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <VeterinariaOnly
      fallback={
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">
            Acceso denegado. Solo veterinarias pueden acceder.
          </p>
        </div>
      }
    >
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Revisión de Mascotas
          </h1>
          <p className="text-gray-600 mt-2">
            Panel exclusivo para veterinarias - Usuario: {user.username}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✅ Acceso autorizado como ROLE_VETERINARIA
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            Funcionalidades de Veterinaria
          </h2>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                📋 Historial Médico
              </h3>
              <p className="text-gray-600 text-sm">
                Acceso al historial médico completo de las mascotas
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                💉 Registrar Vacunas
              </h3>
              <p className="text-gray-600 text-sm">
                Registrar vacunas y tratamientos aplicados
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                🩺 Diagnósticos
              </h3>
              <p className="text-gray-600 text-sm">
                Crear y actualizar diagnósticos médicos
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                📅 Citas Programadas
              </h3>
              <p className="text-gray-600 text-sm">
                Ver y gestionar citas programadas
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Nota:</strong> Esta es una ruta de ejemplo que
              demuestra el control de acceso basado en roles específicos de
              institución.
            </p>
          </div>
        </div>
      </div>
    </VeterinariaOnly>
  );
}
