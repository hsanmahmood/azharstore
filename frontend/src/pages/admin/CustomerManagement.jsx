import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import CustomerForm from './CustomerForm';
import { customerService } from '../../services/api';

const CustomerManagement = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (err) {
      setError(t('customerManagement.errors.fetch'));
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSuccess = () => {
    fetchCustomers();
    closeModal();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('customerManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('customerManagement.addCustomer')}
        </button>
      </div>

      {isLoading && <Loader2 className="animate-spin" />}
      {error && <div className="text-red-500">{error}</div>}

      <div className="bg-black/20 border border-brand-border rounded-lg p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="p-4 text-left">{t('customerManagement.table.name')}</th>
              <th className="p-4 text-left">{t('customerManagement.table.phone')}</th>
              <th className="p-4 text-left">{t('customerManagement.table.town')}</th>
              <th className="p-4 text-left">{t('customerManagement.table.address')}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-brand-border">
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.phone_number}</td>
                <td className="p-4">{customer.town}</td>
                <td className="p-4">{`${customer.address_home}, ${customer.address_road}, ${customer.address_block}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCustomer ? t('customerManagement.editCustomer') : t('customerManagement.addCustomer')}
      >
        <CustomerForm customer={editingCustomer} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
};

export default CustomerManagement;
