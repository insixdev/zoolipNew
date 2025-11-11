import { Link } from "react-router";
import {
  FaServer,
  FaUsers,
  FaDatabase,
  FaChartBar,
  FaShieldAlt,
  FaCog,
  FaExclamationTriangle,
} from "react-icons/fa";
import { AdministradorOnly } from "~/components/auth/AdminGuard";

export default function SystemDashboard() {
  const systemStats = [
    {
      title: "Usuarios totales",
      value: "1,234",
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      change: "+12%",
    },
    {
      title: "Refugios activos",
      value: "45",
      icon: <FaShieldAlt className="text-green-500 text-2xl" />,
      change: "+3",
    },
    {
      title: "Veterinarias",
      value: "28",
      icon: <FaServer className="text-purple-500 text-2xl" />,
      change: "+5",
    },
    {
      title: "Protectoras",
      value: "32",
      icon: <FaDatabase className="text-yellow-500 text-2xl" />,
      change: "+2",
    },
  ];

  const systemHealth = [
    {
      service: "API Server",
      status: "online",
      uptime: "99.9%",
      color: "bg-green-500",
    },
    {
      service: "Database",
      status: "online",
      uptime: "99.8%",
      color: "bg-green-500",
    },
    {
      service: "Storage",
      status: "online",
      uptime: "99.7%",
      color: "bg-green-500",
    },
    {
      service: "Email Service",
      status: "warning",
      uptime: "98.5%",
      color: "bg-yellow-500",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Alto uso de CPU detectado",
      time: "Hace 1 hora",
    },
    {
      id: 2,
      type: "info",
      message: "Backup completado exitosamente",
      time: "Hace 3 horas",
    },
    {
      id: 3,
      type: "error",
      message: "Fallo en envío de email",
      time: "Hace 5 horas",
    },
  ];

  const adminActions = [
    {
      title: "Gestionar usuarios",
      icon: <FaUsers />,
      link: "/admin/system/users",
      color: "bg-blue-100 text-blue-600",
      description: "Ver, buscar y administrar cuentas de usuario",
    },
    {
      title: "Configuración",
      icon: <FaCog />,
      link: "/admin/system/config",
      color: "bg-gray-100 text-gray-600",
      description: "Ajustes generales del sistema y parámetros",
    },
    {
      title: "Reportes",
      icon: <FaChartBar />,
      link: "/admin/system/reports",
      color: "bg-purple-100 text-purple-600",
      description: "Generar y visualizar reportes del sistema",
    },
    {
      title: "Seguridad",
      icon: <FaShieldAlt />,
      link: "/admin/system/security",
      color: "bg-green-100 text-green-600",
      description: "Políticas, roles y monitoreo de seguridad",
    },
  ];

  return (
    <AdministradorOnly
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Acceso denegado
            </h1>
            <p className="text-gray-600">
              Solo administradores del sistema pueden acceder
            </p>
            <Link
              to="/"
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      }
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Panel de Sistema
            </h1>
            <p className="text-gray-600 mt-1">
              Administración y monitoreo del sistema
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Sistema operativo</span>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/admin/system/users"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gestionar Usuarios
          </Link>
          <Link
            to="/admin/system/institutions"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Gestionar Instituciones
          </Link>
          <Link
            to="/admin/system/institutionSolicitudes"
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Solicitudes Instituciones
          </Link>
          <Link
            to="/admin/donaciones"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Donaciones
          </Link>
        </div>

        {/* Estadísticas del sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 rounded-full bg-opacity-20 bg-gray-200">
                  {stat.icon}
                </div>
                <span className="text-sm text-green-600 font-medium">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Estado del sistema */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Estado de servicios</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {systemHealth.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 ${service.color} rounded-full`}
                      ></div>
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-gray-500">
                          Uptime: {service.uptime}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        service.status === "online"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {service.status === "online" ? "En línea" : "Advertencia"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones de administrador */}
            <h2 className="text-xl font-semibold mt-6 mb-4">
              Acciones de administrador
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {adminActions.map((action, index) => (
                <Link
                  to={action.link}
                  key={index}
                  className={`${action.color} p-4 rounded-lg flex items-start gap-3 hover:opacity-95 transition-all`}
                >
                  <div className="text-xl mt-1">{action.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-500">
                      {action.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Alertas recientes */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Alertas recientes</h2>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-4">
                {recentAlerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        alert.type === "error"
                          ? "bg-red-100 text-red-600"
                          : alert.type === "warning"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <FaExclamationTriangle size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-400">{alert.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Registro de administrador */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold mb-3">Registro de administrador</h3>
              <Link
                to="/admin/registrarAdmin"
                className="block w-full text-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Registrar nuevo admin
              </Link>
            </div>
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Métricas del sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FaDatabase className="text-3xl text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">2.4 GB</p>
              <p className="text-sm text-gray-500">Uso de base de datos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FaServer className="text-3xl text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">45%</p>
              <p className="text-sm text-gray-500">Uso de CPU</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FaChartBar className="text-3xl text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">12.5k</p>
              <p className="text-sm text-gray-500">Requests/día</p>
            </div>
          </div>
        </div>
      </div>
    </AdministradorOnly>
  );
}
