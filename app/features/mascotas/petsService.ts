import {
  PetRequest,
  PetResponse,
  PetUpdateRequest,
  PetGetByResponse,
} from "./types";

/** URL base del backend de mascotas */
const BASE_PETS_URL =
  process.env.BASE_PETS_URL || "http://localhost:3050/api/mascotas/";

/**
 * Añade una nueva mascota al sistema
 * @param pet - Datos de la mascota a añadir
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function addPetService(
  pet: PetRequest,
  cookie: string
): Promise<PetResponse> {
  try {
    // Transformación de nombres para el backend (camelCase → snake_case)
    const body = {
      tamanio: pet.size,
      estadoAdopcion: pet.adoptionState,
      estadoSalud: pet.healthState,
      edad: pet.age,
      raza: pet.race,
      especie: pet.species,
      id_institucion: pet.id_institution,
      nombre: pet.name,
    };

    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PETS_URL}aniadir`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage =
        data.error || data.message || "Error al añadir mascota";
      const error = new Error(errorMessage);
      (error as any).data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Add pet error:", err);
    throw err;
  }
}

/**
 * Elimina una mascota del sistema
 * @param id - ID de la mascota a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deletePetService(
  id: string,
  cookie: string
): Promise<PetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PETS_URL}eliminar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify({ id: parseInt(id) }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage =
        data.error || data.message || "Error al eliminar mascota";
      const error = new Error(errorMessage);
      (error as any).data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Delete pet error:", err);
    throw err;
  }
}

/**
 * Actualiza los datos de una mascota existente
 * @param pet - Datos actualizados de la mascota (debe incluir id)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function editPetService(
  pet: PetUpdateRequest,
  cookie: string
): Promise<PetResponse> {
  try {
    const body = {
      id: pet.id,
      tamanio: pet.size,
      estadoAdopcion: pet.adoptionState,
      estadoSalud: pet.healthState,
      edad: pet.age,
      raza: pet.race,
      especie: pet.species,
      id_institucion: pet.id_institution,
      nombre: pet.name,
    };

    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PETS_URL}actualizar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar mascota");
    }

    return data;
  } catch (err) {
    console.error("Edit pet error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de una mascota por su ID
 * @param id - ID de la mascota a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos de la mascota
 * @throws Error si falla la petición o no se encuentra la mascota
 */
export async function getPetByIdService(
  id: string,
  cookie: string
): Promise<PetGetByResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PETS_URL}obtenerPorId?id=${id}`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener mascota");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get pet by id error:", err);
    throw err;
  }
}

/**
 * Obtiene todas las mascotas registradas en el sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de mascotas
 * @throws Error si falla la petición
 */
export async function getAllPetsService(
  cookie: string
): Promise<PetGetByResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_PETS_URL}obtenerTodas`, {
      method: "GET",
      headers: hd,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Get all pets error:", data);
      // Propagar el error con el mensaje del backend
      const errorMessage =
        data.error || data.message || "Error al obtener mascotas";
      const error = new Error(errorMessage);
      (error as any).data = data; // Guardar data completa para debugging
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Get all pets error:", err);
    throw err;
  }
}
