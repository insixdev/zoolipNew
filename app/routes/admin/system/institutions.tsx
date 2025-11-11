import React from "react";
import { useLoaderData, type LoaderFunction } from "react-router";
import { AdministradorOnly } from "~/components/auth/AdminGuard";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const { getAllInstitutionsService } = await import(
      "~/features/entities/institucion/institutionService"
    );
    const data = await getAllInstitutionsService(cookie);
    return data;
  } catch (err) {
    console.error("Loader institutions error:", err);
    return [];
  }
};

export default function AdminInstitutionsPage() {
  const institutions = useLoaderData() as any[];

  return (
    <AdministradorOnly>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Instituciones</h1>
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
          {institutions.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No hay instituciones.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {institutions.map((inst: any) => (
                <div
                  key={inst.id_institucion || inst.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {inst.nombre || inst.nombre_institucion || "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {inst.tipo || inst.tipo_institucion || "-"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {inst.email || inst.correo || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdministradorOnly>
  );
}
