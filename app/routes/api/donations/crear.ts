import { ActionFunctionArgs } from "react-router";
import { createDonationService } from "~/features/donacion/donationService";
import {
  DonationCreateRequest,
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

  const donationValidation = donationCreateValidation(data, userIdFromCookie);

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
    id_usuario: {
      id: Number(userIdFromCookie),
    },
    id_institucion: {
      id_institucion: donationValidation.donation.id_institucion,
    },
    monto: donationValidation.donation.monto,
    status: donationValidation.donation.status,
    fecha_inicio: new Date().toISOString(),
  } as DonationCreateRequest;

  const donationRes = await createDonationService(donationRequest, cookie!);

  console.log("Create donation response:", donationRes);

  return Response.json(
    { status: "success", message: "Donación creada con éxito" },
    { status: donationRes.httpCode }
  );
}

function donationCreateValidation(data: any, userId: string) {
  if (!data) {
    return {
      status: "error",
      message: "Unexpected error, no hay datos",
    };
  }

  try {
    const donationData = {
      id_institucion: Number(data.id_institucion),
      monto: Number(data.monto),
      status: (data.status as DonationStatus) || DonationStatus.pending,
    };

    if (!donationData.id_institucion) {
      return {
        status: "error",
        message: "El ID de la institución es requerido",
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
