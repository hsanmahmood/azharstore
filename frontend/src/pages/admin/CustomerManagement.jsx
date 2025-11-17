import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import CustomerForm from './CustomerForm';
import CustomerCard from './CustomerCard';
import { DataContext } from '../../context/DataContext';

const CustomerManagement = () => {
  const { t } = useTranslation();
  const { customers, isLoading, error: dataError, refreshData } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSuccess = () => {
    refreshData();
    closeModal();
  };

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

      {isLoading && <Loader2 className="animate-spin" />}
      {dataError && <div className="text-red-500">{dataError}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={openModal}
            onDelete={() => {
              // Add delete functionality here
            }}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCustomer ? t('customerManagement.editCustomer') : t('customerManagement.addCustomer')}
        maxWidth="max-w-lg"
      >
        <CustomerForm customer={editingCustomer} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
};

export default CustomerManagement;
