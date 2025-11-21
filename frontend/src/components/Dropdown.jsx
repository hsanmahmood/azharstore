import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ options, value, onChange, placeholder }) => {
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
        className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={`h-5 w-5 text-brand-secondary transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-background-dark border border-brand-border rounded-lg shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-black/20 border border-brand-border text-brand-primary p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="py-1 max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 text-brand-primary hover:bg-brand-border/20 cursor-pointer"
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
