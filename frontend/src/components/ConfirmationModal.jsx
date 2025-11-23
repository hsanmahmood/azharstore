import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="text-text-light flex flex-col items-center text-center">
        <AlertTriangle className="w-16 h-16 text-stock-red mb-4" />
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-text-dark font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-stock-red hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t('common.delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
