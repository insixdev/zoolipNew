import { useState } from "react";
import DynamicSidebar from "./DynamicSidebar";
import MobileSidebar from "./MobileSidebar";
import { Menu } from "lucide-react";

export type SidebarContainerProps = {
  showSidebar?: boolean;
  className?: string;
  onlyForUsers?: boolean;
};

export default function SidebarContainer({
  showSidebar,
  className = "",
  onlyForUsers,
}: SidebarContainerProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!showSidebar) return null;

  const handleOpenMobile = () => {
    if (onlyForUsers) return; // prevent opening for non-logged users
    setIsMobileOpen(true);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={handleOpenMobile}
        className={`fixed bottom-6 right-6 z-30 md:hidden p-4 rounded-full shadow-lg transition-colors ${onlyForUsers ? "bg-gray-300 text-white cursor-not-allowed opacity-60" : "bg-orange-500 text-white hover:bg-orange-600"}`}
        aria-label={onlyForUsers ? "Acceso solo para usuarios" : "Abrir menú"}
        title={
          onlyForUsers ? "Acceso solo para usuarios registrados" : "Abrir menú"
        }
        disabled={onlyForUsers}
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block ${className}`}>
        <DynamicSidebar onlyForUsers={onlyForUsers} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onlyForUsers={onlyForUsers}
      />
    </>
  );
}
