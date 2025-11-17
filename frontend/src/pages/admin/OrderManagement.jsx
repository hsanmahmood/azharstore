import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import { DataContext } from '../../context/DataContext';
import LoadingScreen from '../../components/LoadingScreen';
import OrderForm from './OrderForm';

const OrderManagement = () => {
  const { t } = useTranslation();
  const { orders, isLoading, error: dataError, addOrder, updateOrder } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const openModal = (order = null) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleSuccess = (order) => {
    if (editingOrder) {
      updateOrder(order);
    } else {
      addOrder(order);
    }
    closeModal();
  };

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('orderManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('orderManagement.addOrder')}
        </button>
      </div>

      {dataError && <div className="text-red-500">{dataError}</div>}

      {/* Orders list will be implemented here */}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingOrder ? t('orderManagement.editOrder') : t('orderManagement.addOrder')}
        maxWidth="max-w-4xl"
      >
        <OrderForm order={editingOrder} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
};

export default OrderManagement;
