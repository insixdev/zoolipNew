import { useEffect, useState } from "react";
/** se usa comno nested component para que se ejecute en el cliente*/
export const ClientOnly: React.FC<{ children: React.ReactNode }> = ( { children } ) =>{
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}
