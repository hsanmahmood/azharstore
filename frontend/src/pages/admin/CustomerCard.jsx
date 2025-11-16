import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  return (
    <div className="bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-brand-primary flex-1 break-words">{customer.name}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(customer)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(customer.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <p className="text-brand-secondary">{customer.phone_number}</p>
          <p className="text-brand-secondary">{customer.town}</p>
          <p className="text-brand-secondary">{`${customer.address_home}, ${customer.address_road}, ${customer.address_block}`}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
