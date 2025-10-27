import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import Section from '../ui/Section';
import LoadingScreen from '../ui/LoadingScreen';
import ConfirmationModal from '../ui/ConfirmationModal';

interface ApiService {
  getAll: () => Promise<any[]>;
  delete: (id: number) => Promise<void>;
}

interface Item {
  id: number;
  [key: string]: any;
}

interface CrudPageLayoutProps {
  title: string;
  apiService: ApiService;
  CardComponent: FC<{ item: Item; onEdit: (item: Item) => void; onDelete: (id: number) => void }>;
  ModalComponent: FC<{ isOpen: boolean; onClose: () => void; onSave: () => void; item: Item | null }>;
}

const CrudPageLayout: FC<CrudPageLayoutProps> = ({ title, apiService, CardComponent, ModalComponent }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getAll();
      setItems(data);
    } catch (error) {
      console.error(`Failed to fetch ${title}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item: Item | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    fetchItems();
    handleCloseModal();
  };

  const openDeleteConfirm = (id: number) => {
    setDeletingItemId(id);
    setIsConfirmModalOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeletingItemId(null);
    setIsConfirmModalOpen(false);
  };

  const handleDelete = async () => {
    if (deletingItemId === null) return;
    try {
      await apiService.delete(deletingItemId);
      fetchItems();
    } catch (error) {
      console.error(`Failed to delete ${title}:`, error);
    } finally {
      closeDeleteConfirm();
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Section title={title}>
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-brand-primary">{title}</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>{t('common.add')} {title}</span>
        </button>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-black/10 rounded-2xl">
          <p className="text-brand-secondary">{t('common.noData')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <CardComponent
              key={item.id}
              item={item}
              onEdit={() => handleOpenModal(item)}
              onDelete={() => openDeleteConfirm(item.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          item={editingItem}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={closeDeleteConfirm}
          onConfirm={handleDelete}
          title={`${t('common.delete')} ${title}`}
          message={t('common.deleteConfirmation')}
        />
      )}
    </Section>
  );
};

export default CrudPageLayout;
