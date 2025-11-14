import React, { useState } from "react";
import {
  useLoaderData,
  useFetcher,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { AdministradorOnly } from "~/components/auth/AdminGuard";
import {
  getAllUsersService,
  type UsuarioDTO,
} from "~/features/user/userService";
import { requireAdmin } from "~/lib/roleGuards";
import { Search, UserPlus, Edit, Trash2, Shield } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    console.log("👥 [ADMIN USERS] Loading users...");
    const users = await getAllUsersService(cookie);
    console.log("👥 [ADMIN USERS] Users loaded:", users.length);
    return { users };
  } catch (error) {
    console.error("👥 [ADMIN USERS] Error loading users:", error);
    return { users: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const cookie = request.headers.get("Cookie") || "";

  try {
    const formData = await request.formData();
    const action = formData.get("_action");

    // Aquí puedes agregar acciones como eliminar, actualizar, etc.
    console.log("👥 [ADMIN USERS] Action:", action);

    return { success: true };
  } catch (error: any) {
    console.error("👥 [ADMIN USERS] Error:", error);
    return { success: false, error: error.message };
  }
}

export default function AdminUsersPage() {
  const { users } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.nombre?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.rol?.toLowerCase().includes(searchLower) ||
      user.id?.toString().includes(searchLower)
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
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 mt-1">
                Administra todos los usuarios del sistema
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Volver
              </button>
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
                {filteredUsers.length} usuario
                {filteredUsers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600 text-lg">
                {searchTerm
                  ? "No se encontraron usuarios"
                  : "No hay usuarios registrados"}
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
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{user.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.nombre || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.email || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.rol)}`}
                        >
                          {formatRoleName(user.rol)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info */}
        {users.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Nota:</strong> Mostrando todos los usuarios del
              sistema. Los roles determinan los permisos y accesos de cada
              usuario.
            </p>
          </div>
        )}
      </div>
    </AdministradorOnly>
  );
}
