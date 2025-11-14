import { ReactNode, useEffect } from "react";
import { useFetcher } from "react-router";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { ADMIN_ROLES } from "~/lib/constants";

// Tipo para los roles de administrador
export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

interface AdminGuardProps {
  /**
   * Roles de administrador permitidos para ver este contenido
   * Ejemplo: allowedAdminRoles={[ADMIN_ROLES.VETERINARIO, ADMIN_ROLES.REFUGIO]}
   */
  allowedAdminRoles: AdminRole[];

  /**
   * Contenido a mostrar si el usuario tiene el rol de admin adecuado
   */
  children: ReactNode;

  /**
   * Contenido alternativo a mostrar si el usuario NO tiene el rol
   * Si no se proporciona, simplemente no se muestra nada
   */
  fallback?: ReactNode;

  /**
   * Si es true, muestra el contenido mientras se está cargando la autenticación
   * Por defecto es false (no muestra nada mientras carga)
   */
  showWhileLoading?: boolean;
}

/**
 * Componente para verificar roles de administrador y mostrar/ocultar contenido condicionalmente
 * Este componente verifica el campo "tipo" del usuario (VETERINARIA, REFUGIO, ADMINISTRADOR)
 *
 * Uso:
 * ```tsx
 * <AdminGuard allowedAdminRoles={[ADMIN_ROLES.VETERINARIO]}>
 *   <VeterinariaPanel />
 * </AdminGuard>
 *
 * <AdminGuard
 *   allowedAdminRoles={[ADMIN_ROLES.REFUGIO]}
 *   fallback={<p>Solo para refugios</p>}
 * >
 *   <AnimalManagement />
 * </AdminGuard>
 * ```
 */
export function AdminGuard({
  allowedAdminRoles,
  children,
  fallback = null,
  showWhileLoading = false,
}: AdminGuardProps) {
  const { user, isLoading } = useSmartAuth();
  const fetcher = useFetcher();

  useEffect(() => {
    if (!user) return;

    fetcher.submit(
      {
        allowedAdminRoles: JSON.stringify(allowedAdminRoles),
        user: JSON.stringify(user),
      },
      {
        method: "post",
        action: "/api/auth/has-admin-access",
      }
    );
  }, [user]);

  // Mientras está cargando
  if (isLoading) {
    return showWhileLoading ? <>{children}</> : null;
  }

  // Si no hay usuario autenticado
  if (!user) {
    return <>{fallback}</>;
  }

  // Mientras está cargando el fetcher
  if (fetcher.state === "loading" || fetcher.state === "submitting") {
    return showWhileLoading ? <>{children}</> : null;
  }

  if (!fetcher.data) return <>{fallback}</>;

  if (fetcher.data?.ok === false) {
    return <>{fallback}</>;
  }

  // Obtener la respuesta
  const hasAccess: boolean = fetcher.data.hasAccess;

  // Verificar si el usuario tiene uno de los roles de admin permitidos
  if (hasAccess) {
    return <>{children}</>;
  }

  // No tiene acceso, mostrar fallback
  return <>{fallback}</>;
}

/**
 * Componente específico para contenido solo de VETERINARIA
 */
export function VeterinariaOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminGuard
      allowedAdminRoles={[ADMIN_ROLES.VETERINARIO]}
      fallback={fallback}
    >
      {children}
    </AdminGuard>
  );
}

/**
 * Componente específico para contenido solo de REFUGIO
 */
export function RefugioOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminGuard allowedAdminRoles={[ADMIN_ROLES.REFUGIO]} fallback={fallback}>
      {children}
    </AdminGuard>
  );
}

/**
 * Componente específico para contenido solo de ADMINISTRADOR
 */
export function AdministradorOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminGuard allowedAdminRoles={[ADMIN_ROLES.SYSTEM]} fallback={fallback}>
      {children}
    </AdminGuard>
  );
}

/**
 * Componente para contenido de cualquier tipo de organización (REFUGIO, VETERINARIA)
 * Excluye ADMINISTRADOR
 */
export function OrganizacionRoles({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminGuard
      allowedAdminRoles={[ADMIN_ROLES.REFUGIO, ADMIN_ROLES.VETERINARIO]}
      fallback={fallback}
    >
      {children}
    </AdminGuard>
  );
}

/**
 * Componente para contenido de cualquier rol de administrador
 */
export function AnyAdminRole({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AdminGuard
      allowedAdminRoles={[
        ADMIN_ROLES.REFUGIO,
        ADMIN_ROLES.VETERINARIO,
        ADMIN_ROLES.ADMINISTRADOR,
        ADMIN_ROLES.SYSTEM,
      ]}
      fallback={fallback}
    >
      {children}
    </AdminGuard>
  );
}
