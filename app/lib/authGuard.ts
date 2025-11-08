import { redirect } from "react-router";
import { getUserFromRequest } from "~/server/me";
import { UserErrorHandler, UserResponseHandler } from "~/features/entities/User";
import { getHeaderCookie, verifyTokenFromCookie } from "~/server/cookies";

/**
 * Función helper para proteger rutas que requieren autenticación
 * Redirige al login con el parámetro redirectTo si el usuario no está autenticado
 * SOLO para uso en loaders (servidor)
 */
export async function requireAuth(
  request: Request
): Promise<UserResponseHandler> {
  const userResult = await getUserFromRequest(request);

  // Si hay error (no autenticado), redirigir al login con redirectTo
  if ("succes" in userResult && !userResult.succes) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return userResult as UserResponseHandler;
}

/**
 * Función helper para rutas que no requieren autenticación pero pueden beneficiarse de ella
 * Retorna el usuario si está autenticado, null si no lo está
 */
export async function optionalAuth(
  request: Request
): Promise<UserResponseHandler | null> {
  const userResult = await getUserFromRequest(request);

  if ("succes" in userResult && !userResult.succes) {
    return null;
  }

  return userResult as UserResponseHandler;
}

/**
 * Función rápida para verificar si hay una cookie de autenticación válida
 * Solo verifica la cookie sin hacer llamadas al servidor
 */
function hasValidAuthCookie(request: Request): boolean {
  try {
    const cookieHeader = getHeaderCookie(request);
    if (!cookieHeader) {
      console.log("No cookie header found");
      return false;
    }

    console.log("Cookie header found:", cookieHeader);

    // Usar verifyTokenFromCookie que maneja la extracción del token
    const tokenValidation = verifyTokenFromCookie(cookieHeader);

    // Si verifyTokenFromCookie retorna undefined, significa que el token es válido
    const isValid = tokenValidation === undefined;
    console.log(
      "Token validation result:",
      isValid ? "válido" : "inválido",
      tokenValidation
    );

    return isValid;
  } catch (error) {
    console.log("Error validating cookie:", error);
    return false;
  }
}

/**
 * Función helper para rutas que NO deben ser accesibles por usuarios autenticados
 * Redirige a la página principal si el usuario ya está autenticado
 * Útil para páginas como login, register, etc.
 *
 * @param request - La request de React Router
 * @param redirectTo - URL a la que redirigir si está autenticado (por defecto "/")
 */
export async function redirectIfAuthenticated(
  request: Request,
  redirectTo: string = "/"
): Promise<void> {
  try {
    console.log("VEWRficiacione");
    console.log("URL actual:", request.url);

    // verificacian rapida de cookie primero
    if (hasValidAuthCookie(request)) {
      console.log("Cookie válida detectada, redirigiendo a:", redirectTo);
      throw redirect(redirectTo);
    }

    console.log("No hay cookie válida, permitiendo acceso a login/register");
  } catch (error) {
    if (
      error instanceof Response &&
      error.status >= 300 &&
      error.status < 400
    ) {
      console.log("🔄 Ejecutando redirección...");
      throw error;
    }

    // Para cualquier otro error, permitir acceso (mejor fallar abierto)
    console.log(
      error
    );
  }
}
