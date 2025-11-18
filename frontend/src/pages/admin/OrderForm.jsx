import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { orderService } from '../../services/api';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import Dropdown from '../../components/Dropdown';

const OrderForm = ({ order, onSuccess }) => {
  const { t } = useTranslation();
  const { customers, products } = useContext(DataContext);
  const [formData, setFormData] = useState({
    customer_id: '',
    shipping_method: '',
    status: 'processing',
    comments: '',
    order_items: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) {
      setFormData({
        customer_id: order.customer_id,
        shipping_method: order.shipping_method,
        status: order.status,
        comments: order.comments || '',
        order_items: order.order_items ? order.order_items.map(item => {
          const productVariant = products.flatMap(p => p.product_variants).find(pv => pv.id === item.product_variant_id);
          const product = productVariant ? products.find(p => p.id === productVariant.product_id) : null;
          return {
            ...item,
            product_id: product ? product.id : '',
          };
        }) : [],
      });
    }
  }, [order, products]);

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
    newItems[index][field] = value;

    if (field === 'product_id') {
      const product = products.find((p) => p.id === value);
      newItems[index].price = product ? product.price : 0;

      if (product && product.product_variants && product.product_variants.length > 0) {
        newItems[index].product_variant_id = product.product_variants[0].id;
        newItems[index].product_id = null; // Unset product_id if variant is selected
      } else {
        newItems[index].product_variant_id = null; // Unset variant_id if no variants
      }
    }

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

    console.log('Submitting order data:', formData);

    const originalOrder = order ? { ...order } : null;
    const optimisticOrder = {
      ...(originalOrder || {}),
      ...formData,
      id: originalOrder ? originalOrder.id : Date.now(),
      customer: customers.find(c => c.id === formData.customer_id),
      order_items: formData.order_items.map(item => {
        const productVariant = products.flatMap(p => p.product_variants).find(pv => pv.id === item.product_variant_id);
        const product = productVariant ? products.find(p => p.id === productVariant.product_id) : null;
        return {
          ...item,
          product_variant: {
            ...productVariant,
            product: product,
          },
        };
      }),
    };

    try {
      let response;
      if (order) {
        response = await orderService.updateOrder(order.id, formData);
      } else {
        response = await orderService.createOrder(formData);
      }
      onSuccess(response.data);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const errorDetails = err.response.data.detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ');
        setError(`${t('orderManagement.errors.validation')}: ${errorDetails}`);
      } else {
        setError(t('orderManagement.errors.submit'));
      }
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-brand-secondary">
          {t('orderManagement.form.status')}
        </label>
        <Dropdown
          options={[
            { value: 'processing', label: t('orderManagement.status.processing') },
            { value: 'ready', label: t('orderManagement.status.ready') },
            { value: 'delivered', label: t('orderManagement.status.delivered') },
            { value: 'shipped', label: t('orderManagement.status.shipped') },
          ]}
          value={formData.status}
          onChange={(option) => handleDropdownChange('status', option)}
          placeholder={t('orderManagement.form.selectStatus')}
        />
      </div>

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
