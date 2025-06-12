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
}

const SearchableSelect = ({
  name,
  options,
  required = false,
  searchable = false,
  placeholder = 'Select an option',
  className = 'text-[13px]',
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Option | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

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
      />
      <div
        className="form-control border border-gray-300 rounded px-3 py-2 bg-white cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected?.label || placeholder}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow flex flex-col">
          {searchable && (
            <div className="m-2">
              <input
                type="text"
                placeholder="Search..."
                className="form-control w-9.5/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className="overflow-y-auto max-h-48 m-1">
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[14px]"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="p-2 text-gray-400">No results</li>
              )}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50">
            <span className="text-sm cursor-pointer text-[#009333]">
              <i className="ri-add-circle-fill"></i> Add New
            </span>
            <i className="ri-refresh-line text-xl text-blue-700 cursor-pointer hover:text-gray-700"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
