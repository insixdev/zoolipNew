import { useLocation } from "react-router";
import Sidebar from "./Sidebar";
import AdoptSidebar from "./AdoptSidebar";

export type DynamicSidebarProps = {
  className?: string;
  onlyForUsers?: boolean;
};

export default function DynamicSidebar({
  className = "",
  onlyForUsers = true,
}: DynamicSidebarProps) {
  const location = useLocation();

  // Determinar qué sidebar mostrar según la ruta
  const isAdoptSection = location.pathname.startsWith("/adopt");

  if (isAdoptSection) {
    return <AdoptSidebar className={className} onlyForUsers={onlyForUsers} />;
  }

  // Por defecto, mostrar la sidebar de comunidad
  return <Sidebar className={className} onlyForUsers={onlyForUsers} />;
}
