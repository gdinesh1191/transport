"use client";
 
import { useRef, useState } from "react";
import Layout from "../../../components/Layout";
import { validateForm } from "@/app/utils/formValidations";
import SearchableSelect from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { Input, RadioGroup } from "@/app/utils/form-controls";
import useInputValidation from "@/app/utils/inputValidations";

 
import { apiCall } from "@/app/utils/api";
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
    if (formRef.current && validateForm(formRef.current)) {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());
  
      try {
        // Parse and format fields to match expected API structure
        const payload = {
          token: "putTripsheetExpense",
          requestData: {
            id: 2, // Static ID or fetch it dynamically as needed
            tripSheetId: 1, // Hardcoded for now; replace with actual dynamic value
            expenseCategory: formValues.category,
            amount: parseFloat(formValues.amount as string),
            remarks: formValues.description || "",
            fileAttachments: formValues.attachment instanceof File ? formValues.attachment.name : "",
            expenseDate: selectedDate
              ? selectedDate.toLocaleDateString("en-GB") // Format: DD/MM/YYYY
              : "",
            expenseTime: new Date().toLocaleTimeString("en-GB", {
              hour12: false,
            }), // Format: HH:mm:ss
          },
        };
  
        const response = await apiCall(payload);
        if (response.status === 200) {
          console.log("Success:", response);
        }
      } catch (error) {
        console.error("Error while submitting:", error);
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
                  <FormField label="Date" required>
 
                    <DatePicker date={selectedDate} disableFuture  setDate={setSelectedDate} placeholder="Select date" className="w-full"  name="expenseDate"/>
 
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
                  <FormField label="Attachments"  >
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label htmlFor="attachmentInput" className="flex items-center gap-1 text-[#009333] text-sm cursor-pointer">
                            <i className="ri-upload-2-line text-md"></i>Upload File
                          </label>
                        </div>
                        <span id="fileName" className="text-gray-600 text-sm truncate">{fileName}</span>
                      </div>
                      <input type="file" id="attachmentInput" name="attachment" className="hidden" onChange={handleFileUpload}   />
                    </div>
                  </FormField>
                  <FormField label="">
                    <Input name="id" type="hidden" value="0"  className="number_with_decimal" data-validate="required" />
                    <Input name="tripSheetId" type="hidden" value="1"  className="number_with_decimal" data-validate="required" />
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
