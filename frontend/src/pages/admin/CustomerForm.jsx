import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../services/api';
import { useNotifier } from '../../context/NotificationContext';
import { Loader2 } from 'lucide-react';

const CustomerForm = ({ customer, onSuccess }) => {
  const { t } = useTranslation();
  const notify = useNotifier();
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

    if (formData.phone_number.length !== 8) {
      setError(t('customerManagement.form.phoneValidationError'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    console.log('Submitting customer data:', formData);

    try {
      let response;
      if (customer) {
        response = await apiService.updateCustomer(customer.id, formData);
      } else {
        response = await apiService.createCustomer(formData);
      }
      onSuccess(response.data);
      notify(customer ? t('customerManagement.notifications.updated') : t('customerManagement.notifications.added'));
    } catch (err) {
      const errorMsg = err.response?.data?.detail || t('customerManagement.errors.submit');
      notify(errorMsg, 'error');
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4" dir="rtl">
      {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-light text-right">
          {t('customerManagement.form.name')}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-right placeholder-text-light"
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-light text-right">
          {t('customerManagement.form.phone')}
        </label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-right placeholder-text-light"
          dir="rtl"
        />
        <p className="text-xs text-text-light text-right mt-1">
          {t('customerManagement.form.phoneHint')}
        </p>
      </div>

      <div className="text-right my-4">
        <span className="text-lg text-text-dark">{t('customerManagement.form.address')}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-text-light text-right">
            {t('customerManagement.form.addressRoad')}
          </label>
          <input
            type="text"
            name="address_road"
            value={formData.address_road}
            onChange={handleChange}
            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right placeholder-text-light"
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-text-light text-right">
            {t('customerManagement.form.addressHome')}
          </label>
          <input
            type="text"
            name="address_home"
            value={formData.address_home}
            onChange={handleChange}
            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right placeholder-text-light"
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-text-light text-right">
            {t('customerManagement.form.addressBlock')}
          </label>
          <input
            type="text"
            name="address_block"
            value={formData.address_block}
            onChange={handleChange}
            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right placeholder-text-light"
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-text-light text-right">
            {t('customerManagement.form.town')}
          </label>
          <input
            type="text"
            name="town"
            value={formData.town}
            onChange={handleChange}
            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right placeholder-text-light"
            dir="rtl"
          />
        </div>
      </div>

      <div className="flex justify-start gap-4 pt-4">
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
