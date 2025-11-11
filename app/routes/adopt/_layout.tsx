import { Link, Outlet } from "react-router";
import { AuthRoleComponent, CommunityRoles } from "~/components/auth/AuthRoleComponent";
import CommunityNavbar from "~/components/layout/community/CommunityNavbar";
import SidebarContainer from "~/components/layout/sidebar/SidebarContainer";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { USER_ROLES } from "~/lib/constants";

export default function AdoptLayout() {
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
    <CommunityRoles fallback={
      <>
           <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl shadow-lg border border-orange-200 p-10 text-center max-w-md mx-auto mt-10">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-rose-400 mb-4"
      width="56"
      height="56"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
      >
      <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 14h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      </svg>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
      Solo para adoptantes y usuarios
      </h3>
      {(user === null) &&(
<div>
      <p className="text-gray-600 mb-6">
      Inicia sesión para participar en la comunidad y acceder a todas las publicaciones.
        </p>
      <Link
      to="/login"
      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
      >
      Iniciar sesión
      </Link>

      <Link
      to="/register"
      className="px-6 py-3 border-2 border-rose-500 text-rose-600 rounded-lg hover:bg-rose-50 transition-all font-semibold"
      >
      Registrarse
      </Link>

</div>

      )}
      <div className="flex justify-center gap-4">
      </div>
      </div>

      </>
    }>

        <Outlet />
      </CommunityRoles>
      </div>
    </div>
  );
}
