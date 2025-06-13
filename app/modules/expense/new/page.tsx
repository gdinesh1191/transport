"use client";

import { useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { validateForm } from "@/app/utils/formValidations";
import SearchableSelect from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { Input, RadioGroup } from "@/app/utils/form-controls";
import useInputValidation from "@/app/utils/inputValidations";

const FormField = ({
  label, required = false, children, className = "",
}: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50">
      {label}{required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4 flex-grow">{children}</div>
  </div>
);

const NewExpense = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [fileName, setFileName] = useState("No file chosen");
  const formRef = useRef<HTMLFormElement>(null);
  useInputValidation();

  const categoryOptions = [
    { value: "fuelCharges", label: "Fuel Charges" },
    { value: "tollCharges", label: "Toll Charges" },
    { value: "driverAllowance", label: "Driver Allowance" },
    { value: "service", label: "Vehicle Service on Trip" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && validateForm(formRef.current)) {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());
      console.log("Form submitted successfully", formValues);
      setFileName("No file chosen");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || "No file chosen");
  };

  return (
    <Layout pageTitle="Expense New">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Date" required>
                    <DatePicker date={selectedDate} setDate={setSelectedDate} placeholder="Select date" className="w-full" />
                  </FormField>

                  <FormField label="Category" required>
                    <SearchableSelect name="category" placeholder="Select Category" options={categoryOptions} searchable data-validate="required" />
                  </FormField>

                  <FormField label="Description">
                    <textarea name="description" id="description" placeholder="Enter description" className="form-control capitalize h-[80px]" data-validate="required"></textarea>
                  </FormField>

                  <FormField label="Amount" required>
                    <Input name="amount" placeholder="Enter amount" className="number_with_decimal" data-validate="required" />
                  </FormField>

                  <FormField label="Payment Method" required>
                    <RadioGroup name="paymentMethod" options={[
                      { value: "Cash", label: "Cash" },
                      { value: "UPI", label: "UPI" },
                      { value: "Net Banking", label: "Net Banking" }
                    ]} required />
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
                      <input type="file" id="attachmentInput" name="attachment" className="hidden" data-validate="required" onChange={handleFileUpload} required />
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
