import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import apiService from '../../services/categoriesApi';

interface Category {
  id: number;
  name: string;
}

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  item: Category | null;
}

const AddEditCategoryModal: FC<AddEditCategoryModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
    } else {
      setName('');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (item) {
        await apiService.update(item.id, { name });
      } else {
        await apiService.create({ name });
      }
      onSave();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? t('admin.categories.edit') : t('admin.categories.add')}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-brand-secondary mb-2">{t('admin.categories.name')}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-brand-primary"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2 px-4 rounded-lg transition-colors">
            {t('common.cancel')}
          </button>
          <button type="submit" className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-bold py-2 px-4 rounded-lg transition-colors">
            {t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditCategoryModal;
