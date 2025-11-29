import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../../context/DataContext';
import { apiService } from '../../../services/api';
import { useNotifier } from '../../../context/NotificationContext';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import Dropdown from '../../../components/common/Dropdown';

const OrderForm = ({ order, onSuccess }) => {
  const { t } = useTranslation();
  const notify = useNotifier();
  const { customers, products, deliveryAreas, appSettings, orders } = useContext(DataContext);
  const [formData, setFormData] = useState({
    customer_id: '',
    shipping_method: '',
    status: 'processing',
    comments: '',
    order_items: [],
    delivery_area_id: null,
    delivery_fee: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) {
      const currentOrder = orders.find(o => o.id === order.id) || order;

      const processedOrderItems = (currentOrder.order_items || []).map(item => {
        if (item.product_variant_id && !item.product_id) {
          for (const product of products) {
            if (product.product_variants && product.product_variants.some(v => v.id === item.product_variant_id)) {
              return { ...item, product_id: product.id };
            }
          }
        }
        return item;
      });

      setFormData({
        customer_id: currentOrder.customer_id || '',
        shipping_method: currentOrder.shipping_method || '',
        status: currentOrder.status || 'processing',
        comments: currentOrder.comments || '',
        order_items: processedOrderItems,
        delivery_area_id: currentOrder.delivery_area_id || null,
        delivery_fee: currentOrder.delivery_fee || 0,
      });
    }
  }, [order, orders, products]);

  const subtotal = useMemo(() => {
    return formData.order_items.reduce((acc, item) => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) return acc;
      const variant = item.product_variant_id
        ? product.product_variants.find(v => v.id === item.product_variant_id)
        : null;
      const price = variant ? variant.price : product.price;
      return acc + (price * item.quantity);
    }, 0);
  }, [formData.order_items, products]);

  useEffect(() => {
    const selectedArea = deliveryAreas.find(a => a.id === formData.delivery_area_id);

    let newDeliveryFee = formData.delivery_fee;
    if (formData.shipping_method === 'delivery' && selectedArea) {
      const freeDeliveryThreshold = appSettings?.free_delivery_threshold || 0;
      if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
        newDeliveryFee = 0;
      } else {
        newDeliveryFee = selectedArea.price;
      }
    } else if (formData.shipping_method !== 'delivery') {
      newDeliveryFee = 0;
    }
    setFormData(prev => ({
      ...prev,
      delivery_fee: newDeliveryFee,
    }));
  }, [subtotal, formData.delivery_area_id, formData.shipping_method, deliveryAreas, appSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, option) => {
    setFormData((prev) => ({ ...prev, [name]: option.value }));
  };

  const addOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      order_items: [...prev.order_items, { product_id: null, product_variant_id: null, quantity: 1, price: 0 }],
    }));
  };

  const removeOrderItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      order_items: prev.order_items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.order_items];
    const currentItem = { ...newItems[index] };
    currentItem[field] = value;

    if (field === 'product_id') {
      currentItem.product_variant_id = null; // Reset variant when product changes
    }

    newItems[index] = currentItem;
    setFormData((prev) => ({ ...prev, order_items: newItems }));
  };

  const getProductVariants = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.product_variants || product.product_variants.length === 0) {
      return [{ value: null, label: t('orderManagement.form.noVariants') }];
    }
    return product.product_variants.map((v) => ({ value: v.id, label: v.name }));
  };

  const getItemPrice = (item) => {
    const product = products.find(p => p.id === item.product_id);
    if (!product) return 0;
    if (item.product_variant_id) {
      const variant = product.product_variants.find(v => v.id === item.product_variant_id);
      return variant ? variant.price : 0;
    }
    return product.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const order_items = formData.order_items
      .filter(item => item.product_id)
      .map(item => ({
        product_id: item.product_variant_id ? null : item.product_id,
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
      }));

    const payload = { ...formData, order_items };

    try {
      if (order) {
        await apiService.updateOrder(order.id, payload);
      } else {
        await apiService.createOrder(payload);
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || t('orderManagement.errors.submit');
      notify(errorMsg, 'error');
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-light">
            {t('orderManagement.form.customer')}
          </label>
          <Dropdown
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
            value={formData.customer_id}
            onChange={(option) => handleDropdownChange('customer_id', option)}
            placeholder={t('orderManagement.form.selectCustomer')}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-light">
            {t('orderManagement.form.shippingMethod')}
          </label>
          <Dropdown
            options={[
              { value: 'delivery', label: t('orderManagement.shipping.delivery') },
              { value: 'pick_up', label: t('orderManagement.shipping.pick_up') },
            ]}
            value={formData.shipping_method}
            onChange={(option) => handleDropdownChange('shipping_method', option)}
            placeholder={t('orderManagement.form.selectShippingMethod')}
          />
        </div>
      </div>

      {formData.shipping_method === 'delivery' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-light">
            {t('settings.deliveryArea')}
          </label>
          <Dropdown
            options={deliveryAreas.map((a) => ({ value: a.id, label: `${a.name} (${a.price} ${t('common.currency')})` }))}
            value={formData.delivery_area_id}
            onChange={(option) => handleDropdownChange('delivery_area_id', option)}
            placeholder={t('settings.selectArea')}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-light">
          {t('orderManagement.form.status')}
        </label>
        <Dropdown
          options={[
            { value: 'processing', label: t('orderManagement.status.processing') },
            { value: 'ready', label: t('orderManagement.status.ready') },
            { value: 'shipped', label: t('orderManagement.status.shipped') },
            { value: 'delivered', label: t('orderManagement.status.delivered') },
            { value: 'cancelled', label: t('orderManagement.status.cancelled') },
          ]}
          value={formData.status}
          onChange={(option) => handleDropdownChange('status', option)}
          placeholder={t('orderManagement.form.selectStatus')}
        />
      </div>

      {formData.shipping_method === 'delivery' &&
        appSettings.free_delivery_threshold > 0 &&
        subtotal >= appSettings.free_delivery_threshold && (
          <div className="text-sm text-stock-green bg-stock-green/10 p-3 rounded-lg text-center">
            {t('orderManagement.freeDeliveryApplied')}
          </div>
        )}

      <div>
        <h3 className="text-lg font-medium text-brand-purple mb-4">{t('orderManagement.form.orderItems')}</h3>
        <div className="space-y-4">
          {formData.order_items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-card-background">
              <div className="flex-1">
                <Dropdown
                  options={products.map((p) => ({ value: p.id, label: `${p.name} (${p.price} ${t('common.currency')})` }))}
                  value={item.product_id}
                  onChange={(option) => handleItemChange(index, 'product_id', option.value)}
                  placeholder={t('orderManagement.form.selectProduct')}
                />
              </div>
              <div className="w-48">
                <Dropdown
                  options={getProductVariants(item.product_id)}
                  value={item.product_variant_id}
                  onChange={(option) => handleItemChange(index, 'product_variant_id', option.value)}
                  placeholder={t('orderManagement.form.selectVariant')}
                  disabled={!item.product_id || (getProductVariants(item.product_id).length === 1 && getProductVariants(item.product_id)[0].value === null)}
                />
              </div>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                className="w-20 bg-brand-white border border-soft-border text-text-dark p-2 rounded-lg"
                min="1"
              />
              <button type="button" onClick={() => removeOrderItem(index)} className="text-stock-red">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOrderItem}
            className="flex items-center gap-2 text-sm text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> {t('orderManagement.form.addProduct')}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-light">
          {t('orderManagement.form.comments')}
        </label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          rows="3"
          className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg"
        />
      </div>


      <div className="flex justify-end gap-4 pt-4">
        <button
          type="submit"
          className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-[120px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
