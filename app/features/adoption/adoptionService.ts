import type {
  MascotaDTO,
  MascotaRequest,
  SolicitudAdopcionDTO,
  SolicitudAdopcionRequest,
  Response,
} from "./types";

const BASE_URL =
  process.env.BASE_MASCOTA_URL || "http://localhost:3050/api/mascotas";

/**
 * Obtiene todas las mascotas disponibles
 */
export async function getAllMascotasService(
  cookie: string
): Promise<MascotaDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/obtenerTodas`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mascotas:", error);
    throw error;
  }
}

/**
 * Obtiene una mascota por ID
 */
export async function getMascotaByIdService(
  id: number,
  cookie: string
): Promise<MascotaDTO> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/obtenerPorId?id=${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mascota by id:", error);
    throw error;
  }
}

/**
 * Obtiene mascotas por institución
 */
export async function getMascotasByInstitucionService(
  id_institucion: number,
  cookie: string
): Promise<MascotaDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(
      `${BASE_URL}/obtenerByIdInstitucion?id_institucion=${id_institucion}`,
      {
        method: "GET",
        headers,
      }
    );

    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mascotas by institucion:", error);
    throw error;
  }
}

/**
 * Crea una solicitud de adopción
 */
export async function createSolicitudAdopcionService(
  solicitud: SolicitudAdopcionRequest,
  cookie: string
): Promise<Response> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/solicitudAdopcion`, {
      method: "POST",
      headers,
      body: JSON.stringify(solicitud),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear solicitud");
    }

    return data;
  } catch (error) {
    console.error("Error creating solicitud:", error);
    throw error;
  }
}

/**
 * Obtiene todas las solicitudes de adopción
 */
export async function getAllSolicitudesService(
  cookie: string
): Promise<SolicitudAdopcionDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/getAllSolicitudes`, {
      method: "GET",
      headers,
    });

    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    throw error;
  }
}

/**
 * Obtiene una solicitud por ID
 */
export async function getSolicitudByIdService(
  id: number,
  cookie: string
): Promise<SolicitudAdopcionDTO | null> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/getSolicitudById?id=${id}`, {
      method: "GET",
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching solicitud by id:", error);
    throw error;
  }
}

/**
 * Completa una solicitud de adopción (aprobar o rechazar)
 * @param id_solicitud - ID de la solicitud
 * @param estado - Estado: "APROBADA" o "RECHAZADA"
 */
export async function completarSolicitudService(
  id_solicitud: number,
  estado: "APROBADA" | "RECHAZADA",
  cookie: string
): Promise<Response> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/completarSolicitud`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id_solicitud, estado }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al completar solicitud");
    }

    return data;
  } catch (error) {
    console.error("Error completing solicitud:", error);
    throw error;
  }
}

/**
 * Crea una nueva mascota
 */
export async function createMascotaService(
  mascota: MascotaRequest,
  cookie: string
): Promise<Response> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/aniadir`, {
      method: "POST",
      headers,
      body: JSON.stringify(mascota),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear mascota");
    }

    return data;
  } catch (error) {
    console.error("Error creating mascota:", error);
    throw error;
  }
}

/**
 * Actualiza una mascota existente
 */
export async function updateMascotaService(
  mascota: MascotaRequest,
  cookie: string
): Promise<Response> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/actualizar`, {
      method: "POST",
      headers,
      body: JSON.stringify(mascota),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar mascota");
    }

    return data;
  } catch (error) {
    console.error("Error updating mascota:", error);
    throw error;
  }
}

/**
 * Elimina una mascota
 */
export async function deleteMascotaService(
  id: number,
  cookie: string
): Promise<Response> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/eliminar`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar mascota");
    }

    return data;
  } catch (error) {
    console.error("Error deleting mascota:", error);
    throw error;
  }
}

/**
 * Obtiene las mascotas del usuario autenticado (adoptadas)
 */
export async function getMisMascotasService(
  cookie: string
): Promise<MascotaDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(`${BASE_URL}/misMascotas`, {
      method: "GET",
      headers,
    });

    if (response.status === 204) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mis mascotas:", error);
    throw error;
  }
}
