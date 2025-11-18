import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { orderService } from '../../services/api';
import Modal from '../../components/Modal';
import { DataContext } from '../../context/DataContext';
import LoadingScreen from '../../components/LoadingScreen';
import OrderForm from './OrderForm';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';

const OrderManagement = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders();
        setOrders(response.data);
      } catch (err) {
        setError(t('orderManagement.errors.fetch'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = (updatedOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
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

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onEdit={openModal}
            onView={openDetailsModal}
            onDelete={() => {
              // Add delete functionality here
            }}
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
    </>
  );
};

export default OrderManagement;
