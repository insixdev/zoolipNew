import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/roleGuards";
import { AnyAdminRole } from "~/components/auth/AdminGuard";

// Tipo de solicitud
type Solicitud = {
  id: number;
  usuario: string;
  email: string;
  mascota: string;
  fecha: string;
  estado: "pendiente" | "aprobada" | "rechazada";
};

// Loader
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  // Aquí harías la llamada real a tu API
  const solicitudes: Solicitud[] = [
    {
      id: 1,
      usuario: "María González",
      email: "maria@example.com",
      mascota: "Max (Labrador)",
      fecha: "2024-01-15",
      estado: "pendiente",
    },
    {
      id: 2,
      usuario: "Carlos Ruiz",
      email: "carlos@example.com",
      mascota: "Luna (Siamés)",
      fecha: "2024-01-14",
      estado: "aprobada",
    },
    {
      id: 3,
      usuario: "Ana Martínez",
      email: "ana@example.com",
      mascota: "Rocky (Pastor Alemán)",
      fecha: "2024-01-13",
      estado: "rechazada",
    },
  ];

  return { solicitudes };
}

export default function AdminSolicitudes() {
  const { solicitudes } = useLoaderData<typeof loader>();

  const getEstadoColor = (estado: string) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800",
      aprobada: "bg-green-100 text-green-800",
      rechazada: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <AnyAdminRole
      fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes acceso a esta sección</p>
        </div>
      }
    >
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Solicitudes de Adopción
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona las solicitudes de adopción de mascotas
          </p>
        </div>

        {/* Tabla simple */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        #{solicitud.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {solicitud.usuario}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {solicitud.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-rose-600">
                        {solicitud.mascota}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {solicitud.fecha}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(solicitud.estado)}`}
                      >
                        {solicitud.estado.charAt(0).toUpperCase() +
                          solicitud.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Aprobar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Nota:</strong> Para usar la tabla avanzada con filtros y
            ordenamiento, reinicia el contenedor Docker después de instalar las
            dependencias.
          </p>
        </div>
      </div>
    </AnyAdminRole>
  );
}
