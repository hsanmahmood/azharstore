import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import CustomerForm from './CustomerForm';
import CustomerCard from './CustomerCard';
import { DataContext } from '../../context/DataContext';
import { SearchContext } from '../../context/SearchContext';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';
import { customerService } from '../../services/api';

const CustomerManagement = () => {
  const { t } = useTranslation();
  const { customers, isLoading, error: dataError, addCustomer, updateCustomer, removeCustomer } = useContext(DataContext);
  const { searchTerm } = useContext(SearchContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);

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
        await customerService.deleteCustomer(deletingCustomerId);
        removeCustomer(deletingCustomerId);
      } catch (err) {
        // TODO: Show an error notification to the user
        console.error("Failed to delete customer", err);
      }
    }
    setIsConfirmModalOpen(false);
    setDeletingCustomerId(null);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {dataError && <div className="text-red-500">{dataError}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={openModal}
            onDelete={() => openDeleteConfirm(customer.id)}
          />
        ))}
      </div>

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
