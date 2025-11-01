import { useState } from 'react';
import DynamicSidebar from './DynamicSidebar';
import MobileSidebar from './MobileSidebar';
import { Menu } from 'lucide-react';

export type SidebarContainerProps = {
  showSidebar?: boolean;
  className?: string;
};

export default function SidebarContainer({ showSidebar = true, className = '' }: SidebarContainerProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!showSidebar) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-6 right-6 z-30 md:hidden bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block ${className}`}>
        <DynamicSidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
