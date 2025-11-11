import {
  InstitutionSolicitudCreateRequest,
  InstitutionSolicitudUpdateRequest,
  InstitutionSolicitudResponse,
  InstitutionSolicitudGetResponse,
} from "./types";

/** URL base del backend para solicitudes de institución */
const BASE_SOLICITUD_URL =
  process.env.BASE_INSTITUTION_URL || "http://localhost:3050/api/institucion/";

/**
 * Crea una nueva solicitud de institución
 * @param solicitud - Datos de la solicitud (nombre_institucion, tipo, email_contacto, telefono_contacto, razon_solicitud)
 * @param cookie - Cookie de autenticación (opcional si es pública)
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function createInstitutionSolicitudService(
  solicitud: InstitutionSolicitudCreateRequest,
  cookie?: string
): Promise<InstitutionSolicitudResponse> {
  try {
    console.log("solicitud:", JSON.stringify(solicitud));

    const hd = new Headers();
    hd.append("Content-Type", "application/json");

    const res = await fetch(`${BASE_SOLICITUD_URL}solicitudInstitucion`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(solicitud),
    });

    const data = await res.json();
    console.log("solicitud:", data);

    if (!res.ok) {
      throw new Error(
        data.message || "Error al crear solicitud de institución"
      );
    }

    return data;
  } catch (err) {
    console.error("Create institution solicitud error:", err);
    throw err;
  }
}

export type getAllSolicitudes = {
  id_solicitud: number;
  nombre_institucion: string;
  tipo: string;
  email_contacto: string;
  telefono_contacto: string;
  razon_solicitud: string;
  estado: string;
};
/**
 * Obtiene todas las solicitudes de institución (solo admin)
 * @param cookie - Cookie de autenticación (requerida para admin)
 * @returns Promise con array de solicitudes
 * @throws Error si falla la petición o no tiene permisos
 */
export async function getAllInstitutionSolicitudesService(
  cookie: string
): Promise<[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_SOLICITUD_URL}obtenerSolicitudes`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener solicitudes");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all institution solicitudes error:", err);
    throw err;
  }
}

/**
 * Actualiza el estado de una solicitud de institución (aceptar/rechazar)
 * @param id - id_solicitud
 * @param estado - nuevo estado (por ejemplo: 'ACEPTADA' | 'RECHAZADA' | 'PENDIENTE')
 * @param motivo_rechazo - motivo opcional cuando se rechaza
 * @param cookie - cookie de autenticación (opcional)
 */
export async function updateInstitutionSolicitudStatusService(
  id: number,
  estado: string,
  motivo_rechazo?: string,
  cookie?: string
): Promise<InstitutionSolicitudResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    if (cookie) hd.append("Cookie", cookie);

    const body: any = { id_solicitud: id, estado };
    if (motivo_rechazo) body.motivo_rechazo = motivo_rechazo;

    const res = await fetch(`${BASE_SOLICITUD_URL}actualizarEstado`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Error al actualizar estado de la solicitud"
      );
    }

    return data;
  } catch (err) {
    console.error("Update institution solicitud status error:", err);
    throw err;
  }
}

/**
 * Obtiene una solicitud por ID
 * @param id - id_solicitud
 * @param cookie - cookie de autenticación
 */
export async function getInstitutionSolicitudByIdService(
  id: number,
  cookie?: string
): Promise<InstitutionSolicitudGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    if (cookie) hd.append("Cookie", cookie as string);

    const res = await fetch(`${BASE_SOLICITUD_URL}obtenerPorId?id=${id}`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener la solicitud");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get institution solicitud by id error:", err);
    throw err;
  }
}
