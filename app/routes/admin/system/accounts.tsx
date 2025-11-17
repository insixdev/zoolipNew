import React, { useState } from "react";
import { useLoaderData, type LoaderFunctionArgs, Link } from "react-router";
import { AdministradorOnly } from "~/components/auth/AdminGuard";
import { requireAdmin } from "~/lib/roleGuards";
import { Search, Shield, Mail, Calendar, User } from "lucide-react";

// Tipo para cuentas (información de autenticación)
interface AccountInfo {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  fechaCreacion?: string;
  ultimoAcceso?: string;
  estado: "activo" | "inactivo" | "bloqueado";
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    console.log("[ADMIN ACCOUNTS] Loading accounts...");

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const url = "http://localhost:3050/api/auth/accounts";

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (response.status === 204 || response.status === 404) {
      console.log("[ADMIN ACCOUNTS] No accounts found");
      return { accounts: [] };
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const accounts: AccountInfo[] = await response.json();
    console.log("[ADMIN ACCOUNTS] Accounts loaded:", accounts.length);

    // Mapear los datos del backend al formato esperado
    const mappedAccounts = accounts.map((account) => ({
      ...account,
      estado: account.estado || "activo",
    }));

    return { accounts: mappedAccounts };
  } catch (error) {
    console.error("[ADMIN ACCOUNTS] Error loading accounts:", error);
    return { accounts: [] };
  }
}

export default function AdminAccountsPage() {
  const { accounts } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800";
      case "inactivo":
        return "bg-gray-100 text-gray-800";
      case "bloqueado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    const rolUpper = rol?.toUpperCase();
    switch (rolUpper) {
      case "ROLE_ADMINISTRADOR":
      case "ROLE_SYSTEM":
        return "bg-purple-100 text-purple-800";
      case "ROLE_REFUGIO":
        return "bg-green-100 text-green-800";
      case "ROLE_VETERINARIA":
        return "bg-blue-100 text-blue-800";
      case "ROLE_ADOPTANTE":
        return "bg-orange-100 text-orange-800";
      case "ROLE_USER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRoleName = (rol: string) => {
    return rol?.replace("ROLE_", "") || "N/A";
  };

  const filteredAccounts = accounts.filter((account) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      account.nombre?.toLowerCase().includes(searchLower) ||
      account.email?.toLowerCase().includes(searchLower) ||
      account.rol?.toLowerCase().includes(searchLower) ||
      account.id?.toString().includes(searchLower)
    );
  });

  return (
    <AdministradorOnly>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Gestión de Cuentas
              </h1>
              <p className="text-gray-600 mt-1">
                Administra las cuentas de autenticación y acceso al sistema
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/admin/system"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Volver
              </Link>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nombre, email, rol o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
            </div>
            <div className="bg-rose-50 px-4 py-2 rounded-lg border border-rose-200">
              <span className="text-rose-700 font-semibold">
                {filteredAccounts.length} cuenta
                {filteredAccounts.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Activas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {accounts.filter((a) => a.estado === "activo").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inactivas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {accounts.filter((a) => a.estado === "inactivo").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bloqueadas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {accounts.filter((a) => a.estado === "bloqueado").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {accounts.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredAccounts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600 text-lg">
                {searchTerm
                  ? "No se encontraron cuentas"
                  : "No hay cuentas registradas"}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Las cuentas aparecerán aquí cuando se conecte con el backend
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último acceso
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{account.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <div className="text-sm text-gray-900">
                            {account.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {account.nombre || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(account.rol)}`}
                        >
                          {formatRoleName(account.rol)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(account.estado)}`}
                        >
                          {account.estado.charAt(0).toUpperCase() +
                            account.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          {account.ultimoAcceso || "Nunca"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Nota:</strong> Esta sección muestra las cuentas de
            autenticación del sistema. Para ver información completa de
            usuarios, visita la sección de{" "}
            <Link
              to="/admin/system/users"
              className="underline font-semibold hover:text-blue-900"
            >
              Usuarios
            </Link>
            .
          </p>
        </div>
      </div>
    </AdministradorOnly>
  );
}
