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
    console.log("[ADOPTION SERVICE] Mascotas obtenidas:", data);

    // Mapear los campos del backend al formato esperado
    const mappedData = data.map((mascota: any) => ({
      id: mascota.id_Mascota || mascota.id_mascota || mascota.id,
      nombre: mascota.nombre || mascota.especie || "Sin nombre",
      raza: mascota.raza || "Sin raza",
      edad: mascota.edad || 0,
      id_institucion: mascota.id_institucion || 0,
      descripcion: mascota.descripcion || "",
      imagen_url: mascota.imagen_url || mascota.imagenUrl,
      sexo: mascota.sexo || mascota.especie,
      tamanio: mascota.tamanio || "MEDIANO",
      estado: mascota.estadoAdopcion || mascota.estado || "DISPONIBLE",
      fecha_registro: mascota.fecha_registro || mascota.fechaRegistro,
      nombreInstitucion: mascota.nombreInstitucion,
      estadoSalud: mascota.estadoSalud,
    }));

    console.log("[ADOPTION SERVICE] Mascotas mapeadas:", mappedData);
    return mappedData;
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

    console.log(`[ADOPTION SERVICE] Obteniendo mascota con ID: ${id}`);

    const response = await fetch(`${BASE_URL}/obtenerPorId?id=${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[ADOPTION SERVICE] Mascota obtenida:", data);

    // Mapear los campos del backend al formato esperado
    const mappedData = {
      id: data.id_Mascota || data.id_mascota || data.id,
      nombre: data.nombre || data.especie || "Sin nombre",
      raza: data.raza || "Sin raza",
      edad: data.edad || 0,
      id_institucion: data.id_institucion || 0,
      descripcion: data.descripcion || "",
      imagen_url: data.imagen_url || data.imagenUrl,
      sexo: data.sexo || data.especie,
      tamanio: data.tamanio || "MEDIANO",
      estado: data.estadoAdopcion || data.estado || "DISPONIBLE",
      fecha_registro: data.fecha_registro || data.fechaRegistro,
      nombreInstitucion: data.nombreInstitucion,
      estadoSalud: data.estadoSalud,
    };

    return mappedData;
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
  solicitud: any,
  cookie: string
): Promise<Response> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    console.log("[ADOPTION SERVICE] Creando solicitud con datos:", solicitud);
    console.log("[ADOPTION SERVICE] URL:", `${BASE_URL}/solicitudAdopcion`);

    const response = await fetch(`${BASE_URL}/solicitudAdopcion`, {
      method: "POST",
      headers,
      body: JSON.stringify(solicitud),
    });

    console.log("[ADOPTION SERVICE] Status de respuesta:", response.status);

    const text = await response.text();
    console.log("[ADOPTION SERVICE] Respuesta raw:", text);

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("[ADOPTION SERVICE] Error parseando respuesta:", e);
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("[ADOPTION SERVICE] Error creating solicitud:", error);
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
 * @param id_solicitud_adopcion - ID de la solicitud
 * @param estadoSolicitud - Estado: "APROBADO" o "RECHAZADO"
 * @param motivo_decision - Motivo de la decisión
 */
export async function completarSolicitudService(
  id_solicitud_adopcion: number,
  estadoSolicitud: "APROBADO" | "RECHAZADO",
  motivo_decision: string,
  cookie: string
): Promise<Response> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const requestBody = {
      id_solicitud_adopcion,
      estadoSolicitud,
      motivo_decision,
    };

    console.log("[ADOPTION SERVICE] Completando solicitud:", requestBody);

    const response = await fetch(`${BASE_URL}/completarAdopcion`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log("[ADOPTION SERVICE] Status respuesta:", response.status);

    const text = await response.text();
    console.log("[ADOPTION SERVICE] Respuesta raw:", text);

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("[ADOPTION SERVICE] Error parseando respuesta:", e);
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("[ADOPTION SERVICE] Error completing solicitud:", error);
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

/**
 * Obtiene las solicitudes de adopción del usuario actual
 */
export async function getSolicitudesCurrentUserService(
  cookie: string
): Promise<SolicitudAdopcionDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    console.log("[ADOPTION SERVICE] Obteniendo solicitudes del usuario actual");

    const response = await fetch(`${BASE_URL}/obtenerSolicitudCurrentUser`, {
      method: "GET",
      headers,
    });

    console.log("[ADOPTION SERVICE] Status de respuesta:", response.status);

    if (response.status === 204) {
      console.log("[ADOPTION SERVICE] No hay solicitudes");
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[ADOPTION SERVICE] Solicitudes obtenidas:", data.length);
    return data;
  } catch (error) {
    console.error(
      "[ADOPTION SERVICE] Error fetching solicitudes current user:",
      error
    );
    throw error;
  }
}

/**
 * Obtiene todas las solicitudes de adopción de la institución actual
 * Solo para instituciones (refugios, veterinarias)
 */
export async function getAllCurrentSolicitudesService(
  cookie: string
): Promise<SolicitudAdopcionDTO[]> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    console.log(
      "[ADOPTION SERVICE] Obteniendo solicitudes de la institución actual"
    );

    const response = await fetch(`${BASE_URL}/getAllCurrentSolicitudes`, {
      method: "GET",
      headers,
    });

    console.log("[ADOPTION SERVICE] Status de respuesta:", response.status);

    if (response.status === 204) {
      console.log("[ADOPTION SERVICE] No hay solicitudes");
      return [];
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[ADOPTION SERVICE] Solicitudes obtenidas:", data.length);
    return data;
  } catch (error) {
    console.error(
      "[ADOPTION SERVICE] Error fetching solicitudes current institution:",
      error
    );
    throw error;
  }
}
