'use client';

import { useState } from 'react';
import Layout from '../../../components/Layout';

// Form field components for reusability
const FormField = ({ label, required = false, children, className = "" }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-1/2">
      {label}{required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4">{children}</div>
  </div>
);

const Input = ({ name, placeholder, type = "text", className = "", ...props }: {
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  [key: string]: any;
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className={`form-control border border-gray-300 rounded px-3 py-2 ${className}`}
    {...props}
  />
);

const RadioGroup = ({ name, options, required = false }: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div className="space-x-4">
    {options.map((option, index) => (
      <label key={option.value} className="form-label">
        <input
          type="radio"
          name={name}
          value={option.value}
          className="form-radio"
          {...(required && index === 0 ? { 'data-validate': 'required' } : {})}
        />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);

export default function NewVehicle() {
  const [activeTab, setActiveTab] = useState('owner_information');

  const tabs = [
    { id: 'owner_information', label: 'Owner Information' },
    { id: 'vehicle_details', label: 'Vehicle Details' },
    { id: 'vehicle_expiry_details', label: 'Vehicle Expiry Details' },
    { id: 'load_availed_details', label: 'Loan Availed Details' },
    { id: 'vehicle_purchase_details', label: 'Vehicle Purchase Details' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form valid, proceed to save!");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'owner_information':
        return (
          <div className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FormField label="Owner" required>
                  <RadioGroup 
                    name="ownerType" 
                    options={[{ value: 'New', label: 'New' }, { value: 'Existing', label: 'Existing' }]}
                    required
                  />
                </FormField>

                <FormField label="Address" required>
                  <Input
                    name="ownerAddress"
                    placeholder="Enter Address"
                    className="capitalize"
                    data-validate="required"
                  />
                </FormField>

                <FormField label="Registration Date" required>
                  <Input
                    name="registrationDate"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Owners Name" required>
                  <Input
                    name="ownerName"
                    placeholder="Enter Owners Name"
                    className="capitalize alphabet-only"
                    data-validate="required"
                  />
                </FormField>

                <FormField label="Ownership Type" required>
                  <RadioGroup 
                    name="ownershipType" 
                    options={[{ value: 'Owned', label: 'Owned' }, { value: 'Leased', label: 'Leased' }]}
                    required
                  />
                </FormField>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-2">
            <div className="text-center py-8">
              <p className="text-gray-500">{tabs.find(tab => tab.id === activeTab)?.label} content will be added here</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout pageTitle="Vehicle Registration">
      <div className="min-h-screen bg-gray-50">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Registration</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Vehicle Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Truck Registration Number" required className="md:items-start">
                    <Input
                      name="truck-registration"
                      placeholder="Enter registration number"
                      className="capitalize uppercase alphanumeric placeholder:capitalize"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Truck Type" required className="md:items-start">
                    <select
                      name="truck-type"
                      className="form-control border border-gray-300 rounded px-3 py-2"
                      data-validate="required"
                    >
                      <option value="">Select truck type</option>
                      <option value="pickup">Pickup</option>
                      <option value="lorry">Lorry</option>
                      <option value="trailer">Trailer</option>
                      <option value="mini-truck">Mini Truck</option>
                      <option value="heavy-truck">Heavy Truck</option>
                    </select>
                  </FormField>

                  <FormField label="Makers Name" required className="md:items-start">
                    <Input
                      name="maker-name"
                      placeholder="Enter makers name"
                      className="capitalize alphanumeric"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Nature of Goods Weight" required className="md:items-start">
                    <Input
                      name="goods-weight"
                      placeholder="Enter weight"
                      className="capitalize alphanumeric"
                      data-validate="required"
                    />
                  </FormField>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mx-2 mt-5">
                <ul className="flex whitespace-nowrap w-full border-b border-gray-300 mr-3">
                  {tabs.map((tab) => (
                    <li
                      key={tab.id}
                      className={`mr-6 pb-2 cursor-pointer hover:text-[#009333] ${
                        activeTab === tab.id ? 'text-[#009333] border-b-2 border-[#009333]' : ''
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tab Content */}
              <div className="mt-3">
                {renderTabContent()}
              </div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-[#009333] text-white border border-[#009333] px-2 py-1 text-sm rounded hover:bg-[#007a2a]"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-[#6c757d] text-white border border-[#6c757d] px-2 py-1 text-sm rounded hover:bg-[#545b62]"
          >
            Cancel
          </button>
        </footer>
      </div>
    </Layout>
  );
}