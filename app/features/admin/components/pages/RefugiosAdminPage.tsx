import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { RefugioAdminCard, type RefugioAdmin } from "../cards";

// Datos de ejemplo
const refugiosData: RefugioAdmin[] = [
  {
    id: "1",
    name: "Refugio Esperanza Animal",
    description:
      "Dedicados al rescate y rehabilitación de perros y gatos abandonados. Más de 15 años ayudando a encontrar hogares amorosos.",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=300&fit=crop",
    logo: "https://i.pravatar.cc/100?img=50",
    location: "Ciudad de México",
    address: "Av. Insurgentes Sur 1234, Col. Del Valle",
    phone: "+52 55 1234-5678",
    email: "contacto@esperanzaanimal.org",
    website: "https://esperanzaanimal.org",
    established: "2008",
    animalsRescued: 2847,
    adoptionsCompleted: 2156,
    currentAnimals: 89,
    specialties: ["Perros", "Gatos", "Rehabilitación", "Cirugías"],
    workingHours: "Lun-Dom 9:00-18:00",
    verified: true,
    status: "active",
    lastActivity: "Hace 2 horas",
    totalReports: 0,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Patitas Felices A.C.",
    description:
      "Organización sin fines de lucro enfocada en el rescate de cachorros y gatitos huérfanos.",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=300&fit=crop",
    logo: "https://i.pravatar.cc/100?img=51",
    location: "Guadalajara",
    address: "Calle Libertad 567, Col. Americana",
    phone: "+52 33 9876-5432",
    email: "info@patitasfelices.mx",
    website: "https://patitasfelices.mx",
    established: "2012",
    animalsRescued: 1523,
    adoptionsCompleted: 1287,
    currentAnimals: 45,
    specialties: ["Cachorros", "Gatitos", "Cuidados intensivos"],
    workingHours: "Mar-Dom 10:00-17:00",
    verified: false,
    status: "pending",
    lastActivity: "Hace 1 día",
    totalReports: 2,
    rating: 4.2,
  },
];

export default function RefugiosAdminPage() {
  const [refugios, setRefugios] = useState(refugiosData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRefugios = refugios.filter((refugio) => {
    const matchesSearch =
      refugio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refugio.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || refugio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (refugioId: string) => {
    console.log(`Ver refugio ${refugioId}`);
  };

  const handleEdit = (refugioId: string) => {
    console.log(`Editar refugio ${refugioId}`);
  };

  const handleDelete = (refugioId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este refugio?")) {
      setRefugios(refugios.filter((r) => r.id !== refugioId));
    }
  };

  const handleToggleStatus = (refugioId: string) => {
    setRefugios(
      refugios.map((refugio) =>
        refugio.id === refugioId
          ? {
              ...refugio,
              status: refugio.status === "active" ? "suspended" : "active",
            }
          : refugio
      )
    );
  };

  const handleVerify = (refugioId: string) => {
    setRefugios(
      refugios.map((refugio) =>
        refugio.id === refugioId
          ? { ...refugio, verified: true, status: "active" }
          : refugio
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Refugios
          </h1>
          <p className="text-gray-600">
            Administra los refugios registrados en la plataforma
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Agregar Refugio
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar refugios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="pending">Pendientes</option>
            <option value="suspended">Suspendidos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Más filtros
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {refugios.length}
          </div>
          <div className="text-sm text-gray-600">Total Refugios</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {refugios.filter((r) => r.status === "active").length}
          </div>
          <div className="text-sm text-gray-600">Activos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {refugios.filter((r) => r.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {refugios.filter((r) => r.totalReports > 0).length}
          </div>
          <div className="text-sm text-gray-600">Con Reportes</div>
        </div>
      </div>

      {/* Grid de Refugios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRefugios.map((refugio) => (
          <RefugioAdminCard
            key={refugio.id}
            refugio={refugio}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onVerify={handleVerify}
          />
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredRefugios.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron refugios
          </h3>
          <p className="text-gray-600">
            Intenta ajustar tus filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
