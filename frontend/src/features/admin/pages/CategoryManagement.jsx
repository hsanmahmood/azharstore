import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../../context/DataContext';
import { SearchContext } from '../../../context/SearchContext';
import { useNotifier } from '../../../context/NotificationContext';
import { apiService } from '../../../services/api';
import SearchBar from '../../../components/common/SearchBar';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import Modal from '../../../components/modals/Modal';
import LoadingScreen from '../../../components/common/LoadingScreen';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import Pagination from '../../../components/common/Pagination';

const CategoryManagement = () => {
  const { t } = useTranslation();
  const { categories, isLoading, error: dataError, addCategory, updateCategory, deleteCategory } = useContext(DataContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const notify = useNotifier();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData(category ? { name: category.name } : { name: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        const updatedCategory = await apiService.updateCategory(editingCategory.id, formData);
        updateCategory(updatedCategory);
        notify(t('categoryManagement.notifications.updated'));
      } else {
        const newCategory = await apiService.createCategory(formData);
        addCategory(newCategory);
        notify(t('categoryManagement.notifications.added'));
      }
      closeModal();
    } catch (err) {
      const errorMsg = err.response?.data?.detail ||
        (editingCategory
          ? t('categoryManagement.errors.update')
          : t('categoryManagement.errors.add'));
      notify(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeletingCategoryId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategoryId) return;
    setIsConfirmModalOpen(false);

    try {
      await apiService.deleteCategory(deletingCategoryId);
      deleteCategory(deletingCategoryId);
      notify(t('categoryManagement.notifications.deleted'));
    } catch (err) {
      notify(t('categoryManagement.errors.delete'), 'error');
      console.error(err);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const filteredCategories = categories.filter(category =>
    category && category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('categoryManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('categoryManagement.addCategory')}
        </button>
      </div>

      <div className="mb-8">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {dataError && !isModalOpen && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">
          {dataError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {paginatedCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-card-background border border-soft-border rounded-20 p-5 flex justify-between items-center transition-all duration-300 hover:border-brand-purple/50 hover:-translate-y-1 ${category.deleting ? 'animate-fade-out' : ''}`}
          >
            <span className="text-lg font-semibold text-text-dark">{category.name}</span>
            <div className="flex gap-3">
              <button
                onClick={() => openModal(category)}
                className="text-text-light hover:text-brand-purple transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => openDeleteConfirm(category.id)}
                className="text-text-light hover:text-stock-red transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? t('categoryManagement.editCategory') : t('categoryManagement.addCategory')}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              {t('categoryManagement.form.name')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            {!isSubmitting && (
              <button
                type="button"
                onClick={closeModal}
                className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
            )}
            <button
              type="submit"
              className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center w-24"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete')}
        message={t('categoryManagement.confirmDelete')}
      />
    </>
  );
};

export default CategoryManagement;
