import React from 'react';
import { Edit } from 'lucide-react';

const TranslationCard = ({ translation, onEdit }) => {
  const cardClasses = `
    bg-card-background border border-soft-border rounded-2xl p-4 flex flex-col justify-between
    transition-all duration-300 hover:border-brand-purple/50 hover:-translate-y-1
  `;

  return (
    <div className={cardClasses}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-medium text-text-light flex-1 break-words">{translation.key}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(translation)} className="text-text-light hover:text-brand-purple transition-colors">
              <Edit size={18} />
            </button>
          </div>
        </div>
        <p className="text-lg font-semibold text-text-dark mt-2 line-clamp-2">{translation.value}</p>
      </div>
    </div>
  );
};

export default TranslationCard;
