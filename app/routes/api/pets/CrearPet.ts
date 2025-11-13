import type { ActionFunctionArgs } from "react-router";
import { addPetService } from "~/features/mascotas/petsService";
import { getInstitutionByIdUsuarioService } from "~/features/entities/institucion/institutionService";
import { requireAdmin } from "~/lib/roleGuards";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return Response.json(
      {
        message: "No autenticado",
        status: "error",
      },
      { status: 401 }
    );
  }

  try {
    // Verificar que sea admin
    await requireAdmin(request);

    // Obtener id_institucion del JWT payload
    const token = cookieHeader.split("AUTH_TOKEN=")[1]?.split(";")[0];
    if (!token) {
      return Response.json(
        {
          message: "Token no encontrado",
          status: "error",
        },
        { status: 401 }
      );
    }

    // Decodificar el token para obtener id_usuario
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload || !payload.id_usuario) {
      return Response.json(
        {
          message: "Token no válido",
          status: "error",
        },
        { status: 401 }
      );
    }

    // Obtener la institución del usuario
    const institutionData = await getInstitutionByIdUsuarioService(
      payload.id_usuario,
      cookieHeader
    );

    if (!institutionData || !institutionData.id_institucion) {
      return Response.json(
        {
          message: "No tienes una institución asociada",
          status: "error",
        },
        { status: 400 }
      );
    }

    // Preparar datos de la mascota
    const pet = {
      name: formData.get("nombre") as string,
      size: formData.get("tamanio") as string,
      adoptionState: "DISPONIBLE", // Por defecto
      healthState: "SALUDABLE", // Por defecto
      age: parseInt(formData.get("edad") as string),
      race: formData.get("raza") as string,
      species: formData.get("especie") as string,
      id_institution: {
        id_institucion: institutionData.id_institucion,
      },
    };

    // Validar datos
    if (!pet.name || !pet.size || !pet.age || !pet.race || !pet.species) {
      return Response.json(
        {
          message: "Faltan datos requeridos",
          status: "error",
        },
        { status: 400 }
      );
    }

    console.log("Creando mascota:", pet);

    // Llamar al servicio
    const res = await addPetService(pet, cookieHeader);

    return Response.json(
      {
        message: res.message || "Mascota creada exitosamente",
        status: res.status || "success",
      },
      { status: res.httpCode || 200 }
    );
  } catch (err) {
    console.error("Create pet error:", err);
    return Response.json(
      {
        message: err instanceof Error ? err.message : "Error al crear mascota",
        status: "error",
      },
      { status: 500 }
    );
  }
}
