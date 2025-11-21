import React from 'react';
import { useTranslation } from 'react-i18next';

const OrderDetails = ({ order }) => {
  const { t } = useTranslation();

  if (!order) return null;

  const subtotal = order.order_items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = order.delivery_fee || 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="p-6 bg-black/20 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-brand-primary mb-4">{t('customerManagement.title')}</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">{t('customerManagement.form.name')}:</span> {order.customer.name}</p>
            <p><span className="font-semibold">{t('customerManagement.form.phone')}:</span> {order.customer.phone_number}</p>
            <p><span className="font-semibold">{t('customerManagement.form.town')}:</span> {order.customer.town}</p>
            <p><span className="font-semibold">{t('customerManagement.form.address')}:</span> {`${order.customer.address_road}, ${order.customer.address_block}, ${order.customer.address_home}`}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-brand-primary mb-4">{t('orderManagement.title')}</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">{t('orderManagement.table.orderId')}:</span> #{order.id}</p>
            <p><span className="font-semibold">{t('orderManagement.table.status')}:</span> {t(`orderManagement.status.${order.status}`)}</p>
            <p><span className="font-semibold">{t('orderManagement.table.shippingMethod')}:</span> {t(`orderManagement.shipping.${order.shipping_method}`)}</p>
            {order.shipping_method === 'delivery' && (
              <p><span className="font-semibold">{t('settings.deliveryArea')}:</span> {order.delivery_area?.name || t('common.notAvailable')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-brand-primary mb-4">{t('orderManagement.form.orderItems')}</h3>
        <div className="space-y-4">
          {order.order_items.map((item) => {
            if (!item || !item.product_variant || !item.product_variant.product) {
              return (
                <div key={item.id || Math.random()} className="flex items-center gap-4 p-2 rounded-lg bg-black/30">
                  <div className="w-20 h-20 bg-black/40 rounded-lg flex items-center justify-center">
                    <p className="text-xs text-brand-secondary">{t('orderManagement.form.productNotFound')}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-500">{t('orderManagement.form.productNotFound')}</p>
                  </div>
                </div>
              );
            }

            const variant = item.product_variant;
            const product = variant.product;
            const primaryImage = product.product_images?.find(img => img.is_primary);

            const imageUrl = variant.image_url || primaryImage?.image_url || 'https://via.placeholder.com/80';
            const name = `${product.name} - ${variant.name}`;

            return (
              <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg bg-black/30">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-brand-secondary">{t('productManagement.form.price')}: {item.price.toFixed(2)} {t('common.currency')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{t('productManagement.form.stock')}: {item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-brand-border/50 pt-6">
        <div className="space-y-2 text-right">
          <p className="text-lg"><span className="font-semibold">{t('orderManagement.form.subtotal')}:</span> {subtotal.toFixed(2)} {t('common.currency')}</p>
          {order.shipping_method === 'delivery' && order.delivery_area && (
            <>
              <p className="text-lg"><span className="font-semibold">{t('settings.deliveryPrice')}:</span> {deliveryFee.toFixed(2)} {t('common.currency')}
                {deliveryFee === 0 && <span className="text-sm text-green-400 ml-2">({t('orderManagement.freeDeliveryApplied')})</span>}
              </p>
              <p className="text-sm text-brand-secondary">{t('settings.deliveryArea')}: {order.delivery_area.name} ({t('settings.freeDeliveryMinimum')}: {order.delivery_area.min_for_free_delivery.toFixed(2)} {t('common.currency')})</p>
            </>
          )}
          <p className="text-xl font-bold"><span className="font-semibold">{t('orderManagement.form.total')}:</span> {total.toFixed(2)} {t('common.currency')}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
