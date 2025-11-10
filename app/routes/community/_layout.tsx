import { useState } from "react";
import { Outlet } from "react-router";
import { SmartAuthWrapper } from "~/components/auth/SmartAuthWrapper";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { USER_ROLES } from "~/lib/constants";

//macor commun para todas las rutas de community 
export default function CommunityLayout() {
  const { user } = useSmartAuth();
  let isUser = false;
  if(!user){
    isUser = true

  }
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <CommunityNavbar />
      <SidebarContainer showSidebar={true} onlyForUsers={isUser} className="z-80" />
      
      {/* Content area */}
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
}
