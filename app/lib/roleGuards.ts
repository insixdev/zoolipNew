import { redirect } from "react-router";
import { getUserFromRequest } from "~/server/me";
import {
  UserErrorHandler,
  UserResponseHandler,
} from "~/features/entities/User";
import { USER_ROLES, type UserRole } from "~/lib/constants";

/**
 * Guard genérico para verificar roles específicos
 * Cada rol tiene su propia lógica independiente para mayor seguridad
 */
async function requireSpecificRole(
  request: Request,
  allowedRoles: UserRole[],
  fallbackRedirect: string = "/login"
): Promise<UserResponseHandler> {
  const url = new URL(request.url);
  const userResult = await getUserFromRequest(request);

  // Si hay error (no autenticado), redirigir al login
  if ("succes" in userResult && !userResult.succes) {
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const user = userResult as UserResponseHandler;

  // Verificar si el usuario tiene uno de los roles permitidos
  if (!allowedRoles.includes(user.user.role as UserRole)) {
    // En lugar de redirigir, lanzar un error 403 con información contextual
    const roleNames = {
      [USER_ROLES.ADMIN]: "Administrador",
      [USER_ROLES.ADOPTANTE]: "Adoptante",
      [USER_ROLES.USER]: "Usuario de Comunidad",
      [USER_ROLES.SYSTEM]: "Sistema",
    };

    const requiredRoleNames = allowedRoles
      .map((role) => roleNames[role])
      .join(" o ");
    const currentRoleName =
      roleNames[user.user.role as UserRole] || "Desconocido";

    throw new Response(
      JSON.stringify({
        message: `Acceso denegado. Se requiere rol: ${requiredRoleNames}. Tu rol actual: ${currentRoleName}`,
        status: 403,
        statusText: "Forbidden",
        path: url.pathname,
        userRole: user.user.role,
        requiredRoles: allowedRoles,
      }),
      {
        status: 403,
        statusText: "Forbidden",
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return user;
}

/**
 * Guard específico para ROLE_ADMIN
 * Solo permite acceso a usuarios con rol de administrador
 */
export async function requireAdmin(
  request: Request
): Promise<UserResponseHandler> {
  return requireSpecificRole(request, [USER_ROLES.ADMIN], "/login");
}

/**
 * Guard específico para ROLE_ADOPTANTE
 * Solo permite acceso a usuarios adoptantes
 */
export async function requireAdoptante(
  request: Request
): Promise<UserResponseHandler> {
  return requireSpecificRole(request, [USER_ROLES.ADOPTANTE], "/login");
}

/**
 * Guard específico para ROLE_SYSTEM
 * Solo permite acceso al sistema
 */
export async function requireSystem(
  request: Request
): Promise<UserResponseHandler> {
  return requireSpecificRole(request, [USER_ROLES.SYSTEM], "/login");
}

/**
 * Guard específico para ROLE_USER
 * Solo permite acceso a usuarios regulares
 */
export async function requireUser(
  request: Request
): Promise<UserResponseHandler> {
  return requireSpecificRole(request, [USER_ROLES.USER], "/login");
}

/**
 * Guard para usuarios autenticados (cualquier rol)
 * Útil para rutas compartidas como perfil, configuración básica, etc.
 */
export async function requireAnyAuth(
  request: Request
): Promise<UserResponseHandler> {
  return requireSpecificRole(
    request,
    [USER_ROLES.ADMIN, USER_ROLES.ADOPTANTE, USER_ROLES.USER],
    "/login"
  );
}

/**
 * Guard combinado para ADOPTANTE y USER
 * Para funcionalidades que comparten estos dos roles
 */
export async function requireAdoptanteOrUser(
  request: Request
): Promise<UserResponseHandler> {
  return requireSpecificRole(
    request,
    [USER_ROLES.ADOPTANTE, USER_ROLES.USER],
    "/login"
  );
}

// getDashboardRouteByRole moved to client-constants.ts to avoid server imports in client

/**
 * Función helper para verificar si un usuario puede acceder a una ruta específica
 */
export function canAccessRoute(
  userRole: string,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole as UserRole);
}
