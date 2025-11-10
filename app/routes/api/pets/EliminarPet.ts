import { ActionFunctionArgs } from "react-router";
import { deletePetService } from "~/features/mascotas/petsService";
import { field, getUserFieldFromCookie } from "~/lib/authUtil";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      {
        message: "No hay cookie de autenticación",
        status: "error",
      },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const role = formData.get("role");

  // Solo administradores pueden eliminar mascotas
  if (role !== "ADMINISTRADOR") {
    return Response.json(
      {
        message: "No tienes permiso para eliminar mascotas",
        status: "error",
      },
      { status: 403 }
    );
  }

  try {
    const petId = formData.get("id");

    if (!petId) {
      return Response.json(
        {
          message: "El ID de la mascota es requerido",
          status: "error",
        },
        { status: 400 }
      );
    }

    console.log("Eliminando mascota:", petId);

    const res = await deletePetService(petId as string, cookie);

    if (!res) {
      return Response.json(
        {
          message: "Error al eliminar mascota",
          status: "error",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: res.message,
        status: res.status,
      },
      { status: res.httpCode }
    );
  } catch (err) {
    console.error("Delete pet error:", err);
    return Response.json(
      {
        message: "Error al eliminar mascota",
        status: "error",
      },
      { status: 500 }
    );
  }
}
