import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../../services/api';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/modals/Modal';
import LoadingScreen from '../../../components/common/LoadingScreen';
import OrderCard from '../../admin/components/OrderCard';
import OrderDetails from '../../admin/components/OrderDetails';
import Dropdown from '../../../components/common/Dropdown';
import { DataContext } from '../../../context/DataContext';
import { SearchContext } from '../../../context/SearchContext';
import { useNotifier } from '../../../context/NotificationContext';

const OrdersPage = () => {
  const { t } = useTranslation();
  const { orders, customers, products, isLoading, error: dataError, setOrders } = useContext(DataContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const notify = useNotifier();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getAllOrders();
        setOrders(response.data);
      } catch (error) {
        const errorMsg = error.response?.data?.detail || t('orderManagement.errors.fetch');
        notify(errorMsg, 'error');
      }
    };
    fetchOrders();
  }, [setOrders, notify, t]);

  const openDetailsModal = (order) => {
    setViewingOrder(order);
    setIsDetailsModalOpen(true);
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
        <h1 className="text-3xl font-bold text-brand-primary">{t('delivery.orders.title')}</h1>
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
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onView={openDetailsModal}
          />
        ))}
      </div>

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

export default OrdersPage;
