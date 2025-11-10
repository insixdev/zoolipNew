import { ActionFunctionArgs } from "react-router";
import { editPetService } from "~/features/mascotas/petsService";
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

  // Solo administradores pueden actualizar mascotas
  if (role !== "ADMINISTRADOR") {
    return Response.json(
      {
        message: "No tienes permiso para actualizar mascotas",
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

    const pet = {
      id: Number(petId),
      size: formData.get("size"),
      adoptionState: formData.get("adoptionState"),
      healthState: formData.get("healthState"),
      age: Number(formData.get("age")),
      race: formData.get("race"),
      species: formData.get("species"),
      id_institution: {
        id_institucion: Number(formData.get("id_institution")),
      },
      name: formData.get("name"),
    };

    // Validar datos básicos
    if (
      !pet.size ||
      !pet.adoptionState ||
      !pet.healthState ||
      !pet.race ||
      !pet.species
    ) {
      return Response.json(
        {
          message: "Error al actualizar mascota, faltan datos requeridos",
          status: "error",
        },
        { status: 400 }
      );
    }

    const res = await editPetService(pet, cookie);

    if (!res) {
      return Response.json(
        {
          message: "Error al actualizar mascota",
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
    console.error("Update pet error:", err);
    return Response.json(
      {
        message: "Error al actualizar mascota",
        status: "error",
      },
      { status: 500 }
    );
  }
}
