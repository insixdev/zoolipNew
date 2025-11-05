import { useEffect } from "react";
import { useSmartAuth } from "~/features/auth/useSmartAuth";

interface SmartAuthWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper que optimiza las llamadas de autenticación
 * Evita requests innecesarios usando el estado del AuthProvider
 */
export function SmartAuthWrapper({ children }: SmartAuthWrapperProps) {
  const smartAuth = useSmartAuth();

  useEffect(() => {
    // Log del estado actual para debugging
    console.log(" SmartAuthWrapper estado:", {
      hasUser: !!smartAuth.user,
      needsServerData: smartAuth.needsServerData(),
      isLoading: smartAuth.isLoading,
    });
  }, [smartAuth.user, smartAuth.isLoading]); // solo se ejecuta cuando cambia el user   

  return <>{children}</>;
}
