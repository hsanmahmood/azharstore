import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateTranslation } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { DataContext } from '../../context/DataContext';
import Modal from '../../components/Modal';
import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';

const Translations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { translations, updateTranslation: updateTranslationInContext } = useContext(DataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [newValue, setNewValue] = useState('');

  const mutation = useMutation(updateTranslation, {
    onSuccess: (data) => {
      updateTranslationInContext(data.data);
      queryClient.invalidateQueries('translations');
      toast.success(t('admin.translations.updateSuccess'));
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error(t('admin.translations.updateError'));
    },
  });

  const handleEditClick = (translation) => {
    setSelectedTranslation(translation);
    setNewValue(translation.value);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    mutation.mutate({ id: selectedTranslation.id, value: newValue });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('admin.translations.title')}</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.translations.key')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('admin.translations.value')}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants}>
              {translations.map((translation) => (
                <motion.tr key={translation.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{translation.key}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{translation.value}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-right">
                    <button onClick={() => handleEditClick(translation)} className="text-blue-500 hover:text-blue-700 font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center">
                      <Edit3 size={16} className="mr-2" />
                      {t('admin.translations.edit')}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('admin.translations.editTitle')}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">{selectedTranslation?.key}</p>
          <textarea
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full px-4 py-2 text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
            {t('admin.translations.cancel')}
          </button>
          <button onClick={handleSave} disabled={mutation.isLoading} className="px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200">
            {mutation.isLoading ? t('admin.translations.saving') : t('admin.translations.save')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Translations;
