import { AnyAdminRole } from "~/components/auth/AdminGuard";

export default function AdminDonaciones() {
  return (
    <AnyAdminRole
      fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes acceso a esta sección</p>
        </div>
      }
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Donaciones</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Gestión de donaciones recibidas</p>
          {/* Contenido de donaciones */}
        </div>
      </div>
    </AnyAdminRole>
  );
}
