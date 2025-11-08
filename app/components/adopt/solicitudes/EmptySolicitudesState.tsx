import { FileText } from "lucide-react";
import { Link } from "react-router";

export function EmptySolicitudesState() {
  return (
    <div className="text-center py-16">
      <FileText className="mx-auto text-gray-400 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No tienes solicitudes de adopción
      </h3>
      <p className="text-gray-600 mb-6">
        Cuando envíes una solicitud de adopción, aparecerá aquí para que puedas
        hacer seguimiento.
      </p>
      <Link
        to="/adopt"
        className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Explorar mascotas
      </Link>
    </div>
  );
}
