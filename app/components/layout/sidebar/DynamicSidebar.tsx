import { useLocation } from 'react-router';
import Sidebar from './Sidebar';
import AdoptSidebar from './AdoptSidebar';

export type DynamicSidebarProps = {
  className?: string;
};

export default function DynamicSidebar({ className = '' }: DynamicSidebarProps) {
  const location = useLocation();
  
  // Determinar qué sidebar mostrar según la ruta
  const isAdoptSection = location.pathname.startsWith('/adopt');
  
  if (isAdoptSection) {
    return <AdoptSidebar className={className} />;
  }
  
  // Por defecto, mostrar la sidebar de comunidad
  return <Sidebar className={className} />;
}