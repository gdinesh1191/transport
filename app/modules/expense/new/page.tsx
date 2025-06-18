// app/expense/new/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { validateForm, FormErrors } from "@/app/utils/formValidations";
import SearchableSelect from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { Input, RadioGroup } from "@/app/utils/form-controls";
import useInputValidation from "@/app/utils/inputValidations";

import { apiCall } from "@/app/utils/api";
import ToastContainer, { showToast } from "@/app/utils/toaster";
import { useSearchParams } from "next/navigation";

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
  <div
    className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}
  >
    <label className="form-label w-50">
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4 flex-grow">
      {children}
      {error && (
        <div className="error-message text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  </div>
);

const NewExpense = () => {
  const [fileName, setFileName] = useState("No file chosen");
  const formRef = useRef<HTMLFormElement>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  // This key is crucial for forcing form re-render and resetting component internal states
  const [formKey, setFormKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
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
            data: {
              id: formValues.id,
              tripSheetId: formValues.tripSheetId,
              expenseCategory: formValues.expenseCategory,
              expenseDate: formValues.expenseDate, // This should be "DD/MM/YYYY" from DatePicker's internal hidden input
              amount: formValues.amount,
              paymentMethod: formValues.paymentMethod, // This should be the value from RadioGroup's selected radio
              remarks: formValues.remarks || "",
              fileAttachments:
                formValues.attachment instanceof File
                  ? formValues.attachment.name
                  : "",
            },
          };

          const response = await apiCall(payload);
          if (response.status === 200) {
            console.log("Success:", response);
            formRef.current.reset(); // Reset native form elements
            setFileName("No file chosen"); // Reset file name display
            showToast.success("Expense information saved successfully!");
            setFormKey((prevKey) => prevKey + 1); // Force re-render of components to clear
          }
        } catch (error) {
          console.error("Error while submitting:", error);
          showToast.error("Error saving expense. Please try again.");
        }
      } else {
        console.log("Validation errors:", validationResults);
        showToast.error("Please correct the form errors.");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || "No file chosen");
  };

  const searchParams = useSearchParams();
  const edit_id = searchParams.get("id");

  function parseDMYtoJSDate(dateString: string | undefined): Date | null {
    if (!dateString) return null;
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JS Date
    }
    return null;
  }

  const [initialFormValues, setInitialFormValues] = useState<any>({});

  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!edit_id) {
        setInitialFormValues({}); // Clear initial values for new entry
        setFormKey((prevKey) => prevKey + 1); // Force a reset for new entry form
        setFileName("No file chosen"); // Ensure file name is reset for new
        return;
      }
      const payload = {
        token: "getTripsheetExpense",
        data: { id: Number(edit_id) },
      };
      try {
        const response = await apiCall(payload);
        if (response.status === 200) {
          const expenseData = response.data;
          const transformedData = {
            ...expenseData,
            // Pass Date object to DatePicker's initialValue
            expenseDate: parseDMYtoJSDate(expenseData.expenseDate),
          };
          console.log("Fetched and transformed data:", transformedData);
          setInitialFormValues(transformedData);
          setFileName(transformedData.fileAttachments || "No file chosen"); // Set initial file name
          setFormKey((prevKey) => prevKey + 1); // Force re-render of components with new data
        } else {
          showToast.error("Failed to fetch expense data");
          setInitialFormValues({});
          setFileName("No file chosen");
          setFormKey((prevKey) => prevKey + 1); // Reset form even on error
        }
      } catch (err) {
        console.error("API error:", err);
        showToast.error("Something went wrong");
        setInitialFormValues({});
        setFileName("No file chosen");
        setFormKey((prevKey) => prevKey + 1); // Reset form even on error
      }
    };
    fetchExpenseData();
  }, [edit_id]); // Re-run when edit_id changes

  return (
    <Layout pageTitle="Expense New">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
            {/* Apply the key to the form to force re-render on data load/reset */}
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off" key={formKey}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField
                    label="Date"
                    required
                    error={formErrors.expenseDate}
                  >
                     <DatePicker
                  id="expenseDate"
                  name="expenseDate"
                  selected={selectedDate} // <--- ADD THIS LINE
                  onChange={(date: Date | undefined) => setSelectedDate(date)}
                  placeholder="Select date"
                  className="w-full"
                />
                  </FormField>

                  <FormField
                    label="Category"
                    required
                    error={formErrors.expenseCategory}
                  >
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

                  <FormField label="Remarks" error={formErrors.remarks}>
                    <textarea
                      name="remarks"
                      id="remarks"
                      placeholder="Enter Remarks"
                      className="form-control capitalize h-[80px]"
                      data-validate="required"
                      defaultValue={initialFormValues.remarks}
                    ></textarea>
                  </FormField>

                  <FormField label="Amount" required error={formErrors.amount}>
                    <Input
                      name="amount"
                      placeholder="Enter amount"
                      className="number_with_decimal"
                      data-validate="required"
                      defaultValue={initialFormValues.amount}
                    />
                  </FormField>

                  <FormField
                    label="Payment Method"
                    required
                    error={formErrors.paymentMethod}
                  >
                    <RadioGroup
                      name="paymentMethod"
                      options={[
                        { value: "Cash", label: "Cash" },
                        { value: "UPI", label: "UPI" },
                        { value: "Net Banking", label: "Net Banking" },
                      ]}
                      data-validate="required"
                      defaultValue={initialFormValues.paymentMethod} // Pass fetched value
                    />
                  </FormField>

                  <FormField label="Attachments">
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
                        onChange={handleFileUpload}
                      />
                    </div>
                  </FormField>

                 
                  <FormField label="" className="text">
  <Input
    name="id"
    type="text"
    defaultValue={initialFormValues.id ?? 0} // Set to 0 if initialFormValues.id is null or undefined
  />
</FormField>
                  <FormField label="" className="text">
                    <Input name="tripSheetId" type="text" defaultValue={initialFormValues.tripSheetId} />
                  </FormField>
                </div>
              </div>
            </form>
          </div>
        </main>
        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button onClick={handleSubmit} className="btn-sm btn-primary">
            Save
          </button>
          <button
            className="btn-secondary btn-sm"
            onClick={() => {
              setFormErrors({});
              // Always increment formKey to clear the form visually
              setFormKey((prevKey) => prevKey + 1);
              // Also ensure file name is reset if in new entry mode
              if (!edit_id) {
                formRef.current?.reset();
                setFileName("No file chosen");
              }
              // If in edit mode and canceling, you might want to re-fetch or revert
              // For simplicity, we just reset errors and let the key handle field resets.
            }}
          >
            Cancel
          </button>
        </footer>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default NewExpense;