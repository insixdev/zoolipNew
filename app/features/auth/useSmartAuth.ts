import { useAuth } from "./useAuth";
import { useLocation } from "react-router";
import { useEffect, useRef } from "react";

/**
 * Hook inteligente que evita requests innecesarios al servidor
 * Usa el AuthProvider como fuente de verdad y solo actualiza cuando es necesario
 */
export function useSmartAuth() {
  const auth = useAuth();
  const location = useLocation();
  const lastLocationRef = useRef<string>("");

  useEffect(() => {
    const currentPath = location.pathname;

    // Solo log si cambió la ubicación
    if (lastLocationRef.current !== currentPath) {
      console.log("SmartAuth: Navegación a", currentPath);

      // Rutas que NO necesitan verificación de usuario
      const publicRoutes = ["/landing", "/info/", "/about"];
      const isPublicRoute = publicRoutes.some((route) =>
        currentPath.includes(route)
      );

      if (isPublicRoute && auth.user) {
        console.log("SmartAuth: Ruta pública, usuario ya conocido");
      } else if (!isPublicRoute && !auth.user) {
        console.log("SmartAuth: Ruta protegida, usuario no conocido");
      } else {
        console.log("SmartAuth: Estado consistente");
      }

      lastLocationRef.current = currentPath;
    }
  }, [location.pathname, auth.user]);

  return {
    ...auth,
    // Función para verificar si necesitamos datos del servidor
    needsServerData: () => {
      const publicRoutes = ["/landing", "/info/", "/about"];
      const isPublicRoute = publicRoutes.some((route) =>
        location.pathname.includes(route)
      );

      // No necesitamos datos del servidor si:
      // 1. Es una ruta pública Y ya tenemos usuario (o no lo necesitamos)
      // 2. Ya tenemos usuario en memoria para rutas protegidas
      return !isPublicRoute && !auth.user;
    },
  };
}
