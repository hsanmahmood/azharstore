import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';
import { DataContext } from '../../../context/DataContext';
import { formatDateGMT3, formatTimeGMT3 } from '../../../utils/dateUtils';

const OrderDetails = ({ order }) => {
  const { t } = useTranslation();
  const { products, appSettings } = useContext(DataContext);

  if (!order) return null;

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

  const isFreeDelivery = subtotal >= appSettings.free_delivery_threshold && appSettings.free_delivery_threshold > 0;
  const deliveryFee = isFreeDelivery ? 0 : (order.delivery_fee || 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="p-6 bg-card-background rounded-lg text-text-dark">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-brand-purple mb-4">{t('customerManagement.title')}</h3>
          <div className="space-y-2 text-sm text-text-light">
            <p><span className="font-semibold text-text-dark">{t('customerManagement.form.name')}:</span> {order.customer.name}</p>
            <p><span className="font-semibold text-text-dark">{t('customerManagement.form.phone')}:</span> {order.customer.phone_number}</p>
            <p><span className="font-semibold text-text-dark">{t('customerManagement.form.town')}:</span> {order.customer.town}</p>
            <p><span className="font-semibold text-text-dark">{t('customerManagement.form.address')}:</span> {`${order.customer.address_road}, ${order.customer.address_block}, ${order.customer.address_home}`}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-brand-purple mb-4">{t('orderManagement.title')}</h3>
          <div className="space-y-2 text-sm text-text-light">
            <p><span className="font-semibold text-text-dark">{t('orderManagement.table.orderId')}:</span> #{order.id}</p>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-brand-purple" />
              <span className="font-semibold text-text-dark">{formatDateGMT3(order.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-brand-purple" />
              <span className="font-semibold text-text-dark">{formatTimeGMT3(order.created_at)}</span>
            </div>
            <p><span className="font-semibold text-text-dark">{t('orderManagement.table.status')}:</span> {t(`orderManagement.status.${order.status}`)}</p>
            <p><span className="font-semibold text-text-dark">{t('orderManagement.table.shippingMethod')}:</span> {t(`orderManagement.shipping.${order.shipping_method}`)}</p>
            {order.shipping_method === 'delivery' && (
              <p><span className="font-semibold text-text-dark">{t('settings.deliveryArea')}:</span> {order.delivery_area?.name || t('common.notAvailable')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-brand-purple mb-4">{t('orderManagement.form.orderItems')}</h3>
        <div className="space-y-4">
          {order.order_items.map((item) => {
            const product = item.product || item.product_variant?.product;
            if (!product) {
              return (
                <div key={item.id || Math.random()} className="flex items-center gap-4 p-2 rounded-lg bg-brand-white">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-xs text-text-light">{t('orderManagement.form.productNotFound')}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stock-red">{t('orderManagement.form.productNotFound')}</p>
                  </div>
                </div>
              );
            }

            const variant = item.product_variant;
            const primaryImage = product.product_images?.find(img => img.is_primary);

            const imageUrl = variant?.image_url || primaryImage?.image_url || 'https://via.placeholder.com/80';
            const name = variant ? `${product.name} - ${variant.name}` : product.name;
            let unitPrice = 0;
            if (variant && variant.price > 0) {
              unitPrice = variant.price;
            } else if (product) {
              unitPrice = product.price;
            }

            const lineItemTotal = unitPrice * item.quantity;

            return (
              <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg bg-brand-white">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-text-dark">{name}</p>
                  <p className="text-sm text-text-light">
                    {t('orderManagement.form.unitPrice')}: {unitPrice.toFixed(2)} {t('common.currency')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-light">{t('orderManagement.form.quantity')}</p>
                  <p className="font-semibold text-text-dark">{item.quantity}</p>
                </div>
                <div className="text-right w-28">
                  <p className="text-xs text-text-light">{t('orderManagement.form.total')}</p>
                  <p className="font-semibold text-lg text-text-dark">{lineItemTotal.toFixed(2)} {t('common.currency')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-soft-border pt-6">
        <div className="space-y-2 text-right">
          <p className="text-lg text-text-light"><span className="font-semibold text-text-dark">{t('orderManagement.form.subtotal')}:</span> {subtotal.toFixed(2)} {t('common.currency')}</p>
          {order.shipping_method === 'delivery' && (
            <p className="text-lg text-text-light"><span className="font-semibold text-text-dark">{t('settings.deliveryPrice')}:</span> {deliveryFee.toFixed(2)} {t('common.currency')}
              {isFreeDelivery && <span className="text-sm text-stock-green ml-2">({t('orderManagement.freeDeliveryApplied')})</span>}
            </p>
          )}
          <p className="text-xl font-bold text-text-dark"><span className="font-semibold">{t('orderManagement.form.total')}:</span> {total.toFixed(2)} {t('common.currency')}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
