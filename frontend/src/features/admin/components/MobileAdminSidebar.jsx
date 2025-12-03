import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Home, LogOut } from 'lucide-react';

const MobileAdminSidebar = ({ isOpen, onClose, navLinks, handleLogout }) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-black/50 backdrop-blur-lg border-l border-brand-border z-50 transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 mb-4 border-b border-brand-border/50">
            <img src="/logo.png" alt="AzharStore Logo" className="h-8" />
            <button onClick={onClose} className="text-brand-secondary hover:text-brand-primary">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-grow px-2">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                        isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary'
                      }`
                    }
                  >
                    <link.icon className="h-5 w-5 ml-3" />
                    <span>{link.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-2 py-4 mt-auto border-t border-brand-border">
            <button
              onClick={() => {
                onClose();
                handleLogout();
              }}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg"
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
