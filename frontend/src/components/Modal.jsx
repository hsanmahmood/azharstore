import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-3xl' }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={`bg-brand-white border border-brand-border rounded-20 shadow-card w-full ${maxWidth} m-auto flex flex-col max-h-[90vh] animate-modal-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-brand-border">
          <h2 className="text-xl font-bold text-text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-light hover:text-text-dark transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow text-text-dark scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
