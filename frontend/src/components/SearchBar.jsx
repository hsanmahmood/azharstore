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
        className="w-full bg-card-background border border-soft-border text-text-dark p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-text-light" />
      </div>
    </div>
  );
};

export default SearchBar;
