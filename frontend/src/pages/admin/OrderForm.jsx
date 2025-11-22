import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { apiService } from '../../services/api';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import Dropdown from '../../components/Dropdown';

const OrderForm = ({ order, onSuccess }) => {
  const { t } = useTranslation();
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
      setFormData({
        customer_id: currentOrder.customer_id,
        shipping_method: currentOrder.shipping_method,
        status: currentOrder.status,
        comments: currentOrder.comments || '',
        order_items: currentOrder.order_items
          ? currentOrder.order_items.map((item) => {
              const product = products.find(p =>
                (item.product_id && p.id === item.product_id) ||
                (item.product_variant_id && p.product_variants.some(v => v.id === item.product_variant_id))
              );
              return {
                ...item,
                product_id: product ? product.id : null,
              };
            })
          : [],
        delivery_area_id: currentOrder.delivery_area_id,
        delivery_fee: currentOrder.delivery_fee,
      });
    }
  }, [order, orders, products]);

  useEffect(() => {
    const subtotal = formData.order_items.reduce((acc, item) => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) return acc;

      const variant = item.product_variant_id
        ? product.product_variants.find(v => v.id === item.product_variant_id)
        : null;

      const price = variant ? variant.price : product.price;
      return acc + (price * item.quantity);
    }, 0);

    const selectedArea = deliveryAreas.find(a => a.id === formData.delivery_area_id);

    let newDeliveryFee = 0;
    let newDeliveryAreaId = formData.delivery_area_id;

    if (formData.shipping_method === 'delivery' && selectedArea) {
      const freeDeliveryThreshold = appSettings?.free_delivery_threshold || 0;
      if (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) {
        newDeliveryFee = 0;
      } else {
        newDeliveryFee = selectedArea.price;
      }
    } else if (formData.shipping_method !== 'delivery') {
      newDeliveryAreaId = null;
    }

    setFormData(prev => ({
      ...prev,
      delivery_fee: newDeliveryFee,
      delivery_area_id: newDeliveryAreaId,
    }));
  }, [formData.order_items, formData.delivery_area_id, formData.shipping_method, deliveryAreas, appSettings]);

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
          <label className="block text-sm font-medium text-brand-secondary">
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
          <label className="block text-sm font-medium text-brand-secondary">
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
          <label className="block text-sm font-medium text-brand-secondary">
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
        <label className="block text-sm font-medium text-brand-secondary">
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

      {formData.shipping_method === 'delivery' && formData.delivery_fee === 0 && appSettings.free_delivery_threshold > 0 && (
        <div className="text-sm text-green-500 bg-green-500/10 p-3 rounded-lg text-center">
          {t('orderManagement.freeDeliveryApplied')}
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-brand-primary mb-4">{t('orderManagement.form.orderItems')}</h3>
        <div className="space-y-4">
          {formData.order_items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-2 rounded-lg bg-black/20">
              <div className="flex-1">
                <Dropdown
                  options={products.map((p) => ({ value: p.id, label: p.name }))}
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
                className="w-20 bg-black/30 border border-brand-border text-brand-primary p-2 rounded-lg"
                min="1"
              />
              <button type="button" onClick={() => removeOrderItem(index)} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOrderItem}
            className="flex items-center gap-2 text-sm text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> {t('orderManagement.form.addProduct')}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-brand-secondary">
          {t('orderManagement.form.comments')}
        </label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          rows="3"
          className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg"
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
