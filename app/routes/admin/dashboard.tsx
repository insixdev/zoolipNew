import { Link } from "react-router";
import {
  FaPaw,
  FaUsers,
  FaClinicMedical,
  FaDog,
  FaCalendarAlt,
  FaChartLine,
  FaUserMd,
  FaHeart,
} from "react-icons/fa";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { ADMIN_ROLES, type AdminRole } from "~/lib/constants";

export default function AdminDashboard() {
  const { user } = useSmartAuth();
  const adminRole = user?.tipo as AdminRole;

  // Estadísticas según el rol
  const getStats = () => {
    const baseStats = [
      {
        title: "Mascotas en adopción",
        value: "24",
        icon: <FaPaw className="text-blue-500 text-2xl" />,
        link: "/admin/mascotas",
      },
      {
        title: "Donaciones recibidas",
        value: "$2,450",
        icon: <FaHeart className="text-rose-500 text-2xl" />,
        link: "/admin/donaciones",
      },
    ];

    if (adminRole === ADMIN_ROLES.VETERINARIO) {
      return [
        ...baseStats,
        {
          title: "Citas programadas",
          value: "8",
          icon: <FaCalendarAlt className="text-yellow-500 text-2xl" />,
          link: "/admin/atencion",
        },
        {
          title: "Atenciones del mes",
          value: "45",
          icon: <FaUserMd className="text-purple-500 text-2xl" />,
          link: "/admin/atencion",
        },
      ];
    }

    return [
      ...baseStats,
      {
        title: "Solicitudes pendientes",
        value: "12",
        icon: <FaUsers className="text-green-500 text-2xl" />,
        link: "/admin/solicitudes",
      },
      {
        title: "Adopciones del mes",
        value: "7",
        icon: <FaDog className="text-purple-500 text-2xl" />,
        link: "/admin/solicitudes",
      },
    ];
  };

  // Acciones rápidas según el rol
  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Agregar mascota",
        icon: <FaDog />,
        link: "/admin/crearMascota",
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Ver donaciones",
        icon: <FaHeart />,
        link: "/admin/donaciones",
        color: "bg-rose-100 text-rose-600",
      },
    ];

    if (adminRole === ADMIN_ROLES.VETERINARIO) {
      return [
        ...baseActions,
        {
          title: "Atención médica",
          icon: <FaUserMd />,
          link: "/admin/atencion",
          color: "bg-purple-100 text-purple-600",
        },
        {
          title: "Ver reportes",
          icon: <FaChartLine />,
          link: "/admin/reportes",
          color: "bg-yellow-100 text-yellow-600",
        },
      ];
    }

    return [
      ...baseActions,
      {
        title: "Ver solicitudes",
        icon: <FaUsers />,
        link: "/admin/solicitudes",
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Ver reportes",
        icon: <FaChartLine />,
        link: "/admin/reportes",
        color: "bg-yellow-100 text-yellow-600",
      },
    ];
  };

  const stats = getStats();
  const quickActions = getQuickActions();

  const recentActivity = [
    {
      id: 1,
      user: "María González",
      action: "adoptó a Max",
      time: "Hace 2 horas",
      type: "adopción",
    },
    {
      id: 2,
      user: "Refugio Patitas",
      action: "agregó 3 nuevos perros",
      time: "Hace 5 horas",
      type: "refugio",
    },
    {
      id: 3,
      user: "Dr. Carlos Ruiz",
      action: "actualizó historial médico",
      time: "Ayer",
      type: "veterinaria",
    },
  ];

  const getRoleTitle = () => {
    switch (adminRole) {
      case ADMIN_ROLES.VETERINARIO:
        return "Panel de Veterinaria";
      case ADMIN_ROLES.PROTECTORA:
        return "Panel de Protectora";
      case ADMIN_ROLES.REFUGIO:
        return "Panel de Refugio";
      default:
        return "Panel de Administración";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {getRoleTitle()}
      </h1>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            to={stat.link}
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full bg-opacity-20 bg-gray-200">
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Acciones rápidas */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                to={action.link}
                key={index}
                className={`${action.color} p-4 rounded-lg flex items-center space-x-3 hover:opacity-90 transition-opacity`}
              >
                <span className="text-xl">{action.icon}</span>
                <span className="font-medium">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Actividad reciente</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "adopción"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "refugio"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {activity.type === "adopción" ? (
                      <FaDog />
                    ) : activity.type === "refugio" ? (
                      <FaClinicMedical />
                    ) : (
                      <FaUserMd />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {activity.user}{" "}
                      <span className="text-gray-500">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sección de mascotas recientes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mascotas recientes</h2>
          <Link
            to="/admin/mascotas"
            className="text-rose-600 hover:underline text-sm"
          >
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((pet) => (
            <div
              key={pet}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <FaPaw className="text-4xl text-gray-400" />
              </div>
              <div className="p-3">
                <h3 className="font-medium">Mascota {pet}</h3>
                <p className="text-sm text-gray-500">
                  {adminRole === ADMIN_ROLES.VETERINARIO
                    ? "En tratamiento"
                    : "En adopción"}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {adminRole === ADMIN_ROLES.VETERINARIO
                      ? "Activo"
                      : "Disponible"}
                  </span>
                  <button className="text-xs text-rose-600 hover:underline">
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
