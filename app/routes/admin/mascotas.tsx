import { Link } from "react-router";
import { AnyAdminRole } from "~/components/auth/AdminGuard";
import { FaPlus } from "react-icons/fa";

export default function AdminMascotas() {
  return (
    <AnyAdminRole
      fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes acceso a esta sección</p>
        </div>
      }
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mascotas</h1>
          <Link
            to="/admin/crearMascota"
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <FaPlus />
            <span>Agregar mascota</span>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Gestión de mascotas en el sistema</p>
          {/* Contenido de mascotas */}
        </div>
      </div>
    </AnyAdminRole>
  );
}
