import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateTranslation, createTranslation } from '../../../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { DataContext } from '../../../context/DataContext';
import Modal from '../../../components/modals/Modal';
import { Search } from 'lucide-react';
import LoadingScreen from '../../../components/common/LoadingScreen';
import Dropdown from '../../../components/common/Dropdown';
import TranslationCard from '../components/TranslationCard';

const Translations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { translations, updateTranslation: updateTranslationInContext, addTranslation, isLoading } = useContext(DataContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [newTranslation, setNewTranslation] = useState({ key: '', value: '' });
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

  const translationKeys = [...new Set(translations.map((t) => t.key))];

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('admin.translations.title')}</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTranslations.map((translation) => (
          <TranslationCard key={translation.id} translation={translation} onEdit={handleEditClick} />
        ))}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('admin.translations.editTitle')} maxWidth="max-w-md">
        <div className="space-y-4 p-2">
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

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('admin.translations.addTitle')} maxWidth="max-w-md">
        <div className="space-y-4 p-2">
          <Dropdown
            options={translationKeys.map((key) => ({ value: key, label: key }))}
            value={newTranslation.key}
            onChange={(option) => setNewTranslation({ ...newTranslation, key: option.value })}
            placeholder={t('admin.translations.key')}
            isSearchable={true}
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
    </>
  );
};

export default Translations;
