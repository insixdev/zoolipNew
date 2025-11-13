import { useAuth } from "~/features/auth/authProvider";

type RoleGuardProps = {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Componente para mostrar contenido solo a usuarios con roles específicos
 * Uso:
 * <RoleGuard allowedRoles={["ROLE_VETERINARIA"]}>
 *   <VeterinariaContent />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export function useHasRole(role: string): boolean {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * Hook para verificar si el usuario tiene alguno de los roles especificados
 */
export function useHasAnyRole(roles: string[]): boolean {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
}
