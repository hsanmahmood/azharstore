import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Layers, LogOut, PanelLeft, Menu, Users, ShoppingCart, Settings, Languages } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import MobileAdminSidebar from '../components/MobileAdminSidebar';
import { SearchProvider } from '../../../context/SearchContext';
import { NotificationProvider } from '../../../context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from '../../../components/common/LoadingScreen';

const AdminLayoutContent = () => {
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

  const adminBasePath = location.pathname.startsWith('/admin') ? '/admin' : '';

  const navLinks = [
    { to: `${adminBasePath}/products`, text: t('admin.nav.products'), icon: Package },
    { to: `${adminBasePath}/categories`, text: t('admin.nav.categories'), icon: Layers },
    { to: `${adminBasePath}/customers`, text: t('admin.nav.customers'), icon: Users },
    { to: `${adminBasePath}/orders`, text: t('orderManagement.title'), icon: ShoppingCart },
    { to: `${adminBasePath}/translations`, text: t('admin.nav.translations'), icon: Languages },
  ];

  const getNavLinkClasses = (isOpen) => (to) => {
    const isActive = location.pathname === to;
    return `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? 'bg-brand-purple/10 text-brand-purple' : 'text-text-light hover:bg-brand-purple/5 hover:text-brand-purple'
      } ${!isOpen ? 'justify-center' : ''}`;
  };

  const DesktopSidebarContent = () => {
    const isOpen = isDesktopSidebarOpen;

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 mb-4 border-b border-soft-border">
          <div className={`transition-all duration-300 ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <img src="/logo.webp" alt="AzharStore Logo" className="h-8" />
          </div>
        </div>

        <nav className="flex-grow px-2">
          <ul className="space-y-2">
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
          <div className="border-t border-soft-border pt-4 space-y-2">
            <NavLink to={`${adminBasePath}/settings`} className={getNavLinkClasses(isDesktopSidebarOpen)(`${adminBasePath}/settings`)} title={isDesktopSidebarOpen ? '' : t('settings.title')}>
              <Settings className={`h-5 w-5 ${isDesktopSidebarOpen ? 'ml-3' : ''}`} />
              <span className={`transition-opacity duration-200 ${!isDesktopSidebarOpen ? 'hidden' : 'delay-200'}`}>{t('settings.title')}</span>
            </NavLink>
            <button
              onClick={() => setIsDesktopSidebarOpen(!isOpen)}
              className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-text-light hover:bg-brand-purple/5 hover:text-brand-purple rounded-lg transition-colors ${!isOpen ? 'justify-center' : ''}`}
            >
              <PanelLeft className={`h-5 w-5 ${isOpen ? 'ml-3' : ''}`} />
              <span className={`transition-opacity duration-200 ${!isOpen ? 'hidden' : 'delay-200'}`}>{t('common.toggleSidebar')}</span>
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2.5 text-sm font-medium text-text-light hover:bg-brand-purple/5 hover:text-brand-purple rounded-lg transition-colors ${!isOpen ? 'justify-center' : ''}`}
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
    <div dir="rtl" className="flex h-screen bg-primary-background text-text-dark font-arabic">
      <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 99999 }} />
      <MobileAdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        navLinks={navLinks}
        handleLogout={handleLogout}
      />

      <aside className={`hidden md:flex md:flex-shrink-0 bg-card-background border-l border-soft-border transition-all duration-300 ${isDesktopSidebarOpen ? 'w-64' : 'w-20'}`}>
        <DesktopSidebarContent />
      </aside>

      <div className="flex flex-col flex-1">
        <header className="sticky top-0 bg-primary-background/80 backdrop-blur-lg flex items-center justify-between">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="text-text-dark md:hidden p-4">
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

const AdminLayout = () => (
  <NotificationProvider>
    <SearchProvider>
      <AdminLayoutContent />
    </SearchProvider>
  </NotificationProvider>
);

export default AdminLayout;
