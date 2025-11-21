import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { orderService } from '../../services/api';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import OrderForm from './OrderForm';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';
import ConfirmationModal from '../../components/ConfirmationModal';
import { DataContext } from '../../context/DataContext';

const OrderManagement = () => {
  const { t } = useTranslation();
  const { orders, isLoading, error: dataError, addOrder, updateOrder, removeOrder } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [error, setError] = useState('');

  const updateOrderState = (updatedOrder) => {
    updateOrder(updatedOrder);
  };

  const deleteOrder = async (orderId) => {
    try {
      await orderService.deleteOrder(orderId);
      removeOrder(orderId);
    } catch (err) {
      setError(t('orderManagement.errors.delete'));
    }
  };

  const openModal = (order = null) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const openDetailsModal = (order) => {
    setViewingOrder(order);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleSuccess = async (order) => {
    try {
      const response = await orderService.getOrder(order.id);
      if (editingOrder) {
        updateOrderState(response.data);
      } else {
        addOrder(response.data);
      }
    } catch (error) {
      setError(t('orderManagement.errors.fetch'));
    } finally {
      closeModal();
    }
  };

  const openDeleteConfirm = (id) => {
    setDeletingOrderId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingOrderId) {
      deleteOrder(deletingOrderId);
    }
    setIsConfirmModalOpen(false);
    setDeletingOrderId(null);
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
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onEdit={openModal}
            onView={openDetailsModal}
            onDelete={() => openDeleteConfirm(order.id)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingOrder ? t('orderManagement.editOrder') : t('orderManagement.addOrder')}
        maxWidth="max-w-4xl"
      >
        <OrderForm order={editingOrder} onSuccess={handleSuccess} />
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`${t('orderManagement.table.orderId')} #${viewingOrder ? viewingOrder.id : ''}`}
        maxWidth="max-w-4xl"
      >
        <OrderDetails order={viewingOrder} />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete')}
        message={t('orderManagement.confirmDelete')}
      />
    </>
  );
};

export default OrderManagement;
