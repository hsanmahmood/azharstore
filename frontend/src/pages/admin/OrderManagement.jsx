import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { apiService } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import OrderForm from './OrderForm';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';
import ConfirmationModal from '../../components/ConfirmationModal';
import Dropdown from '../../components/Dropdown';
import { DataContext } from '../../context/DataContext';
import { SearchContext } from '../../context/SearchContext';

const OrderManagement = () => {
  const { t } = useTranslation();
  const { orders, customers, products, isLoading, error: dataError, addOrder, updateOrder, removeOrder, setError, setOrders } = useContext(DataContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const updateOrderState = (updatedOrder) => {
    updateOrder(updatedOrder);
  };

  const deleteOrder = async (orderId) => {
    try {
      await apiService.deleteOrder(orderId);
      removeOrder(orderId);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || t('orderManagement.errors.delete');
      setError(errorMsg);
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

  const handleSuccess = async () => {
    try {
      const response = await apiService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t('orderManagement.errors.fetch');
      setError(errorMsg);
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

  const filteredOrders = orders.filter(order => {
    const searchMatch = (order.customer && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.id.toString().includes(searchTerm);
    const customerMatch = selectedCustomer ? order.customer_id === selectedCustomer : true;
    const productMatch = selectedProduct ? order.order_items.some(item => item.product_id === selectedProduct) : true;
    return searchMatch && customerMatch && productMatch;
  });

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

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Dropdown
          options={[{ value: null, label: t('common.allCustomers') }, ...customers.map(c => ({ value: c.id, label: c.name }))]}
          value={selectedCustomer}
          onChange={(option) => setSelectedCustomer(option.value)}
          placeholder={t('common.filterByCustomer')}
        />
        <Dropdown
          options={[{ value: null, label: t('common.allProducts') }, ...products.map(p => ({ value: p.id, label: p.name }))]}
          value={selectedProduct}
          onChange={(option) => setSelectedProduct(option.value)}
          placeholder={t('common.filterByProduct')}
        />
      </div>

      {dataError && <div className="text-red-500">{dataError}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredOrders.map((order) => (
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
