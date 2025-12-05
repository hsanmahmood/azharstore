import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, LogOut, Settings } from 'lucide-react';

const MobileAdminSidebar = ({ isOpen, onClose, navLinks, handleLogout }) => {
  const { t } = useTranslation();

  const getNavLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? 'bg-brand-purple/10 text-brand-purple' : 'text-text-light hover:bg-brand-purple/5 hover:text-brand-purple'
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-card-background border-l border-soft-border z-50 transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 mb-4 border-b border-soft-border">
            <img src="/logo.png" alt="AzharStore Logo" className="h-8" />
            <button onClick={onClose} className="text-text-light hover:text-text-dark">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-grow px-2">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} onClick={onClose} className={getNavLinkClasses}>
                    <link.icon className="h-5 w-5 ml-3" />
                    <span>{link.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-2 py-4 mt-auto border-t border-soft-border">
            <NavLink to="/admin/settings" onClick={onClose} className={getNavLinkClasses}>
              <Settings className="h-5 w-5 ml-3" />
              <span>{t('settings.title')}</span>
            </NavLink>
            <button
              onClick={() => {
                onClose();
                handleLogout();
              }}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-text-light hover:bg-brand-purple/5 hover:text-brand-purple rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 ml-3" />
              <span>{t('Logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileAdminSidebar;
