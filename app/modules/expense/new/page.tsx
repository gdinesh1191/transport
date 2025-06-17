// app/expense/new/page.tsx
"use client";

import { useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { validateForm, FormErrors } from "@/app/utils/formValidations"; // Import FormErrors
import SearchableSelect from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { Input, RadioGroup } from "@/app/utils/form-controls";
import useInputValidation from "@/app/utils/inputValidations";  

import { apiCall } from "@/app/utils/api";
import ToastContainer, { showToast } from "@/app/utils/toaster";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: string;  
}

const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error,  
}: FormFieldProps) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50">
      {label}{required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4 flex-grow">
      {children}
      {error && <div className="error-message text-red-500 text-sm mt-1">{error}</div>}  
    </div>
  </div>
);

const NewExpense = () => {
  
  const [fileName, setFileName] = useState("No file chosen");
  const formRef = useRef<HTMLFormElement>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});  

  useInputValidation();  

  const categoryOptions = [
    { value: "fuelCharges", label: "Fuel Charges" },
    { value: "tollCharges", label: "Toll Charges" },
    { value: "driverAllowance", label: "Driver Allowance" },
 
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const validationResults = validateForm(formRef.current);
      setFormErrors(validationResults);
      const isFormValid = Object.keys(validationResults).length === 0;
      if (isFormValid) {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());
        console.log("Form submitted successfully", formValues);
        try {
          const payload = {
            token: "putTripsheetExpense",
            requestData: {
              id: formValues.id,
              tripSheetId: formValues.tripSheetId,
              expenseCategory: formValues.expenseCategory,
              expenseDate: formValues.expenseDate,
              amount: formValues.amount,
              remarks: formValues.description || "",
              fileAttachments: formValues.attachment instanceof File ? formValues.attachment.name : "",
               
              
            },
          };

          const response = await apiCall(payload);
          if (response.status === 200) {
            console.log("Success:", response);
              formRef.current.reset();  
                         setInitialFormValues({}); 
                          
                         showToast.success("Vehicle information saved successfully!");
          }
        } catch (error) {
          console.error("Error while submitting:", error);
        }
      } else {
        console.log("Validation errors:" );
        
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || "No file chosen");
  };
 
  const [initialFormValues, setInitialFormValues] = useState<any>({});
  return (
    <Layout pageTitle="Expense New">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Date" required error={formErrors.expenseDate}>
                  <DatePicker id="expenseDate" name="expenseDate"   disableFuture  placeholder="Select date" className="w-full" required={true} data-validate="required" initialDate={initialFormValues.expenseDate} />
                      
                  </FormField>

                  <FormField label="Category" required error={formErrors.expenseCategory}>
                  
                
                  <SearchableSelect
    id="expenseCategory"
    name="expenseCategory"
    placeholder="Select Category"
    options={categoryOptions}
    searchable
    data-validate="required"
    initialValue={initialFormValues.expenseCategory}
  />
                   
                    </FormField>

                  <FormField label="Description" error={formErrors.description}>
                    <textarea name="description" id="description" placeholder="Enter description" className="form-control capitalize h-[80px]" data-validate="required"></textarea>
                  </FormField>

                  <FormField label="Amount" required error={formErrors.amount}>
                    <Input name="amount" placeholder="Enter amount" className="number_with_decimal" data-validate="required" />
                  </FormField>

                  <FormField label="Payment Method" required error={formErrors.paymentMethod}   >
                    <RadioGroup name="paymentMethod" options={[
                      { value: "Cash", label: "Cash" },
                      { value: "UPI", label: "UPI" },
                      { value: "Net Banking", label: "Net Banking" }
                    ]} data-validate="required"  defaultValue={initialFormValues.paymentMethod}   />
                  </FormField>

                     <FormField label="Attachments">
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label htmlFor="attachmentInput" className="flex items-center gap-1 text-[#009333] text-sm cursor-pointer">
                            <i className="ri-upload-2-line text-md"></i>Upload File
                          </label>
                        </div>
                        <span id="fileName" className="text-gray-600 text-sm truncate">{fileName}</span>
                      </div>
                      <input type="file" id="attachmentInput" name="attachment" className="hidden" onChange={handleFileUpload} />
                    </div>
                  </FormField>

                  <FormField label="">
                     <Input name="id" type="hidden" value="2" className="number_with_decimal" data-validate="required" />
                    <Input name="tripSheetId" type="hidden" value="1" className="number_with_decimal" data-validate="required" />
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
      <ToastContainer/>
    </Layout>
  );
};

export default NewExpense;