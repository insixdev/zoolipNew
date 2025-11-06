import {
  DonationCreateRequest,
  DonationUpdateRequest,
  DonationResponse,
  DonationGetResponse,
} from "./types";

/** URL base del backend de donaciones */
const BASE_DONATION_URL =
  process.env.BASE_DONATION_URL || "http://localhost:3050/api/donacion/";

/**
 * Crea una nueva donación en el sistema
 * @param donation - Datos de la donación a crear
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function createDonationService(
  donation: DonationCreateRequest,
  cookie: string
): Promise<DonationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_DONATION_URL}crear`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(donation),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al crear donación");
    }

    return data;
  } catch (err) {
    console.error("Create donation error:", err);
    throw err;
  }
}

/**
 * Actualiza una donación existente
 * @param donation - Datos actualizados de la donación (debe incluir id_donacion)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function updateDonationService(
  donation: DonationUpdateRequest,
  cookie: string
): Promise<DonationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_DONATION_URL}actualizar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(donation),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar donación");
    }

    return data;
  } catch (err) {
    console.error("Update donation error:", err);
    throw err;
  }
}

/**
 * Elimina una donación del sistema
 * @param id - ID de la donación a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deleteDonationService(
  id: number,
  cookie: string
): Promise<DonationResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_DONATION_URL}eliminar`, {
      method: "DELETE",
      headers: hd,
      body: JSON.stringify(id),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar donación");
    }

    return data;
  } catch (err) {
    console.error("Delete donation error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de una donación por su ID
 * @param id - ID de la donación a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos de la donación
 * @throws Error si falla la petición o no se encuentra la donación
 */
export async function getDonationByIdService(
  id: number,
  cookie: string
): Promise<DonationGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_DONATION_URL}obtenerPorId?id=${id}`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener donación");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get donation by id error:", err);
    throw err;
  }
}

/**
 * Obtiene todas las donaciones registradas en el sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de donaciones
 * @throws Error si falla la petición
 */
export async function getAllDonationsService(
  cookie: string
): Promise<DonationGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_DONATION_URL}obtenerTodas`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener donaciones");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all donations error:", err);
    throw err;
  }
}
