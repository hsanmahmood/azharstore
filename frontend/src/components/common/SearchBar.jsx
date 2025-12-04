import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || t('common.search')}
        className="w-full bg-white border border-soft-border text-text-dark p-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
      />
    </div>
  );
};

export default SearchBar;
