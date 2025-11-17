import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';

const OrderCard = ({ order, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const cardClasses = `
    bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col
    transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1
  `;

  const total = order.order_items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={cardClasses}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-brand-primary flex-1 break-words">
            {t('orderManagement.table.orderId')}: #{order.id}
          </h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(order)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(order.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-sm text-brand-secondary mt-2">
          {t('orderManagement.table.customer')}: {order.customer.name}
        </p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-brand-secondary">
            <span>{t('orderManagement.table.status')}: {t(`orderManagement.status.${order.status}`)}</span>
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
