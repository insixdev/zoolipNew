import { ActionFunctionArgs } from "react-router";
import { deleteDonationService } from "~/features/donacion/donationService";
import { field, getUserFieldFromCookie } from "~/lib/authUtil";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("Cookie");
  const userIdFromCookie = getUserFieldFromCookie(cookie, field.id);

  if (!userIdFromCookie) {
    return Response.json(
      {
        status: "error",
        message: "Usuario no autenticado",
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const id_donacion = formData.get("id_donacion");

    if (!id_donacion) {
      return Response.json(
        {
          status: "error",
          message: "El ID de la donación es requerido",
        },
        { status: 400 }
      );
    }

    const donacionId = Number(id_donacion);

    if (isNaN(donacionId)) {
      return Response.json(
        {
          status: "error",
          message: "El ID de la donación debe ser un número válido",
        },
        { status: 400 }
      );
    }

    console.log("Eliminando donación:", donacionId);

    const donationRes = await deleteDonationService(donacionId, cookie!);

    console.log("Delete donation response:", donationRes);

    return Response.json(
      { status: "success", message: "Donación eliminada con éxito" },
      { status: donationRes.httpCode }
    );
  } catch (err) {
    console.error("Error al eliminar donación:", err);
    return Response.json(
      {
        status: "error",
        message: `Error al eliminar la donación: ${err}`,
      },
      { status: 500 }
    );
  }
}
