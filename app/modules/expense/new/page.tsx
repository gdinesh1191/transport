"use client";

import { useState, useRef, useEffect } from "react";
import Layout from "../../../components/Layout";

// Form field components for reusability
const FormField = ({label, required = false, children, className = "",}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50">{label}{required && <span className="form-required text-red-500">*</span>}</label>
    <div className="flex flex-col w-3/4 flex-grow">{children}</div>
  </div>
);

const Input = ({name,placeholder,type = "text",className = "",...props}: {name: string;placeholder?: string;type?: string;className?: string;[key: string]: any;}) => (
  <input type={type} name={name} placeholder={placeholder} className={`form-control ${className}`} {...props} />
);

const RadioGroup = ({name, options, required = false,}: {name: string; options: { value: string; label: string }[]; required?: boolean;}) => (
  <div className="space-x-4">{options.map((option, index) => (
      <label key={option.value} className="form-label">
        <input type="radio" name={name} value={option.value} className="form-radio" {...(required && index === 0 ? { "data-validate": "required" } : {})}/>
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);

const Typeahead = ({
  name,
  placeholder = "Enter text",
  data = [],
  required = false,
  onSelect,
  onAddNew,
  className = "",
  searchFields = ['name'],
  displayField = 'name',
  minSearchLength = 3,
  ...props
}: {
  name: string;
  placeholder?: string;
  data: any[];
  required?: boolean;
  onSelect?: (item: any) => void;
  onAddNew?: () => void;
  className?: string;
  searchFields?: string[];
  displayField?: string;
  minSearchLength?: number;
  [key: string]: any;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const dropdownRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const hoverTimeoutRef = useRef<any>(null);

  // Filter data based on search criteria
  const filterData = (term: any) => {
    if (!term.trim()) return [];
    
    const searchTerms = term.toLowerCase().split(' ').filter((t: any) => t.length > 0);
    
    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field]?.toLowerCase() || '';
        
        return searchTerms.every((searchTerm: any) => {
          if (searchTerm.length < minSearchLength) return false;
          
          const words = fieldValue.split(' ');
          return words.some((word:any) => word.startsWith(searchTerm));
        });
      });
    });
  };

  // Check if current input matches selected item exactly
  const isCurrentInputValid = () => {
    return selectedItem && searchTerm === selectedItem[displayField];
  };

  // Handle input change
  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If user modifies a previously selected item, clear the selection
    if (selectedItem && value !== selectedItem[displayField]) {
      setSelectedItem(null);
    }
    
    const filtered = filterData(value);
    setFilteredData(filtered);
    setIsDropdownOpen(value.length >= minSearchLength && filtered.length > 0);
  };

  // Handle item selection
  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setSearchTerm(item[displayField]);
    setIsDropdownOpen(false);
    setHoveredItem(null);
    onSelect?.(item);
  };

  // Handle clear button click
  const handleClearInput = () => {
    setSearchTerm("");
    setSelectedItem(null);
    setIsDropdownOpen(false);
    setHoveredItem(null);
    inputRef.current?.focus();
  };

  // Handle mouse enter on item
  const handleMouseEnter = (item: any, event: any) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    setHoveredPosition({
      x: dropdownRect.right + 10,
      y: dropdownRect.top + 40
    });
    setHoveredItem(item);
  };

  // Handle mouse leave from item
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 100);
  };

  // Handle description card mouse events
  const handleDescriptionMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleDescriptionMouseLeave = () => {
    setHoveredItem(null);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHoveredItem(null);
        
        // Clear input if it doesn't match a selected item or if no valid selection
        if (!isCurrentInputValid() && searchTerm.trim() !== "") {
          setSearchTerm("");
          setSelectedItem(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm, selectedItem]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input with Typeahead */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`form-control w-full pr-8 ${className}`}
          {...(required ? { "data-validate": "required" } : {})}
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
          {searchTerm ? (
            <i 
              className="ri-close-line text-gray-400 hover:text-gray-600"
              onClick={handleClearInput}
            ></i>
          ) : (
            <i className="ri-arrow-down-s-line text-gray-400"></i>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-64 overflow-hidden flex flex-col">
          {/* Scrollable Suggestions Area */}
          <div className="flex-1 overflow-y-auto py-1">
            {filteredData.length > 0 ? (
              filteredData.map((item: any) => (
                <div
                  key={item.id}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                  onClick={() => handleItemSelect(item)}
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item[displayField]}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No data found
              </div>
            )}
          </div>
          
          {/* Fixed Add New Button */}
          {onAddNew && (
            <div className="border-t border-gray-200 px-3 py-2 bg-white">
              <button type="button" onClick={onAddNew} className="flex items-center gap-2 text-green-600 text-sm hover:text-green-700">
                <i className="ri-add-line text-green-600"></i>
                Add New
              </button>
            </div>
          )}
        </div>
      )}

      {/* Description Card */}
      {hoveredItem && hoveredItem.description && (
        <div
          className="fixed bg-white border border-gray-200 rounded-sm shadow-lg p-3 z-[60] max-w-xs"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y}px`,
          }}
          onMouseEnter={handleDescriptionMouseEnter}
          onMouseLeave={handleDescriptionMouseLeave}
        >
          <div className="text-sm">
            <div className="font-medium text-gray-700 mb-1">
              Name: {hoveredItem[displayField]}
            </div>
            {/* Uncomment if you want to show description
            <div className="text-gray-600 text-xs leading-relaxed">
              {hoveredItem.description}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default function NewExpese() {
    const [fileName, setFileName] = useState('No file chosen');

    // Sample name data - replace with your actual data
    const nameData = [
      { id: 1, name: "Aaaaaaaaaaaaaaaa", description: "This is a detailed description for Aaaaaaaaaaaaaaaa item with more information about its features and usage." },
      { id: 2, name: "Ad Agency Solutions", description: "Professional advertising and marketing solutions for businesses of all sizes." },
      { id: 3, name: "Anil Alta Technologies", description: "Advanced technology solutions and IT services provider." },
      { id: 4, name: "Anil Maggie Foods", description: "Quality food products and catering services for various occasions." },
      { id: 5, name: "Anil Kumar Enterprises", description: "Multi-business enterprise offering various commercial services." },
      { id: 6, name: "Arun Suppliers", description: "Reliable supplier of industrial and commercial goods and materials." },
      { id: 7, name: "Asdfasf Industries", description: "Manufacturing and industrial solutions provider with quality products." },
      { id: 8, name: "Alpha Beta Corp", description: "Corporate solutions and business consulting services." },
      { id: 9, name: "Amazing Products Ltd", description: "Innovative product development and distribution company." },
      { id: 10, name: "Advance Systems", description: "Advanced system integration and technical support services." }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Form valid, proceed to save!");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('No file chosen');
        }
    };

    const handleNameSelect = (item: any) => {
        console.log("Selected name:", item);
    };

    const handleAddNewName = () => {
        console.log("Add new name clicked");
        // Handle add new logic here
    };

    return (
        <Layout pageTitle="Expense New">
            <div className="flex-1">
                <main id="main-content" className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto" >
                        <form onSubmit={handleSubmit} autoComplete="off" >
                            {/* Basic Vehicle Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                                <div className="space-y-4">
                                    <FormField label="Date" required >
                                        <Input name="date" type="date" placeholder="Choose your date" data-validate="required"  />
                                    </FormField>

                                    <FormField label="Category" required>
                                        <select name="category" className="form-control px-3 py-2" data-validate="required">
                                            <option value="">Select Category</option>
                                            <option value="fuelCharges">Fuel Charges</option>
                                            <option value="tollCharges">Toll Charges</option>
                                            <option value="driverAllowance">Driver Allowance</option>
                                            <option value="service">Vehicle Service on Trip</option>
                                        </select>
                                    </FormField>

                                    <FormField label="Description" className="md:items-start" >
                                        <textarea name="description" id="description"  placeholder="Enter description"  data-validate="required" className="form-control  capitalize h-[80px]"></textarea>
                                    </FormField>

                                    <FormField label="Amount" required >
                                        <Input name="amount" placeholder="Enter amount" className="form-control   numbers-decimal" data-validate="required" />
                                    </FormField>

                                    <FormField label="Name" required >
                                        <Typeahead
                                            name="name"
                                            placeholder="Enter name"
                                            data={nameData}
                                            required={true}
                                            onSelect={handleNameSelect}
                                            onAddNew={handleAddNewName}
                                            searchFields={['name']}
                                            displayField="name"
                                            minSearchLength={1}
                                        />
                                    </FormField>

                                    <FormField label="Payment Method" required>
                                        <RadioGroup  name="paymentMethod" options={[{ value: "Cash", label: "Cash" }, { value: "UPI", label: "UPI" }, { value: "Net Banking", label: "Net Banking" },]} required />
                                    </FormField>

                                    <FormField label="Attachments" required>
                                        <div className="w-full flex-grow flex flex-col">
                                            <div className="flex items-center justify-start gap-3">
                                                <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                                                    <label htmlFor="attachmentInput" className="flex items-center  gap-1 text-[#009333] text-sm cursor-pointer">
                                                        <i className="ri-upload-2-line text-md"></i>Upload File
                                                    </label>
                                                </div>
                                                <span id="fileName" className="text-gray-600 text-sm truncate">{fileName}</span>
                                            </div>
                                            <input type="file" id="attachmentInput" name="attachment" className="hidden" data-validate="required" onChange={handleFileUpload} required/>
                                        </div>
                                    </FormField>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
                    <button type="submit" onClick={handleSubmit} className="btn-sm btn-primary" >Save</button>
                    <button type="button" className="btn-sm btn-secondary">Cancel</button>
                </footer>
            </div>
        </Layout>
    );
}