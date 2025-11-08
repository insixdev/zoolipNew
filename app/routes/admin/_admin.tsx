import { Outlet } from "react-router";
import { AdminOnly } from "~/components/auth/AuthRoleComponent";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar";

//macor commun para todas las rutas de community 
export default function CommunityLayout() {
  return (

    <div className="min-h-screen bg-gray-100 relative">
    <AdminOnly>

      <CommunityNavbar />
      <SidebarContainer showSidebar={true} className="z-80" />
      
      {/* Content area */}
      <div className="pt-20">
        <Outlet />
      </div>

    </AdminOnly>

    </div>

  );
}
