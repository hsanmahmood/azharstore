import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/modals/Modal';
import CustomerForm from '../components/CustomerForm';
import CustomerCard from '../components/CustomerCard';
import { DataContext } from '../../../context/DataContext';
import { SearchContext } from '../../../context/SearchContext';
import { useNotifier } from '../../../context/NotificationContext';
import LoadingScreen from '../../../components/common/LoadingScreen';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { apiService } from '../../../services/api';
import Pagination from '../../../components/common/Pagination';

const CustomerManagement = () => {
  const { t } = useTranslation();
  const { customers, isLoading, error: dataError, addCustomer, updateCustomer, removeCustomer } = useContext(DataContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const notify = useNotifier();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSuccess = (customer) => {
    if (editingCustomer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
    closeModal();
  };

  const openDeleteConfirm = (id) => {
    setDeletingCustomerId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingCustomerId) {
      try {
        await apiService.deleteCustomer(deletingCustomerId);
        removeCustomer(deletingCustomerId);
        notify(t('customerManagement.notifications.deleted'));
      } catch (err) {
        notify(t('customerManagement.errors.delete'), 'error');
        console.error("Failed to delete customer", err);
      }
    }
    setIsConfirmModalOpen(false);
    setDeletingCustomerId(null);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('customerManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('customerManagement.addCustomer')}
        </button>
      </div>

      <div className="mb-8">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {dataError && <div className="text-red-500">{dataError}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={openModal}
            onDelete={() => openDeleteConfirm(customer.id)}
          />
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
        title={editingCustomer ? t('customerManagement.editCustomer') : t('customerManagement.addCustomer')}
        maxWidth="max-w-2xl"
      >
        <CustomerForm customer={editingCustomer} onSuccess={handleSuccess} />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete')}
        message={t('customerManagement.confirmDelete')}
      />
    </>
  );
};

export default CustomerManagement;
