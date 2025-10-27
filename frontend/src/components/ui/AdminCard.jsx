import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const AdminCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 border border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-bold text-white flex-1 min-w-0 break-words">{item.name}</h3>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => onEdit(item)} className="text-gray-400 hover:text-purple-400 transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
