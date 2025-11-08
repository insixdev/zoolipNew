import { useEffect, useState, useRef } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Delay adicional antes de mostrar el contenido (útil para animaciones) */
  delay?: number;
  /** Mostrar un placeholder mientras carga */
  showPlaceholder?: boolean;
  /** Clase CSS para el contenedor */
  className?: string;
}

/**
 * Componente que solo renderiza en el cliente
 * Útil para componentes con animaciones, efectos visuales o que dependen del DOM
 */
export const ClientOnly: React.FC<ClientOnlyProps> = ({
  children,
  fallback = null,
  delay = 0,
  showPlaceholder = false,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Marcar como montado inmediatamente
    setMounted(true);

    // Si hay delay, esperar antes de marcar como listo
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setReady(true);
      }, delay);
    } else {
      // Sin delay, usar requestAnimationFrame para asegurar que el DOM está listo
      requestAnimationFrame(() => {
        setReady(true);
      });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  // En el servidor, siempre mostrar fallback
  if (typeof window === "undefined") {
    return (
      <div className={className} suppressHydrationWarning>
        {fallback}
      </div>
    );
  }

  // En el cliente, pero aún no montado o no listo
  if (!mounted || !ready) {
    if (showPlaceholder) {
      return (
        <div
          className={`${className} opacity-0 transition-opacity duration-300`}
          suppressHydrationWarning
        >
          {fallback || (
            <div className="animate-pulse bg-gray-200 rounded h-20 w-full" />
          )}
        </div>
      );
    }
    return (
      <div className={className} suppressHydrationWarning>
        {fallback}
      </div>
    );
  }

  // Listo para mostrar el contenido
  return (
    <div
      className={`${className} animate-in fade-in duration-300`}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};
