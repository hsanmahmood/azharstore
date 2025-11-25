import React from 'react';
import { X } from 'lucide-react';

const Lightbox = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Product full view" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"/>
        <button
            onClick={onClose}
            className="absolute -top-4 -right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
        >
            <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
