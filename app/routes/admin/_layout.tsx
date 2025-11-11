import { Link, Outlet } from "react-router";
import { AnyAdminRole } from "~/components/auth/AdminGuard";
import { AdminSidebar } from "~/components/layout/admin/AdminSidebar";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { ADMIN_ROLES, type AdminRole } from "~/lib/constants";

export default function AdminLayout() {
  const { user } = useSmartAuth();

  // Obtener el rol de admin del usuario
  const adminRole = (user?.role as AdminRole) || ADMIN_ROLES.REFUGIO;

  return (
    <div className="min-h-screen bg-gray-50">
      <AnyAdminRole
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Acceso denegado
              </h1>
              <p className="text-gray-600">
                No tienes permisos para acceder a esta sección
              </p>
            <Link
              to="/community"
              // estilo que sea simple y que mantengga el tamañp
              className="inline-block px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
            >
            ir al inicio
            </Link>

            </div>
          </div>

        }
      >
        {/* Community Navbar */}
        <CommunityNavbar />

        {/* Sidebar with role-based navigation */}
        <AdminSidebar adminRole={adminRole} />

        {/* Main Content */}
        <div className="pl-64 pt-20">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </AnyAdminRole>
    </div>
  );
}
