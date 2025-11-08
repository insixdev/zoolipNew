/**
 * User roles and their corresponding dashboard routes
 */
export enum UserRole {
  ADMIN = 'ROLE_ADMINISTRADOR',
  USER = 'ROLE_USER',
  ADOPTER = 'ROLE_ADOPTER'
}

/**
 * Returns the appropriate dashboard route based on user role
 * @param role - The user's role
 * @returns The route to the user's dashboard
 */
export function getDashboardRouteByRole(role: string): string {
  const routes: Record<string, string> = {
    [UserRole.ADMIN]: '/admin',
    [UserRole.ADOPTER]: '/adopt',
    [UserRole.USER]: '/community',
  };

  // Default route for unknown roles or unauthenticated users
  return routes[role] || '/landing';
}

/**
 * Checks if a user has access to a specific route based on their role
 * @param userRole - The user's role
 * @param allowedRoles - Array of roles that have access
 * @returns boolean indicating if access is granted
 */
export function hasRoleAccess(userRole: string, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
