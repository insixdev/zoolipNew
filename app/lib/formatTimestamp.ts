/**
 * Convierte un string de fecha ISO a formato relativo (ej: "10m", "2h", "5d")
 * o fecha legible para fechas antiguas
 * @param dateString - Fecha en formato ISO string
 * @returns Formato relativo o fecha legible
 */
export function formatTimestamp(dateString: string | null | undefined): string {
  if (!dateString) return "Hace un momento";

  try {
    // Validar que sea string
    if (typeof dateString !== "string") {
      return "Hace un momento";
    }

    // Si no tiene Z ni zona horaria, agregamos Z
    const hasTimezone = /Z$|[+-]\d\d:\d\d$/.test(dateString);
    const normalized = hasTimezone ? dateString : dateString + "Z";

    const date = new Date(normalized);

    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return "Hace un momento";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Si la diferencia es negativa (fecha en el futuro), devolver "Ahora"
    if (diffMs < 0) return "Ahora";

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    // Para fechas antiguas, mostrar fecha en formato corto español
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: diffDays > 30 ? "numeric" : undefined,
    });
  } catch (error) {
    console.warn("[formatTimestamp] Error parsing date:", dateString, error);
    return "Hace un momento";
  }
}

/**
 * Convierte un string de fecha ISO a formato largo legible (ej: "5 de noviembre de 2024")
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha en formato largo español
 */
export function formatTimestampLong(
  dateString: string | null | undefined
): string {
  if (!dateString) return "Fecha desconocida";

  try {
    if (typeof dateString !== "string") {
      return "Fecha desconocida";
    }

    const hasTimezone = /Z$|[+-]\d\d:\d\d$/.test(dateString);
    const normalized = hasTimezone ? dateString : dateString + "Z";

    const date = new Date(normalized);

    if (isNaN(date.getTime())) {
      return "Fecha desconocida";
    }

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.warn("[formatTimestampLong] Error parsing date:", dateString, error);
    return "Fecha desconocida";
  }
}

/**
 * Obtiene solo el tiempo (HH:mm) de una fecha
 * @param dateString - Fecha en formato ISO string
 * @returns Hora en formato HH:mm
 */
export function formatTimestampTime(
  dateString: string | null | undefined
): string {
  if (!dateString) return "00:00";

  try {
    if (typeof dateString !== "string") {
      return "00:00";
    }

    const hasTimezone = /Z$|[+-]\d\d:\d\d$/.test(dateString);
    const normalized = hasTimezone ? dateString : dateString + "Z";

    const date = new Date(normalized);

    if (isNaN(date.getTime())) {
      return "00:00";
    }

    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.warn("[formatTimestampTime] Error parsing date:", dateString, error);
    return "00:00";
  }
}
