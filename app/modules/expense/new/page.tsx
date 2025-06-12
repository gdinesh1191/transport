 "use client";

import { useRef, useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { validateForm } from "@/app/utils/formValidations"; // Import the utility
 
import DatePicker from "@/app/utils/commonDatepicker";
import CommonTypeahead from "@/app/utils/commonTypehead";

import dayjs, { Dayjs } from 'dayjs';

const FormField = ({
  label,
  required = false,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}
  >
    <label className="form-label w-50">
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4 flex-grow">{children}</div>
  </div>
);

const Input = ({
  name,
  placeholder,
  type = "text",
  className = "",
  ...props
}: {
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
    className={`form-control ${className}`}
    {...props}
  />
);

const RadioGroup = ({
  name,
  options,
  required = false,
}: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div className="space-x-4">
    {options.map((option) => (
      <label key={option.value} className="form-label">
        <input
          type="radio"
          name={name}
          value={option.value}
          className="form-radio"

          {...(required ? { "data-validate": "required" } : {})}
        />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);

const NewExpense = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [fileName, setFileName] = useState('No file chosen');
  const formRef = useRef<HTMLFormElement>(null);
  
   
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
    if (formRef.current) {
      if (validateForm(formRef.current)) {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());
 
        
        console.log("Form submitted successfully", formValues);
        setFileName("No file chosen");
      }
    }
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
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              {/* Basic Vehicle Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">

                  <FormField label="Category" required>
                    <select name="category" className="form-control px-3 py-2" data-validate="required">
                      <option value="">Select Category</option>
                      <option value="fuelCharges">Fuel Charges</option>
                      <option value="tollCharges">Toll Charges</option>
                      <option value="driverAllowance">Driver Allowance</option>
                      <option value="service">Vehicle Service on Trip</option>
                    </select>
                  </FormField>

                  <FormField label="Date" className="md:items-start" required>
                  <DatePicker date={selectedDate} setDate={setSelectedDate} placeholder="Select date" className="w-full" />  
                  </FormField>

                  <FormField label="Description" className="md:items-start">
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Enter description"
                      data-validate="required"
                      className="form-control capitalize h-[80px]"
                    ></textarea>
                  </FormField>

                  <FormField label="Amount" required>
                    <Input
                      name="amount"
                      placeholder="Enter amount"
                      className="form-control numbers-decimal"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Name" required>
                    <CommonTypeahead
                      name="name" // This name will be used for form data
                      placeholder="Enter name"
                      data={nameData} // Pass the page-specific data
                      required={true}
                      onSelect={handleNameSelect}
                      onAddNew={handleAddNewName}
                      searchFields={['name']}
                      displayField="name"
                      minSearchLength={1}
                    />
                  </FormField>

                  <FormField label="Payment Method" required>
                    <RadioGroup
                      name="paymentMethod"
                      options={[
                        { value: "Cash", label: "Cash" },
                        { value: "UPI", label: "UPI" },
                        { value: "Net Banking", label: "Net Banking" }
                      ]}
                      required
                    />
                  </FormField>

                  <FormField label="Attachments" required>
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label htmlFor="attachmentInput" className="flex items-center gap-1 text-[#009333] text-sm cursor-pointer">
                            <i className="ri-upload-2-line text-md"></i>Upload File
                          </label>
                        </div>
                        <span id="fileName" className="text-gray-600 text-sm truncate">{fileName}</span>
                      </div>
                      <input
                        type="file"
                        id="attachmentInput"
                        name="attachment"
                        className="hidden"
                        data-validate="required"
                        onChange={handleFileUpload}
                        required
                      />
                    </div>
                  </FormField>
                </div>
              </div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button type="submit" onClick={handleSubmit} className="btn-sm btn-primary">Save</button>
          <button type="button" className="btn-sm btn-secondary">Cancel</button>
        </footer>
      </div>
    </Layout>
  );
};

export default NewExpense;