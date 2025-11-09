import { OrganizacionRoles } from "~/components/auth/AdminGuard";
import { ADMIN_ROLES } from "~/lib/constants";

export default function AdminSolicitudes() {
  return (
    <OrganizacionRoles
      fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes acceso a esta sección</p>
        </div>
      }
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Solicitudes de Adopción
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Gestión de solicitudes de adopción</p>
          {/* Contenido de solicitudes */}
        </div>
      </div>
    </OrganizacionRoles>
  );
}
