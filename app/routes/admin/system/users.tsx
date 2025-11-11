import React from "react";
import { useLoaderData, type LoaderFunction } from "react-router";
import { AdministradorOnly } from "~/components/auth/AdminGuard";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const { getAllUsersService } = await import("~/features/user/userService");
    const data = await getAllUsersService(cookie);
    return data;
  } catch (err) {
    console.error("Loader users error:", err);
    return [];
  }
};

export default function AdminUsersPage() {
  const users = useLoaderData() as any[];

  return (
    <AdministradorOnly>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.history.back()}
              className="px-3 py-2 bg-gray-100 rounded-md"
            >
              ← Volver
            </button>
            <a
              href="/admin/system"
              className="px-3 py-2 bg-rose-600 text-white rounded-md"
            >
              Ir a Sistema
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No hay usuarios.
            </div>
          ) : (
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">Nombre</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id || u.id_usuario || u._id} className="border-t">
                    <td className="py-3 text-sm text-gray-700">
                      {u.id || u.id_usuario || u._id}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {u.nombre || u.name || u.fullName || "-"}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {u.email || u.correo || "-"}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {u.rol || u.role || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdministradorOnly>
  );
}
