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

    // Obtener el ID del usuario actual del token
    const userId = getUserFieldFromCookie(cookie, field.ID);
    console.log("[UPDATE PET] ID de usuario:", userId);

    if (!userId) {
      return Response.json(
        {
          message: "No se pudo obtener el ID del usuario",
          status: "error",
        },
        { status: 401 }
      );
    }

    // Obtener el ID de la institución del usuario actual
    const { getInstitutionByIdUsuarioService } = await import(
      "~/features/entities/institucion/institutionService"
    );

    let institutionId;
    try {
      const institution = await getInstitutionByIdUsuarioService(
        Number(userId),
        cookie
      );
      institutionId = institution.id_institucion;
      console.log("[UPDATE PET] ID de institución obtenido:", institutionId);
    } catch (error) {
      console.error("[UPDATE PET] Error obteniendo institución:", error);
      return Response.json(
        {
          message: "Institución no encontrada para el usuario actual",
          status: "error",
        },
        { status: 404 }
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
        id_institucion: institutionId,
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
