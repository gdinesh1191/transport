// app/expense/new/page.tsx
"use client";

import { useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { validateForm, FormErrors } from "@/app/utils/formValidations"; // Import FormErrors
import SearchableSelect from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { Input, RadioGroup } from "@/app/utils/form-controls";
import useInputValidation from "@/app/utils/inputValidations"; // Your existing input formatting hook

import { apiCall } from "@/app/utils/api";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: string; // Add error prop for displaying messages
}

const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error, // Destructure the error prop
}: FormFieldProps) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50">
      {label}{required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4 flex-grow">
      {children}
      {error && <div className="error-message text-red-500 text-sm mt-1">{error}</div>} {/* Display error */}
    </div>
  </div>
);

const NewExpense = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [fileName, setFileName] = useState("No file chosen");
  const formRef = useRef<HTMLFormElement>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({}); // State to hold validation errors

  useInputValidation(); // Your existing hook for input formatting remains here

  const categoryOptions = [
    { value: "fuelCharges", label: "Fuel Charges" },
    { value: "tollCharges", label: "Toll Charges" },
    { value: "driverAllowance", label: "Driver Allowance" },
    { value: "service", label: "Vehicle Service on Trip" },
    { value: "parkingFees", label: "Parking Fees" },
    { value: "loadingCharges", label: "Loading Charges" },
    { value: "unloadingCharges", label: "Unloading Charges" },
    { value: "repairExpenses", label: "Repair Expenses" },
    { value: "punctureRepair", label: "Puncture Repair" },
    { value: "coolieCharges", label: "Coolie/Labour Charges" },
    { value: "foodExpenses", label: "Driver/Staff Food Expenses" },
    { value: "accommodation", label: "Accommodation Charges" },
    { value: "miscellaneous", label: "Miscellaneous Expenses" },
    { value: "maintenance", label: "Maintenance & Spares" },
    { value: "vehicleCleaning", label: "Vehicle Cleaning" },
    { value: "permitCharges", label: "Permit Charges" },
    { value: "taxes", label: "Taxes and Road Tax" },
    { value: "insurance", label: "Insurance Payment" },
    { value: "emiPayment", label: "Loan EMI Payment" },
    { value: "advanceToDriver", label: "Advance Given to Driver" },
    { value: "freightCharges", label: "Freight Charges" },
    { value: "entryFees", label: "Entry Fees/State Entry Tax" },
    { value: "policeClearance", label: "Police/Naka Clearance" },
    { value: "dieselPetty", label: "Diesel Petty (Cash)" },
    { value: "spareParts", label: "Spare Parts Purchase" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formRef.current) {
      // 1. Validate the form and get errors
      const errors = validateForm(formRef.current);
      setFormErrors(errors); // Update the state with current errors

      // 2. Add/remove 'is-invalid' class based on errors
      const formFields = formRef.current.querySelectorAll<HTMLElement>('[data-validate], input[name], select[name], textarea[name]');
      formFields.forEach(field => {
        const fieldName = field.getAttribute('name');
        if (fieldName && errors[fieldName]) {
          // Add 'is-invalid' class
          field.classList.add('is-invalid');
          // Special handling for SearchableSelect's visible div
          if ( field.tagName === "INPUT" && field.classList.contains('form-control')) { // Adjust based on your SearchableSelect's visible structure
             const visibleControl = field.parentElement?.querySelector('.form-control');
             if(visibleControl) visibleControl.classList.add('is-invalid');
          }
          // Special handling for RadioGroup's visible div
          if (field.tagName === "DIV" && field.hasAttribute("data-validate") && field.getAttribute("data-validate")?.includes("required")) {
              field.classList.add('is-invalid');
          }
        } else {
          // Remove 'is-invalid' class if valid
          field.classList.remove('is-invalid');
          const visibleControl = field.parentElement?.querySelector('.form-control');
          if(visibleControl) visibleControl.classList.remove('is-invalid');
        }
      });


      // 3. Check if there are any errors to prevent API call
      if (Object.keys(errors).length === 0) {
        // If no errors, proceed with form submission
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());

        try {
          const payload = {
            token: "putTripsheetExpense",
            requestData: {
              id: 2,
              tripSheetId: 1,
              expenseCategory: formValues.category,
              amount: parseFloat(formValues.amount as string),
              remarks: formValues.description || "",
              fileAttachments: formValues.attachment instanceof File ? formValues.attachment.name : "",
              expenseDate: selectedDate
                ? selectedDate.toLocaleDateString("en-GB")
                : "",
              expenseTime: new Date().toLocaleTimeString("en-GB", {
                hour12: false,
              }),
            },
          };

          const response = await apiCall(payload);
          if (response.status === 200) {
            console.log("Success:", response);
            // Optionally, clear form or show success message
            setFormErrors({}); // Clear errors on successful submission
          }
        } catch (error) {
          console.error("Error while submitting:", error);
        }
      } else {
        console.log("Validation errors:", errors);
        // Errors are now in formErrors state and will be displayed by FormField.
      }
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
                  <FormField label="Date" required error={formErrors.expenseDate}>
                    <DatePicker date={selectedDate} disableFuture setDate={setSelectedDate} placeholder="Select date" className="w-full" name="expenseDate"/>
                  </FormField>

                  <FormField label="Category" required error={formErrors.category}>
                    <SearchableSelect name="category" placeholder="Select Category" options={categoryOptions} searchable data-validate="required" />
                  </FormField>

                  <FormField label="Description" error={formErrors.description}>
                    <textarea name="description" id="description" placeholder="Enter description" className="form-control capitalize h-[80px]" data-validate="required"></textarea>
                  </FormField>

                  <FormField label="Amount" required error={formErrors.amount}>
                    <Input name="amount" placeholder="Enter amount" className="number_with_decimal" data-validate="required" />
                  </FormField>

                  <FormField label="Payment Method" required error={formErrors.paymentMethod}>
                    <RadioGroup name="paymentMethod" options={[
                      { value: "Cash", label: "Cash" },
                      { value: "UPI", label: "UPI" },
                      { value: "Net Banking", label: "Net Banking" }
                    ]} data-validate="required" />
                  </FormField>

                  {/* Attachments and Hidden Fields usually don't need direct error display unless they are actually validated visually */}
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
                    {/* Hidden inputs are validated in formValidations but typically don't show errors on UI */}
                    <Input name="id" type="hidden" value="0" className="number_with_decimal" data-validate="required" />
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
    </Layout>
  );
};

export default NewExpense;