interface Solicitud {
  status: string;
}

interface EstadisticasSolicitudesProps {
  solicitudes: Solicitud[];
}

export function EstadisticasSolicitudes({
  solicitudes,
}: EstadisticasSolicitudesProps) {
  const aprobadas = solicitudes.filter((s) => s.status === "approved").length;
  const enProceso = solicitudes.filter(
    (s) => s.status === "pending" || s.status === "interview"
  ).length;
  const rechazadas = solicitudes.filter((s) => s.status === "rejected").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {solicitudes.length}
        </div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-2xl font-bold text-green-600 mb-1">
          {aprobadas}
        </div>
        <div className="text-sm text-gray-600">Aprobadas</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-2xl font-bold text-yellow-600 mb-1">
          {enProceso}
        </div>
        <div className="text-sm text-gray-600">En proceso</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-2xl font-bold text-red-600 mb-1">{rechazadas}</div>
        <div className="text-sm text-gray-600">Rechazadas</div>
      </div>
    </div>
  );
}
