 'use client';

import { useEffect, useRef, useState } from 'react';

export interface Option {
  value: string;
  label: string;
}

interface Props {
  name: string;
  options: Option[];
  required?: boolean;
  searchable?: boolean;
  placeholder?: string;
  className?: string;
  'data-validate'?: string;
  value?: string; // Controlled component support
  onChange?: (option: Option | null) => void; // Callback for state management
  onAddNew?: () => void; // Callback for "Add New" functionality
  onRefresh?: () => void; // Callback for refresh functionality
  disabled?: boolean;
  error?: string; // Error message support
  id?: string;
  

}

const SearchableSelect = ({
  name,
  options,
  required = false,
  searchable = false,
  placeholder = 'Select an option',
  className = 'text-[13px]',
  'data-validate': dataValidate,
  value,
  onChange,
  onAddNew,
  onRefresh,
  disabled = false,
  error,
  id,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Option | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Handle option selection
  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    setSearchTerm('');
    
    // Call onChange callback if provided
    if (onChange) {
      onChange(option);
    }
  };

  // Handle clearing selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(null);
    setSearchTerm('');
    
    if (onChange) {
      onChange(null);
    }
  };

  // Handle click outside to close dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSearchTerm(''); // Clear search when closing
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Could implement option navigation here
        break;
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle toggle dropdown
  const handleToggle = () => {
    if (disabled) return;
    
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Focus search input when opening
    if (newIsOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Sync with external value prop (controlled component)
  useEffect(() => {
    if (value !== undefined) {
      const foundOption = options.find(opt => opt.value === value);
      setSelected(foundOption || null);
    }
  }, [value, options]);

  // Setup click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current display value
  const getDisplayValue = () => {
    if (selected) return selected.label;
    if (searchTerm && isOpen) return searchTerm;
    return '';
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={selected?.value || ''}
        required={required}
        data-validate={dataValidate}
      />
      
      {/* Main select button */}
      <div
        id={id}
        className={`form-control border rounded px-3 py-2 bg-white cursor-pointer min-h-[40px] flex items-center justify-between ${
          disabled 
            ? 'bg-gray-100 cursor-not-allowed opacity-60' 
            : 'hover:border-gray-400'
        } ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
        } ${
          error ? 'border-red-500' : ''
        }`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={id}
      >
        <span className={`flex-1 truncate ${
          selected ? 'text-black' : 'text-gray-500'
        }`}>
          {selected?.label || placeholder}
        </span>
        
        <div className="flex items-center gap-2">
          {/* Clear button */}
          {selected && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              aria-label="Clear selection"
            >
              ×
            </button>
          )}
          
          {/* Dropdown arrow */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul role="listbox">
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 ${
                      selected?.value === option.value 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'text-gray-900'
                    }`}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={selected?.value === option.value}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                {searchTerm ? 'No results found' : 'No options available'}
              </div>
            )}
          </div>

          {/* Footer with actions */}
          {(onAddNew || onRefresh) && (
            <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50">
              {onAddNew && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNew();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New
                </button>
              )}
              
              {onRefresh && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefresh();
                  }}
                  className="text-blue-600 hover:text-blue-700 p-1 rounded"
                  aria-label="Refresh options"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;