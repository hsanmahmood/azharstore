import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dropdown = ({ options, value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validOptions = options.filter(Boolean);

  const selectedOption = validOptions.find((option) => option.value === value);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = validOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full bg-card-background border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={`h-5 w-5 text-text-light transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-primary-background border border-soft-border rounded-lg shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-full bg-card-background border border-soft-border text-text-dark p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple/50"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="py-1 max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 text-text-dark hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
