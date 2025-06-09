"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";

// Form field components for reusability
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
    <label className="text-[14px] text-[#1d1d1d]  text-left w-50">
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
    className={`bg-[#ffffff] w-full px-[12px] py-[6px] text-[14px] font-normal h-[35px] text-[#212529] border border-[#cbcbcb] rounded-md placeholder-[#585858] placeholder:text-[13px] focus:outline-none focus:border-[#009333] ${className}`}
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
    {options.map((option, index) => (
      <label
        key={option.value}
        className="text-[14px] text-[#1d1d1d] w-1/2 text-left"
      >
        <input
          type="radio"
          name={name}
          value={option.value}
          className="accent-[#009333]"
          {...(required && index === 0 ? { "data-validate": "required" } : {})}
        />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);



export default function NewExpese() {
    const [fileName, setFileName] = useState('No file chosen');


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

  return (
    <Layout pageTitle="Expense New">
      <div className="bg-gray-50 flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="container px-4 py-6" style={{height: "calc(100vh - 103px)", overflowY: "auto"}}>
            <form onSubmit={handleSubmit}>
              {/* Basic Vehicle Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Date" required >
                    <Input
                      name="date"
                      placeholder="Choose your date"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField
                    label="Category"
                    required
                    
                  >
                    <select
                      name="category"
                      className="bg-[#ffffff] w-full px-[12px] py-[6px] text-[14px] font-normal h-[35px] text-[#212529] border border-[#cbcbcb] rounded-md placeholder-[#585858] placeholder:text-[13px] focus:outline-none focus:border-[#009333]"
                      data-validate="required"
                    >
                      <option value="">Select Category</option>
                      <option value="fuelCharges">Fuel Charges</option>
                      <option value="tollCharges">Toll Charges</option>
                      <option value="driverAllowance">Driver Allowance</option>
                      <option value="service">Vehicle Service on Trip</option>
                    </select>
                  </FormField>

                  <FormField label="Description" >
                    <Input name="description" placeholder="Enter description" />
                  </FormField>

                  <FormField label="Amount" required >
                    <Input
                      name="amount"
                      placeholder="Enter amount"
                      className="numbers-decimal"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Payment Method" required>
                    <RadioGroup
                      name="paymentMethod"
                      options={[
                        { value: "Cash", label: "Cash" },
                        { value: "UPI", label: "UPI" },
                        { value: "Net Banking", label: "Net Banking" },
                      ]}
                      required
                    />
                  </FormField>

                  <FormField
                    label="Attachments"
                    required
                  >
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label htmlFor="attachmentInput" className="flex items-center  gap-1 text-[#009333] text-sm cursor-pointer">
                            <i className="ri-upload-2-line text-md"></i>
                            Upload File
                          </label>
                        </div>
                        <span
                          id="fileName"
                          className="text-gray-600 text-sm truncate"
                        >
                          {fileName}
                        </span>
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-[#009333] text-white border border-[#009333] px-[0.5rem] py-[0.25rem] text-[0.875rem] font-normal rounded-[0.25rem]"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-[#6c757d] text-white border border-[#6c757d] px-[0.5rem] py-[0.25rem] text-[0.875rem] font-normal rounded-[0.25rem]"
          >
            Cancel
          </button>
        </footer>
      </div>
    </Layout>
  );
}
