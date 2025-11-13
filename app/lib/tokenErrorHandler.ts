import { clearUserCache } from "~/server/me";
import { redirect } from "react-router";

/**
 * Verifica si un error es relacionado con token inválido
 */
export function isTokenError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message || error.error || "";
  const errorString =
    typeof errorMessage === "string"
      ? errorMessage
      : JSON.stringify(errorMessage);

  return (
    errorString.includes("Token invalidado") ||
    errorString.includes("Token expirado") ||
    errorString.includes("No autorizado") ||
    errorString.includes("Unauthorized") ||
    errorString.includes("401")
  );
}

/**
 * Maneja errores de token: limpia cache y redirige al login
 */
export function handleTokenError() {
  console.log("🔴 TOKEN ERROR DETECTADO - Limpiando cache y redirigiendo");
  clearUserCache();
  throw redirect("/auth/login?error=session_expired");
}

/**
 * Wrapper para servicios que maneja automáticamente errores de token
 */
export async function withTokenErrorHandling<T>(
  serviceCall: () => Promise<T>
): Promise<T> {
  try {
    return await serviceCall();
  } catch (error) {
    if (isTokenError(error)) {
      handleTokenError();
    }
    throw error;
  }
}

/**
 * Helper para procesar respuestas de fetch y manejar errores consistentemente
 * Extrae el error del backend (data.error o data.message) y lo propaga correctamente
 */
export async function handleFetchResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    // Extraer mensaje de error del backend
    const errorMessage =
      data.error || data.message || `Error ${response.status}`;
    const error = new Error(errorMessage);
    (error as any).data = data; // Guardar data completa para debugging
    (error as any).status = response.status;
    throw error;
  }

  return data;
}
