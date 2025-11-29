import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreVertical, Eye, Star, Download, Trash2 } from 'lucide-react';

const ImageActionMenu = ({ isPrimary, onRemove, onSetPrimary, onView, onDownload }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="absolute top-1 right-1" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
      >
        <MoreVertical size={12} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-28 bg-white rounded-md shadow-lg z-10 border border-soft-border">
          <ul className="py-1 text-2xs text-text-dark">
            <li>
              <div role="button" onClick={() => handleAction(onView)} className="w-full text-left px-2 py-1 hover:bg-gray-100 cursor-pointer">
                {t('productManagement.actions.view')}
              </div>
            </li>
            {!isPrimary && (
              <li>
                <div role="button" onClick={() => handleAction(onSetPrimary)} className="w-full text-left px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  {t('productManagement.actions.setAsPrimary')}
                </div>
              </li>
            )}
            <li>
              <div role="button" onClick={() => handleAction(onDownload)} className="w-full text-left px-2 py-1 hover:bg-gray-100 cursor-pointer">
                {t('productManagement.actions.download')}
              </div>
            </li>
            <li>
              <div role="button" onClick={() => handleAction(onRemove)} className="w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600 cursor-pointer">
                {t('productManagement.actions.remove')}
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageActionMenu;
