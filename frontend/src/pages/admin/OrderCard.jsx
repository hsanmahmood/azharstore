import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Eye } from 'lucide-react';
import Dropdown from '../../components/Dropdown';
import { apiService } from '../../services/api';
import { DataContext } from '../../context/DataContext';

const OrderCard = ({ order, onEdit, onDelete, onView }) => {
  const { t } = useTranslation();
  const { updateOrder, products } = useContext(DataContext);

  const handleStatusChange = async (option) => {
    const newStatus = option.value;
    const originalOrder = { ...order };
    const updatedOrder = { ...order, status: newStatus };

    updateOrder(updatedOrder);

    try {
      await apiService.updateOrder(order.id, { status: newStatus });
    } catch (error) {
      updateOrder(originalOrder);
      // You might want to show an error message to the user
    }
  };

  const handleDelete = () => {
    onDelete(order.id);
  };

  const cardClasses = `
    bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col
    transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1
  `;

  const subtotal = useMemo(() => {
    return order.order_items.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 0;
      let price = 0;

      if (item.product_variant) {
        price = Number(item.product_variant.price) || 0;
      } else if (item.product) {
        price = Number(item.product.price) || 0;
      }

      return acc + (price * quantity);
    }, 0);
  }, [order.order_items]);

  const total = subtotal + (order.delivery_fee || 0);

  return (
    <div className={cardClasses}>
      <pre className="text-xs text-white bg-gray-800 p-2 rounded-md overflow-auto">
        {JSON.stringify(order, null, 2)}
      </pre>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-brand-primary flex-1 break-words">
            {t('orderManagement.table.orderId')}: #{order.id}
          </h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onView(order)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Eye size={18} />
            </button>
            <button onClick={() => onEdit(order)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={handleDelete} className="text-brand-secondary hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-sm text-brand-secondary mt-2">
          {t('orderManagement.table.customer')}: {order.customer.name}
        </p>
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
            />
          </div>
          <div className="flex items-center gap-2 text-brand-secondary">
            <span>{t('orderManagement.table.shippingMethod')}: {t(`orderManagement.shipping.${order.shipping_method}`)}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-secondary">
            <span>{t('orderManagement.table.total')}: {total.toFixed(2)} د.ب</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
