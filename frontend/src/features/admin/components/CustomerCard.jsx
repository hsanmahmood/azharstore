import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../../services/api';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (window.confirm(t('customerManagement.confirmDelete', { customerName: customer.name }))) {
      try {
        await apiService.deleteCustomer(customer.id);
        onDelete(customer.id);
      } catch (err) {
        // TODO: Show an error notification to the user
        console.error("Failed to delete customer", err);
      }
    }
  };

  return (
    <div className="bg-card-background border border-soft-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-purple/50 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-text-dark flex-1 break-words">{customer.name}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(customer)} className="text-text-light hover:text-brand-purple transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={handleDelete} className="text-text-light hover:text-stock-red transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <p className="text-text-light">{customer.phone_number}</p>
          <p className="text-text-light">{customer.town}</p>
          <p className="text-text-light">{`${customer.address_home}, ${customer.address_road}, ${customer.address_block}`}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
