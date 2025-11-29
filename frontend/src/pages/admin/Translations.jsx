import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateTranslation, createTranslation } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { DataContext } from '../../context/DataContext';
import Modal from '../../components/Modal';
import { motion } from 'framer-motion';
import { Edit3, PlusCircle } from 'lucide-react';

const Translations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { translations, updateTranslation: updateTranslationInContext, addTranslation } = useContext(DataContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [newTranslation, setNewTranslation] = useState({ lang: 'ar', key: '', value: '' });

  const updateMutation = useMutation(updateTranslation, {
    onSuccess: (data) => {
      updateTranslationInContext(data.data);
      queryClient.invalidateQueries('translations');
      toast.success(t('admin.translations.updateSuccess'));
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error(t('admin.translations.updateError'));
    },
  });

  const createMutation = useMutation(createTranslation, {
    onSuccess: (data) => {
      addTranslation(data.data);
      queryClient.invalidateQueries('translations');
      toast.success('Translation added successfully');
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast.error('Failed to add translation');
    },
  });

  const handleEditClick = (translation) => {
    setSelectedTranslation(translation);
    setNewTranslation({ value: translation.value });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    updateMutation.mutate({ id: selectedTranslation.id, value: newTranslation.value });
  };

  const handleAdd = () => {
    createMutation.mutate(newTranslation);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('admin.translations.title')}</h1>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <PlusCircle size={20} className="mr-2" />
            Add Translation
          </button>
        </div>
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('admin.translations.editTitle')}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">{selectedTranslation?.key}</p>
          <textarea
            value={newTranslation.value}
            onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
            className="w-full px-4 py-2 text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
            {t('admin.translations.cancel')}
          </button>
          <button onClick={handleSave} disabled={updateMutation.isLoading} className="px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200">
            {updateMutation.isLoading ? t('admin.translations.saving') : t('admin.translations.save')}
          </button>
        </div>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Translation">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Key"
            value={newTranslation.key}
            onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
            className="w-full px-4 py-2 text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
          />
          <textarea
            placeholder="Value"
            value={newTranslation.value}
            onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
            className="w-full px-4 py-2 text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
            {t('admin.translations.cancel')}
          </button>
          <button onClick={handleAdd} disabled={createMutation.isLoading} className="px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200">
            {createMutation.isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Translations;
