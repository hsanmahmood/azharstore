import React from 'react';
import { Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TranslationCard = ({ translation, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="text-sm font-medium text-gray-500">{translation.key}</div>
        <div className="text-lg font-semibold text-gray-800 mt-1">{translation.value}</div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => onEdit(translation)}
          className="text-brand-purple hover:text-brand-purple/80 p-2 rounded-full transition-colors duration-200"
        >
          <Edit3 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TranslationCard;
