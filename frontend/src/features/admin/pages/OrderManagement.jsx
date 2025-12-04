import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { apiService } from '../../../services/api';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/modals/Modal';
import LoadingScreen from '../../../components/common/LoadingScreen';
import OrderForm from '../components/OrderForm';
import OrderCard from '../components/OrderCard';
import OrderDetails from '../components/OrderDetails';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import Dropdown from '../../../components/common/Dropdown';
import { DataContext } from '../../../context/DataContext';
import { SearchContext } from '../../../context/SearchContext';
import { useNotifier } from '../../../context/NotificationContext';
import Pagination from '../../../components/common/Pagination';

const OrderManagement = () => {
  const { t } = useTranslation();
  const { orders, customers, products, isLoading, error: dataError, addOrder, updateOrder, removeOrder, setError, setOrders } = useContext(DataContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const notify = useNotifier();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const updateOrderState = (updatedOrder) => {
    updateOrder(updatedOrder);
  };

  const deleteOrder = async (orderId) => {
    try {
      await apiService.deleteOrder(orderId);
      removeOrder(orderId);
      notify(t('orderManagement.notifications.deleted'));
    } catch (err) {
      const errorMsg = err.response?.data?.detail || t('orderManagement.errors.delete');
      notify(errorMsg, 'error');
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
      notify(editingOrder ? t('orderManagement.notifications.updated') : t('orderManagement.notifications.added'));
    } catch (error) {
      const errorMsg = error.response?.data?.detail || t('orderManagement.errors.fetch');
      notify(errorMsg, 'error');
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

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

      <div className="mb-4">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        {paginatedOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onEdit={openModal}
            onView={openDetailsModal}
            onDelete={() => openDeleteConfirm(order.id)}
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
