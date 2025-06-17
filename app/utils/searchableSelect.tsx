// searchableSelect.tsx
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
  value?: string | null; // Allow value to be null as well
  onChange?: (option: Option | null) => void;
  onAddNew?: () => void;
  onRefresh?: () => void;
  disabled?: boolean;
  error?: string;
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

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    setSearchTerm('');
    if (onChange) {
      onChange(option);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(null);
    setSearchTerm('');
    if (onChange) {
      onChange(null); // Explicitly pass null when clearing
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

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
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggle = () => {
    if (disabled) return;

    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Sync with external value prop
  useEffect(() => {
    if (value === undefined || value === null) {
      setSelected(null); // Explicitly set to null if value is undefined or null
    } else {
      const foundOption = options.find((opt) => opt.value === value);
      setSelected(foundOption || null);
    }
  }, [value, options]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        type="hidden"
        name={name}
        value={selected?.value || ''}
        required={required}
        data-validate={dataValidate}
      />

      <div
        id={id}
        className={`form-control flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed opacity-60'
            : ''
        } ${
          isOpen ? 'border-[#009333] ring-0.5 ring-[#009333]' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={id}
      >
        <span
          className={`flex-1 truncate ${
            selected ? 'text-black' : 'text-gray-500'
          }`}
        >
          {selected?.label || placeholder}
        </span>

        {selected && !disabled && ( // Add a clear button only when an option is selected and not disabled
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear selection"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

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

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="form-control"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

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

          {(onAddNew || onRefresh) && (
            <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50">
              {onAddNew && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddNew) onAddNew();
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
                    if (onRefresh) onRefresh();
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