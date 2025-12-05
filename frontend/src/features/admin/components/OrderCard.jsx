import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import Dropdown from '../../../components/common/Dropdown';
import { apiService } from '../../../services/api';
import { DataContext } from '../../../context/DataContext';
import { useNotifier } from '../../../context/NotificationContext';
import { formatDateGMT3, formatTimeGMT3 } from '../../../utils/dateUtils';

const OrderCard = ({ order, onEdit, onDelete, onView }) => {
  const { t } = useTranslation();
  const notify = useNotifier();
  const { updateOrder, products, appSettings } = useContext(DataContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusChange = async (option) => {
    const newStatus = option.value;
    const originalOrder = { ...order };
    const updatedOrder = { ...order, status: newStatus };

    updateOrder(updatedOrder);

    try {
      await apiService.updateOrder(order.id, { status: newStatus });
      notify(t('orderManagement.notifications.statusUpdated'));
    } catch (error) {
      updateOrder(originalOrder);
      notify(t('orderManagement.errors.statusUpdate'), 'error');
    }
  };

  const handleDelete = () => {
    onDelete(order.id);
  };

  const cardClasses = `
    bg-card-background border border-soft-border rounded-2xl p-4 flex flex-col
    transition-all duration-300 hover:border-brand-purple/50 hover:-translate-y-1
    ${isDropdownOpen ? 'z-20' : 'z-0'}
  `;

  const subtotal = useMemo(() => {
    return order.order_items.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 0;
      let price = 0;

      if (item.product_variant && item.product_variant.price > 0) {
        price = Number(item.product_variant.price) || 0;
      } else if (item.product) {
        price = Number(item.product.price) || 0;
      } else if (item.product_variant && item.product_variant.product) {
        price = Number(item.product_variant.product.price) || 0;
      }

      return acc + (price * quantity);
    }, 0);
  }, [order.order_items]);

  const deliveryFee = subtotal >= appSettings.free_delivery_threshold && appSettings.free_delivery_threshold > 0
    ? 0
    : (order.delivery_fee || 0);
  const total = subtotal + deliveryFee;

  return (
    <div className={cardClasses}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-text-dark flex-1 break-words">
            {t('orderManagement.table.orderId')}: #{order.id}
          </h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onView(order)} className="text-text-light hover:text-brand-purple transition-colors">
              <Eye size={18} />
            </button>
            <button onClick={() => onEdit(order)} className="text-text-light hover:text-brand-purple transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={handleDelete} className="text-text-light hover:text-stock-red transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-sm text-text-light mt-2">
          {t('orderManagement.table.customer')}: {order.customer.name}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDateGMT3(order.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatTimeGMT3(order.created_at)}</span>
          </div>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="w-full">
            <Dropdown
              options={[
                { value: 'processing', label: t('orderManagement.status.processing') },
                { value: 'ready', label: t('orderManagement.status.ready') },
                { value: 'shipped', label: t('orderManagement.status.shipped') },
                { value: 'delivered', label: t('orderManagement.status.delivered') },
                { value: 'cancelled', label: t('orderManagement.status.cancelled') },
              ]}
              value={order.status}
              onChange={handleStatusChange}
              onToggle={setIsDropdownOpen}
            />
          </div>
          <div className="flex items-center gap-2 text-text-light">
            <span>{t('orderManagement.table.shippingMethod')}: {t(`orderManagement.shipping.${order.shipping_method}`)}</span>
          </div>
          <div className="flex items-center gap-2 text-text-light">
            <span>{t('orderManagement.table.total')}: {total.toFixed(2)} د.ب</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
