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
      if (customer) {
        await customerService.updateCustomer(customer.id, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      onSuccess();
    } catch (err) {
      setError(t('customerManagement.errors.submit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-secondary mb-2">
            {t('customerManagement.form.name')}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-secondary mb-2">
            {t('customerManagement.form.phone')}
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-secondary mb-2">
          {t('customerManagement.form.town')}
        </label>
        <input
          type="text"
          name="town"
          value={formData.town}
          onChange={handleChange}
          className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-secondary mb-2">
            {t('customerManagement.form.addressHome')}
          </label>
          <input
            type="text"
            name="address_home"
            value={formData.address_home}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-secondary mb-2">
            {t('customerManagement.form.addressRoad')}
          </label>
          <input
            type="text"
            name="address_road"
            value={formData.address_road}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-secondary mb-2">
            {t('customerManagement.form.addressBlock')}
          </label>
          <input
            type="text"
            name="address_block"
            value={formData.address_block}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
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

export default CustomerForm;
