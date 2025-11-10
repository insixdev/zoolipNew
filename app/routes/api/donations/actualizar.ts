import { ActionFunctionArgs } from "react-router";
import { updateDonationService } from "~/features/donacion/donationService";
import {
  DonationUpdateRequest,
  DonationStatus,
} from "~/features/donacion/types";
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

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const donationValidation = donationUpdateValidation(data);

  if (!donationValidation.donation) {
    return Response.json(
      {
        status: donationValidation.status,
        message: donationValidation.message,
      },
      { status: 400 }
    );
  }

  console.log("donationValidation", donationValidation);

  const donationRequest = {
    id_donacion: donationValidation.donation.id_donacion,
    status: donationValidation.donation.status,
    monto: donationValidation.donation.monto,
  } as DonationUpdateRequest;

  const donationRes = await updateDonationService(donationRequest, cookie!);

  console.log("Update donation response:", donationRes);

  return Response.json(
    { status: "success", message: "Donación actualizada con éxito" },
    { status: donationRes.httpCode }
  );
}

function donationUpdateValidation(data: any) {
  if (!data) {
    return {
      status: "error",
      message: "Unexpected error, no hay datos",
    };
  }

  try {
    const donationData = {
      id_donacion: Number(data.id_donacion),
      status: data.status as DonationStatus,
      monto: Number(data.monto),
    };

    if (!donationData.id_donacion) {
      return {
        status: "error",
        message: "El ID de la donación es requerido",
      };
    }

    if (!donationData.status) {
      return {
        status: "error",
        message: "El estado de la donación es requerido",
      };
    }

    if (!donationData.monto || donationData.monto <= 0) {
      return {
        status: "error",
        message: "El monto debe ser mayor a 0",
      };
    }

    return {
      status: "success",
      message: "Donación validada con éxito",
      donation: donationData,
    };
  } catch (err) {
    return {
      status: "error",
      message: `Error en procesar los datos de la donación, error: ${err}`,
    };
  }
}
