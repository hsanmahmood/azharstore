import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Layers, LogOut, PanelLeft, Menu, Home, Users } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import MobileAdminSidebar from './MobileAdminSidebar';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

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
    { to: '/admin/products', text: t('admin.nav.products'), icon: Package },
    { to: '/admin/categories', text: t('admin.nav.categories'), icon: Layers },
    { to: '/admin/customers', text: t('admin.nav.customers'), icon: Users },
  ];

  const getNavLinkClasses = (isOpen) => (to) => {
    const isActive = location.pathname === to;
    return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
    } ${!isOpen ? 'justify-center' : ''}`;
  };

  const DesktopSidebarContent = () => {
    const isOpen = isDesktopSidebarOpen;

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 mb-4 border-b border-brand-border/50">
          <div className={`transition-all duration-300 ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <span className="text-lg font-bold">AzharStore</span>
          </div>
        </div>

        <nav className="flex-grow px-2">
          <ul className="space-y-2">
            <li>
              <Link to="/" className={getNavLinkClasses(isOpen)('/home')} title={isOpen ? '' : t('admin.nav.home')}>
                <Home className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
                <span className={`transition-opacity duration-200 ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('admin.nav.home')}</span>
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={getNavLinkClasses(isOpen)(link.to)} title={isOpen ? '' : link.text}>
                  <link.icon className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
                  <span className={`transition-opacity duration-200 ${!isOpen ? 'hidden' : 'delay-200'}`}>{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-2 py-4 mt-auto">
          <div className="border-t border-brand-border pt-4 space-y-2">
            <button
              onClick={() => setIsDesktopSidebarOpen(!isOpen)}
              className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors ${!isOpen ? 'justify-center' : ''}`}
            >
              <PanelLeft className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
              <span className={`transition-opacity duration-200 ${!isOpen ? 'hidden' : 'delay-200'}`}>طي القائمة</span>
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors ${!isOpen ? 'justify-center' : ''}`}
            >
              <LogOut className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
              <span className={`transition-opacity duration-200 ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('Logout')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div dir="rtl" className="flex h-screen bg-brand-background text-brand-primary font-arabic">
      <MobileAdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        navLinks={navLinks}
        handleLogout={handleLogout}
      />

      <aside className={`hidden md:flex md:flex-shrink-0 bg-black/20 border-l border-brand-border transition-all duration-300 ${isDesktopSidebarOpen ? 'w-64' : 'w-20'}`}>
        <DesktopSidebarContent />
      </aside>

      <div className="flex flex-col flex-1">
        <header className="sticky top-0 bg-brand-background/80 backdrop-blur-lg border-b border-brand-border p-4 flex items-center md:hidden">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="text-brand-primary">
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
