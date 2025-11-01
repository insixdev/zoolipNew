import { useEffect, useState } from "react";

/** se usa como nested component para que se ejecute en el cliente*/
export const ClientOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("ClientOnly mounted!");
    // Pequeño delay para asegurar que el DOM está listo
    const timer = setTimeout(() => {
      setMounted(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // No renderizar nada en el servidor
  if (typeof window === "undefined") {
    console.log("ClientOnly on server, not rendering");
    return <>{fallback}</>;
  }

  if (!mounted) {
    console.log("ClientOnly not mounted yet, showing fallback");
    return <>{fallback}</>;
  }

  console.log("ClientOnly rendering children");
  return <>{children}</>;
};
