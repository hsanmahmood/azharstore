import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { customerService } from '../../services/api';
import { Loader2 } from 'lucide-react';

const CustomerForm = ({ customer, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    town: '',
    address_home: '',
    address_road: '',
    address_block: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone_number: customer.phone_number,
        town: customer.town || '',
        address_home: customer.address_home || '',
        address_road: customer.address_road || '',
        address_block: customer.address_block || '',
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let response;
      if (customer) {
        response = await customerService.updateCustomer(customer.id, formData);
      } else {
        response = await customerService.createCustomer(formData);
      }
      onSuccess(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(t('customerManagement.errors.submit'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-secondary mb-1">
            {t('customerManagement.form.name')}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-secondary mb-1">
            {t('customerManagement.form.phone')}
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-secondary mb-1">
            {t('customerManagement.form.town')}
          </label>
          <input
            type="text"
            name="town"
            value={formData.town}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
          />
        </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-secondary mb-1">
            {t('customerManagement.form.addressHome')}
          </label>
          <input
            type="text"
            name="address_home"
            value={formData.address_home}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-secondary mb-1">
            {t('customerManagement.form.addressRoad')}
          </label>
          <input
            type="text"
            name="address_road"
            value={formData.address_road}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-secondary mb-1">
            {t('customerManagement.form.addressBlock')}
          </label>
          <input
            type="text"
            name="address_block"
            value={formData.address_block}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-2">
        <button
          type="submit"
          className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2 px-4 rounded-md transition-colors transform active:scale-95 flex items-center justify-center min-w-[100px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
