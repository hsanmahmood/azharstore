import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import Section from '../../components/ui/Section';
import AdminCard from '../../components/ui/AdminCard';
import Modal from '../../components/ui/Modal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (category = null) => {
    setSelectedCategory(category);
    reset(category ? { name: category.name } : { name: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const openConfirmModal = (category) => {
    setSelectedCategory(category);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedCategory(null);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);
      } else {
        await createCategory(data);
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory.id);
      fetchCategories();
      closeConfirmModal();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <Section
      title="Categories"
      subtitle="Manage your product categories."
    >
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {isLoading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <AdminCard
              key={cat.id}
              item={cat}
              onEdit={() => openModal(cat)}
              onDelete={() => openConfirmModal(cat)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-400">Category Name</label>
            <input
              id="name"
              {...register('name')}
              className="w-full px-4 py-2.5 bg-gray-700 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-800">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the category "${selectedCategory?.name}"?`}
      />
    </Section>
  );
};

export default CategoriesPage;
