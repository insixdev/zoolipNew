import { Link, Outlet } from "react-router";
import {
  AuthRoleComponent,
  CommunityRoles,
} from "~/components/auth/AuthRoleComponent";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { USER_ROLES } from "~/lib/constants";

export default function AdoptLayout() {
  const { user } = useSmartAuth();
  let isUser = false;
  if (!user) {
    isUser = true;
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <CommunityNavbar />
      <SidebarContainer
        showSidebar={true}
        onlyForUsers={isUser}
        className="z-80"
      />

      {/* Content area - Sin restricción de roles, el loader de cada ruta maneja la auth */}
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
}
