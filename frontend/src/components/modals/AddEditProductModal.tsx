import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import apiService from '../../services/productsApi';
import categoriesApiService from '../../services/categoriesApi';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  item: Product | null;
}

const AddEditProductModal: FC<AddEditProductModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApiService.getAll().then(response => setCategories(response.data));
  }, []);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price);
      setStockQuantity(item.stock_quantity);
      setCategoryId(item.category_id);
    } else {
      setName('');
      setDescription('');
      setPrice(0);
      setStockQuantity(0);
      setCategoryId('');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = { name, description, price, stock_quantity: stockQuantity, category_id: categoryId };
      if (item) {
        await apiService.update(item.id, productData);
      } else {
        await apiService.create(productData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? t('admin.products.edit') : t('admin.products.add')}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-brand-secondary mb-2">{t('admin.products.name')}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-brand-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-brand-secondary mb-2">{t('admin.products.description')}</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-brand-primary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-brand-secondary mb-2">{t('admin.products.price')}</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-brand-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stockQuantity" className="block text-brand-secondary mb-2">{t('admin.products.stockQuantity')}</label>
          <input
            type="number"
            id="stockQuantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(parseInt(e.target.value, 10))}
            className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-brand-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-brand-secondary mb-2">{t('admin.products.category')}</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
            className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-brand-primary"
            required
          >
            <option value="">{t('admin.products.selectCategory')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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

export default AddEditProductModal;
