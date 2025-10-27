
// app/server/cookies.ts

/**
 * Obtiene el token de autenticación de las cookies de la petición
 * @param request - Objeto Request de la petición HTTP
 * @returns El token de autenticación o null si no existe
 */
export function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  
  if (!cookieHeader) return null;

  // Buscar directamente la cookie AUTH_TOKEN
  const authCookie = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('AUTH_TOKEN='));

  if (!authCookie) return null;
  
  // Extraer y decodificar el valor de la cookie
  const token = authCookie.split('=')[1];
  return token ? decodeURIComponent(token) : null;
}
