import {
  InstitutionCreateRequest,
  InstitutionUpdateRequest,
  InstitutionResponse,
  InstitutionGetResponse,
} from "./types";

/** URL base del backend de instituciones */
const BASE_INSTITUTION_URL =
  process.env.BASE_INSTITUTION_URL || "http://localhost:3050/api/institucion/";

/**
 * Agrega una nueva institución al sistema
 * @param institution - Datos de la institución a agregar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function addInstitutionService(
  institution: InstitutionCreateRequest,
  cookie: string
): Promise<InstitutionResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_INSTITUTION_URL}agregar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(institution),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al agregar institución");
    }

    return data;
  } catch (err) {
    console.error("Add institution error:", err);
    throw err;
  }
}

/**
 * Actualiza una institución existente
 * @param institution - Datos actualizados de la institución (debe incluir id_institucion)
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function updateInstitutionService(
  institution: InstitutionUpdateRequest,
  cookie: string
): Promise<InstitutionResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_INSTITUTION_URL}actualizar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(institution),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar institución");
    }

    return data;
  } catch (err) {
    console.error("Update institution error:", err);
    throw err;
  }
}

/**
 * Elimina una institución del sistema
 * @param id - ID de la institución a eliminar
 * @param cookie - Cookie de autenticación
 * @returns Promise con la respuesta del servidor
 * @throws Error si falla la petición
 */
export async function deleteInstitutionService(
  id: number,
  cookie: string
): Promise<InstitutionResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_INSTITUTION_URL}eliminar`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(id),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar institución");
    }

    return data;
  } catch (err) {
    console.error("Delete institution error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de una institución por su ID de usuario
 * @param id - ID de usaurio asocioadj a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos de la institución
 * @throws Error si falla la petición o no se encuentra la institución
 */
export async function getInstitutionByIdUsuarioService(
  id: number,
  cookie: string
): Promise<InstitutionGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    console.log(`Obteniendo institución por ID de usuario: ${id}`);

    const res = await fetch(
      `${BASE_INSTITUTION_URL}obtenerPorIdUsuario?id_usuario=${id}`,
      {
        method: "GET",
        headers: hd,
      }
    );

    console.log(`Status de respuesta: ${res.status}`);

    // Leer el texto de la respuesta primero
    const text = await res.text();
    console.log(`Respuesta raw: ${text}`);

    if (!res.ok) {
      let errorMessage = "Error al obtener institución";
      try {
        const errorData = text ? JSON.parse(text) : {};
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear, usar el texto tal cual
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Si la respuesta está vacía, lanzar error
    if (!text || text.trim() === "") {
      throw new Error("El servidor devolvió una respuesta vacía");
    }

    const data = JSON.parse(text);
    console.log(`✅ Institución obtenida:`, data);
    return data;
  } catch (err) {
    console.error("❌ Get institution by id usuario error:", err);
    throw err;
  }
}

/**
 * Obtiene los datos de una institución por su ID
 * @param id - ID de la institución a consultar
 * @param cookie - Cookie de autenticación
 * @returns Promise con los datos de la institución
 * @throws Error si falla la petición o no se encuentra la institución
 */
export async function getInstitutionByIdService(
  id: number,
  cookie: string
): Promise<InstitutionGetResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_INSTITUTION_URL}obtenerPorId?id=${id}`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener institución");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get institution by id error:", err);
    throw err;
  }
}

/**
 * Obtiene todas las instituciones registradas en el sistema
 * @param cookie - Cookie de autenticación
 * @returns Promise con array de instituciones
 * @throws Error si falla la petición
 */
export async function getAllInstitutionsService(
  cookie: string
): Promise<InstitutionGetResponse[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_INSTITUTION_URL}obtenerTodas`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener instituciones");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all institutions error:", err);
    throw err;
  }
}
