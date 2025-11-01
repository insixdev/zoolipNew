import { Outlet } from "react-router";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";

export default function CommunityLayout() {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <CommunityNavbar />
      <SidebarContainer showSidebar={true} className="z-80" />
      
      {/* Content area */}
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
}