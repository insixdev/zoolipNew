import {
  AtencionCreateRequest,
  AtencionUpdateRequest,
  AtencionCompleteRequest,
  AtencionDeleteRequest,
  AtencionResponse,
  AtencionGetResponse,
  AtencionId,
} from "./types";

/** URL base del backend de atenciones */
const BASE_ATENCION_URL =
  process.env.BASE_ATENCION_URL || "http://localhost:3050/api/atencion/";

/**
 * Inicia una nueva atención veterinaria
 * @param atencion - Datos de la atención a iniciar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function startAtencionService(
  atencion: AtencionCreateRequest,
  cookie: string
): Promise<AtencionResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_ATENCION_URL}empezar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(atencion),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al iniciar atención");
    }

    return data;
  } catch (err) {
    console.error("Start atencion error:", err);
    throw err;
  }
}

/**
 * Actualiza una atención existente
 * @param atencion - Datos actualizados de la atención (debe incluir id compuesto)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function updateAtencionService(
  atencion: AtencionUpdateRequest,
  cookie: string
): Promise<AtencionResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_ATENCION_URL}actualizar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(atencion),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar atención");
    }

    return data;
  } catch (err) {
    console.error("Update atencion error:", err);
    throw err;
  }
}

/**
 * Completa una atención veterinaria
 * @param atencion - Datos para completar la atención (debe incluir id compuesto y fecha_final)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function completeAtencionService(
  atencion: AtencionCompleteRequest,
  cookie: string
): Promise<AtencionResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_ATENCION_URL}completar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(atencion),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al completar atención");
    }

    return data;
  } catch (err) {
    console.error("Complete atencion error:", err);
    throw err;
  }
}

/**
 * Elimina una atención del sistema
 * @param atencionId - ID compuesto de la atención a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deleteAtencionService(
  atencionId: AtencionId,
  cookie: string
): Promise<AtencionResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_ATENCION_URL}eliminar`, {
      method: "DELETE",
      headers: hd,
      body: JSON.stringify({ id: atencionId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar atención");
    }

    return data;
  } catch (err) {
    console.error("Delete atencion error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de una atención por su ID compuesto
 * @param atencionId - ID compuesto de la atención a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos de la atención
 * @throws Error si falla la petición o no se encuentra la atención
 */
export async function getAtencionByIdService(
  atencionId: AtencionId,
  cookie: string
): Promise<AtencionGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_ATENCION_URL}obtenerPorId`, {
      method: "GET",
      headers: hd,
      body: JSON.stringify(atencionId),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener atención");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get atencion by id error:", err);
    throw err;
  }
}

/**
 * Obtiene todas las atenciones registradas en el sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de atenciones
 * @throws Error si falla la petición
 */
export async function getAllAtencionesService(
  cookie: string
): Promise<AtencionGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_ATENCION_URL}obtenerTodas`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener atenciones");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all atenciones error:", err);
    throw err;
  }
}
