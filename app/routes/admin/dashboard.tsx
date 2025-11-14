import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/roleGuards";
import { AnyAdminRole } from "~/components/auth/AdminGuard";
import { AreaChartInteractive } from "~/components/charts/AreaChartInteractive";
import { AreaChartLinear } from "~/components/charts/AreaChartLinear";
import { getUserFromRequest } from "~/server/me";
import { ADMIN_ROLES } from "~/lib/constants";

// Loader
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  const userData = await getUserFromRequest(request);
  const userRole = "user" in userData ? userData.user?.role : null;
  const isSystemAdmin = userRole === ADMIN_ROLES.SYSTEM;

  // Datos de ejemplo - en producción vendrían de tu API
  // Para ROLE_SYSTEM: datos globales de todas las instituciones
  // Para otros roles: datos específicos de su institución
  const adopcionesData = generateMonthlyData("adopciones", "donaciones");
  const visitasData = generateMonthlyData("desktop", "mobile");

  return {
    adopcionesData,
    visitasData,
    isSystemAdmin,
    userRole,
  };
}

// Helper para generar datos de ejemplo
function generateMonthlyData(key1: string, key2: string) {
  const data = [];
  const startDate = new Date("2024-01-01");

  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    data.push({
      date: date.toISOString().split("T")[0],
      [key1]: Math.floor(Math.random() * 50) + 10,
      [key2]: Math.floor(Math.random() * 40) + 5,
    });
  }

  return data;
}

// Componente de ejemplo para gráfico lineal
function AreaChartLinearExample() {
  const monthlyData = [
    { month: "Enero", visitors: 186 },
    { month: "Febrero", visitors: 305 },
    { month: "Marzo", visitors: 237 },
    { month: "Abril", visitors: 173 },
    { month: "Mayo", visitors: 209 },
    { month: "Junio", visitors: 214 },
  ];

  return (
    <AreaChartLinear
      data={monthlyData}
      dataKey="visitors"
      xAxisKey="month"
      config={{
        label: "Visitantes",
        color: "#ec4899",
      }}
      title="Visitantes Mensuales"
      description="Total de visitantes en los últimos 6 meses"
      trend={{
        value: 5.2,
        label: "este mes",
      }}
      footer="Enero - Junio 2024"
      height={200}
    />
  );
}

export default function AdminReportes() {
  const { adopcionesData, visitasData, isSystemAdmin, userRole } =
    useLoaderData<typeof loader>();

  const adopcionesConfig = {
    adopciones: {
      label: "Adopciones",
      color: "hsl(var(--chart-1))",
    },
    donaciones: {
      label: "Donaciones",
      color: "hsl(var(--chart-2))",
    },
  };

  const visitasConfig = {
    desktop: {
      label: "Desktop",
      color: "#ec4899",
    },
    mobile: {
      label: "Mobile",
      color: "#f97316",
    },
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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {isSystemAdmin
              ? "Visualiza estadísticas globales del sistema"
              : "Visualiza estadísticas y métricas de tu institución"}
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Adopciones</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">247</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12% vs mes anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Mascotas Disponibles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">34</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">En el sistema</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Donaciones</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">$12,450</p>
              </div>
              <div className="bg-rose-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-rose-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-rose-600 mt-2">+8% vs mes anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Solicitudes Pendientes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Requieren atención</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AreaChartInteractive
            data={adopcionesData}
            config={adopcionesConfig}
            title="Adopciones y Donaciones"
            description="Tendencia de adopciones y donaciones en el tiempo"
            height={300}
          />

          <AreaChartInteractive
            data={visitasData}
            config={visitasConfig}
            title="Visitas al Sitio"
            description="Tráfico por dispositivo"
            height={300}
          />
        </div>

        {/* Gráficos lineales simples */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AreaChartLinearExample />
        </div>
      </div>
    </AnyAdminRole>
  );
}
