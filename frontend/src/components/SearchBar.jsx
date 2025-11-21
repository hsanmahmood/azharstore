import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || t('common.search')}
        className="w-full bg-black/20 border border-brand-border text-brand-primary p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-brand-secondary" />
      </div>
    </div>
  );
};

export default SearchBar;
