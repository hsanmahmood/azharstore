import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Package, LogOut, PanelLeft, Menu, Home } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import MobileAdminSidebar from './MobileAdminSidebar';
import { logoUrl } from '../../data/site.js';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change as a fail-safe
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/products', text: 'Products', icon: Package },
    { to: '/admin/categories', text: 'Categories', icon: Box },
  ];

  const getNavLinkClasses = (isOpen) => (to) => {
    const isActive = location.pathname === to;
    return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-purple-600/10 text-purple-400' : 'text-gray-400 hover:bg-purple-600/5 hover:text-white'
    } ${!isOpen ? 'justify-center' : ''}`;
  };

  const getHomeLinkClasses = (isOpen) => `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-400 hover:bg-purple-600/5 hover:text-white ${!isOpen ? 'justify-center' : ''}`;

  const DesktopSidebarContent = () => {
    const isOpen = isDesktopSidebarOpen;

    return (
      <div className="flex flex-col h-full text-white">
        <div className={`flex items-center justify-between p-4 mb-4 border-b border-white/10`}>
          <div className={`flex items-center gap-3 transition-all duration-300 ${!isOpen ? 'opacity-0 w-0 h-0' : 'opacity-100'}`}>
            <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-lg font-bold whitespace-nowrap">{user?.name}</span>
          </div>
        </div>

        <nav className="flex-grow px-2">
          <ul className="space-y-2">
            <li>
              <Link to="/" className={getHomeLinkClasses(isOpen)} title={isOpen ? '' : 'Home'}>
                <Home className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
                <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>Home</span>
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={getNavLinkClasses(isOpen)(link.to)} title={isOpen ? '' : link.text}>
                  <link.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
                  <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-2 py-4 mt-auto">
          <div className="border-t border-white/10 pt-4 space-y-2">
            <button onClick={() => setIsDesktopSidebarOpen(!isOpen)} className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-purple-600/5 hover:text-white rounded-lg transition-colors duration-200 ${!isOpen ? 'justify-center' : ''}`}>
              <PanelLeft className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
              <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>Toggle Sidebar</span>
            </button>
            <button onClick={handleLogout} className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-purple-600/5 hover:text-white rounded-lg transition-colors duration-200 ${!isOpen ? 'justify-center' : ''}`}>
              <LogOut className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
              <span className={`transition-opacity duration-200 whitespace-nowrap ${!isOpen ? 'hidden' : 'delay-200'}`}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <MobileAdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        user={user}
        navLinks={navLinks}
        handleLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:flex-shrink-0 bg-gray-800 border-r border-white/10 transition-all duration-300 ${isDesktopSidebarOpen ? 'w-64' : 'w-20'}`}>
        <DesktopSidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-lg border-b border-white/10 p-4 flex items-center md:hidden">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="text-white">
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
