import { ReactNode, useEffect, useMemo, useRef } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAuth } from "~/features/auth/useAuth";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { USER_ROLES, type UserRole } from "~/lib/constants";
import { canAccessRoute } from "~/lib/roleGuards";
import { getUserFromRequest } from "~/server/me";
// este componente se usssara para hacer "wrap" y verificar
// que el usuario tenga el rol adecuado para acceder a la ruta
// este solo wrapea componentes
interface AuthRoleComponentProps {
  /**
   * Roles permitidos para ver este contenido
   * Ejemplo: allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.ADOPTANTE]}
   */
  allowedRoles: UserRole[];

  /**
   * Contenido a mostrar si el usuario tiene el rol adecuado
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
 * Componente para verificar roles y mostrar/ocultar contenido condicionalmente
 *
 * Uso:
 * ```tsx
 * <AuthRoleComponent allowedRoles={[USER_ROLES.ADMIN]}>
 *   <AdminPanel />
 * </AuthRoleComponent>
 *
 * <AuthRoleComponent
 *   allowedRoles={[USER_ROLES.ADOPTANTE, USER_ROLES.USER]}
 *   fallback={<p>Solo para adoptantes y usuarios</p>}
 * >
 *   <CommunityFeature />
 * </AuthRoleComponent>
 * ```
 */
export function AuthRoleComponent({
  allowedRoles,
  children,
  fallback = null,
  showWhileLoading = false,
}: AuthRoleComponentProps) {
  const { user, isLoading } = useSmartAuth();
  const fetcher = useFetcher();
  const hasSubmitted = useRef(false);

  // Crear una key estable para las dependencias
  const allowedRolesKey = useMemo(
    () => JSON.stringify(allowedRoles),
    [JSON.stringify(allowedRoles)]
  );
  const userKey = useMemo(
    () => user?.user?.id || user?.id,
    [user?.user?.id, user?.id]
  );

  useEffect(() => {
    if (!user || hasSubmitted.current) return;

    console.log("[AuthRoleComponent] User data:", user);
    console.log("[AuthRoleComponent] User role:", user.user?.role || user.role);
    console.log("[AuthRoleComponent] Allowed roles:", allowedRoles);

    hasSubmitted.current = true;
    fetcher.submit(
      {
        allowedRoles: JSON.stringify(allowedRoles),
        user: JSON.stringify(user),
      },
      { method: "post", action: "/api/auth/has-access" }
    );
  }, [userKey, allowedRolesKey]);
  // Mientras está cargando el front
  if (isLoading) {
    return <>ERES UN PUTITO</>;
    // return showWhileLoading ? <>{children}</> : null;
  }
  // Si no hay usuario autenticado
  if (!user) {
    return <>{fallback}</>;
  }
  // mientras este cargando el fetcher dele ssr
  if (fetcher.state === "loading" || fetcher.state === "submitting") {
    return showWhileLoading ? <>{children}</> : null;
  }
  if (!fetcher.data) return <>{fallback}</>;

  console.log("AuthRoleComponent - fetcher.data:", fetcher.data);

  if (fetcher.data?.ok === false)
    return (
      <>
        hubo un error {fetcher.data.error} {fallback}
      </>
    );
  // obtenemos la response
  const hasAccess: boolean = fetcher.data.hasAccess;

  console.log("tenia acceso el rol?: " + hasAccess);

  // Verificar si el usuario tiene uno de los roles permitidos
  if (hasAccess) {
    return <>{children}</>;
  }
  // No tiene acceso, mostrar fallback
  return <>{fallback}</>;
}

/**
 * Componente específico para contenido solo de ADMIN (cualquier tipo)
 */
export function AdminOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthRoleComponent
      allowedRoles={[
        USER_ROLES.ADMIN,
        USER_ROLES.VETERINARIA,
        USER_ROLES.REFUGIO,
        USER_ROLES.SYSTEM,
      ]}
      fallback={fallback}
    >
      {children}
    </AuthRoleComponent>
  );
}

/**
 * Componente específico para contenido solo de ADOPTANTE
 */
export function AdoptanteOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthRoleComponent
      allowedRoles={[USER_ROLES.ADOPTANTE]}
      fallback={fallback}
    >
      {children}
    </AuthRoleComponent>
  );
}

/**
 * Componente específico para contenido solo de USER
 */
export function UserOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthRoleComponent allowedRoles={[USER_ROLES.USER]} fallback={fallback}>
      {children}
    </AuthRoleComponent>
  );
}
export function AnyOnly({ children, fallback = null }) {
  return (
    <AuthRoleComponent
      allowedRoles={[
        USER_ROLES.ADOPTANTE,
        USER_ROLES.USER,
        USER_ROLES.ADMIN,
        USER_ROLES.VETERINARIA,
        USER_ROLES.REFUGIO,
        USER_ROLES.SYSTEM,
      ]}
      fallback={fallback}
    >
      {children}
    </AuthRoleComponent>
  );
}
/**
 * Componente para contenido de ADOPTANTE o USER (excluye ADMIN)
 */
export function CommunityRoles({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthRoleComponent
      allowedRoles={[USER_ROLES.ADOPTANTE, USER_ROLES.USER]}
      fallback={fallback}
    >
      {children}
    </AuthRoleComponent>
  );
}
