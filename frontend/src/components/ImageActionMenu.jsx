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
    <div className="absolute top-2 right-2" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-soft-border">
          <ul className="py-1 text-sm text-text-dark">
            <li>
              <button onClick={() => handleAction(onView)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <Eye size={16} /> {t('productManagement.actions.view')}
              </button>
            </li>
            {!isPrimary && (
              <li>
                <button onClick={() => handleAction(onSetPrimary)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <Star size={16} /> {t('productManagement.actions.setAsPrimary')}
                </button>
              </li>
            )}
            <li>
              <button onClick={() => handleAction(onDownload)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <Download size={16} /> {t('productManagement.actions.download')}
              </button>
            </li>
            <li>
              <button onClick={() => handleAction(onRemove)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600">
                <Trash2 size={16} /> {t('productManagement.actions.remove')}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageActionMenu;
