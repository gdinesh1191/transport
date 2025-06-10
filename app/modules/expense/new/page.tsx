"use client";

import { useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { validateForm } from "@/app/utils/formValidations"; // Import the utility

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
          // Add data-validate to one of the radio inputs in the group if required
          {...(required ? { "data-validate": "required" } : {})}
        />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);


export default function NewExpese() {
  const [fileName, setFileName] = useState("No file chosen");
  const formRef = useRef<HTMLFormElement>(null);  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      if (validateForm(formRef.current)) {
         const formData = new FormData(formRef.current);
         console.log("Form submitted successfully", Object.fromEntries(formData.entries()));
        setFileName("No file chosen"); 
      } else {
       
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  return (
    <Layout pageTitle="Expense New">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
            <form ref={formRef} onSubmit={handleSubmit}>
              {/* Basic Vehicle Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Date" required>
                    <Input
                      name="date"
                      type="date"
                      placeholder="Choose your date"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Category" required>
                    <select
                      name="category"
                      className="form-control px-3 py-2"
                      data-validate="required"
                    >
                      <option value="">Select Category</option>
                      <option value="fuelCharges">Fuel Charges</option>
                      <option value="tollCharges">Toll Charges</option>
                      <option value="driverAllowance">Driver Allowance</option>
                      <option value="service">Vehicle Service on Trip</option>
                    </select>
                  </FormField>

                  <FormField label="Description" className="md:items-start">
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Enter description"
                      data-validate="required,minlength:10,maxlength:200" // Added min/max length
                      className="form-control capitalize h-[80px]"
                    ></textarea>
                  </FormField>

                  <FormField label="Amount" required>
                    <Input
                      name="amount"
                      placeholder="Enter amount"
                      className="form-control numbers-decimal"
                      data-validate="required"
                      type="text" // Changed to type number for amount
                      step="0.01" // Allow decimal values
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

                  <FormField label="Attachments" required>
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label
                            htmlFor="attachmentInput"
                            className="flex items-center gap-1 text-[#009333] text-sm cursor-pointer"
                          >
                            <i className="ri-upload-2-line text-md"></i>Upload
                            File
                          </label>
                        </div>
                        <span id="fileName" className="text-gray-600 text-sm truncate">
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
                      />
                    </div>
                  </FormField>
                </div>
              </div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button type="submit" onClick={handleSubmit} className="btn-sm btn-primary">
            Save
          </button>
          <button type="button" className="btn-sm btn-secondary">
            Cancel
          </button>
        </footer>
      </div>
    </Layout>
  );
}
