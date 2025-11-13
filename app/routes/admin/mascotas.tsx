import { Link, useLoaderData, useFetcher, useRevalidator } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { AnyAdminRole } from "~/components/auth/AdminGuard";
import { FaPlus, FaPaw, FaEdit, FaTrash } from "react-icons/fa";
import { requireAdmin } from "~/lib/roleGuards";
import { PetGetByResponse } from "~/features/mascotas/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/AlertDialog";
import { useState, useEffect } from "react";

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  tamanio: string;
  estadoAdopcion: string;
  estadoSalud: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return { mascotas: [] };
  }

  try {
    const { getAllPetsService } = await import(
      "~/features/mascotas/petsService"
    );
    const { isTokenError, handleTokenError } = await import(
      "~/lib/tokenErrorHandler"
    );

    const mascotas = await getAllPetsService(cookieHeader);
    console.log("Mascotas obtenidas:", mascotas);
    return { mascotas };
  } catch (error) {
    console.error("Error obteniendo mascotas:", error);

    const { isTokenError, handleTokenError } = await import(
      "~/lib/tokenErrorHandler"
    );

    if (isTokenError(error)) {
      return handleTokenError();
    }

    return { mascotas: [] };
  }
}

export default function AdminMascotas() {
  const { mascotas } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  mascotas as PetGetByResponse[];

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      revalidator.revalidate();
    }
  }, [fetcher.state, fetcher.data, revalidator]);

  const handleDelete = (id: number) => {
    fetcher.submit(
      {},
      {
        method: "post",
        action: `/admin/api/pets/eliminar/${id}`,
      }
    );
    setDeletingId(null);
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      DISPONIBLE: "bg-green-100 text-green-800",
      EN_PROCESO: "bg-yellow-100 text-yellow-800",
      ADOPTADO: "bg-blue-100 text-blue-800",
      SALUDABLE: "bg-green-100 text-green-800",
      ENFERMO: "bg-red-100 text-red-800",
      CONVALECIENTE: "bg-yellow-100 text-yellow-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getTamanioLabel = (tamanio: string) => {
    const labels = {
      PEQUENIO: "Pequeño",
      MEDIANO: "Mediano",
      GRANDE: "Grande",
    };
    return labels[tamanio] || tamanio;
  };

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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mascotas</h1>
            <p className="text-gray-600 mt-1">
              {mascotas.length} mascota(s) registrada(s)
            </p>
          </div>
          <Link
            to="/admin/crearMascota"
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <FaPlus />
            <span>Agregar mascota</span>
          </Link>
        </div>

        {mascotas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaPaw className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay mascotas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando tu primera mascota al sistema
            </p>
            <Link
              to="/admin/crearMascota"
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              <FaPlus />
              <span>Agregar primera mascota</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotas.map((mascota) => (
              <div
                key={mascota.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Imagen placeholder */}
                <div className="h-48 bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                  <FaPaw className="h-20 w-20 text-rose-400" />
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {mascota?.nombre}
                    </h3>
                    <span className="text-sm text-gray-500">
                      #{mascota.id_Mascota}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Especie:</span>{" "}
                      {mascota.especie}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Raza:</span> {mascota.raza}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Edad:</span> {mascota.edad}{" "}
                      año(s)
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tamaño:</span>{" "}
                      {getTamanioLabel(mascota.tamanio)}
                    </p>
                  </div>

                  {/* Estados */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        mascota.estadoAdopcion
                      )}`}
                    >
                      {mascota.estadoAdopcion}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        mascota.estadoSalud
                      )}`}
                    >
                      {mascota.estadoSalud}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/editarMascota/${mascota.id_Mascota}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <FaEdit />
                      <span>Editar</span>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm">
                          <FaTrash />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás seguro de eliminar esta mascota?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará
                            permanentemente a {mascota.nombre} del sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(mascota.id_Mascota)}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-400"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnyAdminRole>
  );
}
