import { Outlet } from 'react-router';
import Navbar from './navbar/Navbar';
import Footer from './footer/footer';
import SidebarContainer from './sidebar/SidebarContainer';

type LayoutProps = {
  children?: React.ReactNode;
  showSidebar?: boolean;
};

export function Layout({ children, showSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar variant="light" fill={true} />
      <div className="flex flex-1">
        {showSidebar && <SidebarContainer />}
        <main className={`flex-grow pt-16 ${showSidebar ? 'md:ml-64' : ''}`}>
          {children || <Outlet />}
        </main>
      </div>
      <Footer />
    </div>
  );
}