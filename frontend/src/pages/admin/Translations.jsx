import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateTranslation, createTranslation } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { DataContext } from '../../context/DataContext';
import Modal from '../../components/Modal';
import { Edit3, PlusCircle, Search } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

const Translations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { translations, updateTranslation: updateTranslationInContext, addTranslation, isLoading } = useContext(DataContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [newTranslation, setNewTranslation] = useState({ lang: 'ar', key: '', value: '' });
  const [searchTerm, setSearchTerm] = useState('');

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
      toast.success(t('admin.translations.addSuccess'));
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast.error(t('admin.translations.addError'));
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

  const filteredTranslations = translations.filter(
    (translation) =>
      translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-primary">{t('admin.translations.title')}</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <PlusCircle size={20} className="mr-2" />
          {t('admin.translations.add')}
        </button>
      </div>
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('admin.translations.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-soft-border text-text-dark p-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
          />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('admin.translations.key')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('admin.translations.value')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTranslations.map((translation) => (
              <tr key={translation.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 border-b border-gray-200 text-sm">{translation.key}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">{translation.value}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-right">
                  <button
                    onClick={() => handleEditClick(translation)}
                    className="text-brand-purple hover:text-brand-purple/80 font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                  >
                    <Edit3 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('admin.translations.editTitle')}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">{selectedTranslation?.key}</p>
          <textarea
            value={newTranslation.value}
            onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
            className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t('admin.translations.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isLoading}
            className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-[120px]"
          >
            {updateMutation.isLoading ? t('admin.translations.saving') : t('admin.translations.save')}
          </button>
        </div>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('admin.translations.addTitle')}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t('admin.translations.key')}
            value={newTranslation.key}
            onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
            className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
          />
          <textarea
            placeholder={t('admin.translations.value')}
            value={newTranslation.value}
            onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
            className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors"
          >
            {t('admin.translations.cancel')}
          </button>
          <button
            onClick={handleAdd}
            disabled={createMutation.isLoading}
            className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-[120px]"
          >
            {createMutation.isLoading ? t('admin.translations.adding') : t('admin.translations.add')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Translations;
