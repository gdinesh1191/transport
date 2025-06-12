"use client";
import { useRef, useState } from "react";
import Layout from "../../../components/Layout";
import useInputValidation from "@/app/utils/inputValidations";
import ToastContainer, { showToast } from "@/app/utils/toaster";
import { Input, RadioGroup } from "@/app/utils/form-controls";
 
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import { validateForm } from "@/app/utils/formValidations";
import DatePicker from "@/app/utils/commonDatepicker";
 

const FormField = ({ label, required = false, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50">{label}{required && <span className="form-required text-red-500">*</span>}</label>
    <div className="flex flex-col w-3/4">{children}</div>
  </div>
);

export default function NewVehicle() {
  const insuranceOptions: Option[] = [
    { value: "icici", label: "ICICI Lombard" },
    { value: "hdfc", label: "HDFC Ergo" },
    { value: "newindia", label: "New India Assurance" },
    { value: "others", label: "Others" },
  ];
  const vehicleOptions: Option[] = [
    { value: "Light", label: "Light" },
    { value: "Medium", label: "Medium" },
    { value: "Heavy", label: "Heavy" },
  ];
  const bankOptions: Option[] = [
    { value: "bankA", label: "Bank A" },
    { value: "bankB", label: "Bank B" },
    { value: "financeCompany", label: "Finance Company" },
    { value: "others", label: "Others" },
  ];
  const vehicleTypeOptions: Option[] = [
    { value: "pickup", label: "Pickup" },
    { value: "lorry", label: "Lorry" },
  ];

  const [activeTab, setActiveTab] = useState("owner_information");
  useInputValidation();

  const handleErrorToast = () => showToast.error("Failed to save vehicle information.");

  const tabs = [
    { id: "owner_information", label: "Owner Information" },
    { id: "vehicle_details", label: "Vehicle Details" },
    { id: "vehicle_expiry_details", label: "Vehicle Expiry Details" },
    { id: "load_availed_details", label: "Loan Availed Details" },
    { id: "vehicle_purchase_details", label: "Vehicle Purchase Details" },
  ];

  const [registerationDate, setregisterationDate] = useState<Date | undefined>();
  const [insuranceExpiry, setInsuranceExpiry] = useState<Date | undefined>();
  const [permitExpiryDate, setPermitExpiryDate] = useState<Date | undefined>();
  const [npExpiryDate, setNpExpiryDate] = useState<Date | undefined>();
  const [quarterlyTaxExpiry, setQuarterlyTaxExpiry] = useState<Date | undefined>();
  const [truckInvoiceDate, setTruckInvoiceDate] = useState<Date | undefined>();
  const [fcexpiryDate, setFcexpiryDate] = useState<Date | undefined>();
  const [loanStartDate, setLoanStartDate] = useState<Date | undefined>();

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && validateForm(formRef.current)) {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());
      console.log("Form submitted successfully", formValues);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "owner_information":
        return (
          <div className="p-2">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
              <div>
                <FormField label="Owner" required>
                  <RadioGroup name="ownerType" options={[{ value: "New", label: "New" }, { value: "Existing", label: "Existing" }]} />
                </FormField>
                <FormField label="Address" required>
                  <Input name="ownerAddress" placeholder="Enter Address" className="capitalize" data-validate="required" />
                </FormField>
                <FormField label="Registration Date" required>
 
                  <DatePicker date={registerationDate} setDate={setregisterationDate} placeholder="Select date" className="w-full" />
 
                </FormField>
              </div>
              <div>
                <FormField label="Owners Name" required>
                  <Input name="ownerName" placeholder="Enter Owners Name" className="capitalize alphabet-only" data-validate="required" />
                </FormField>
                <FormField label="Ownership Type" required>
                  <RadioGroup name="ownershipType" options={[{ value: "Owned", label: "Owned" }, { value: "Leased", label: "Leased" }]} required />
                </FormField>
              </div>
            </div>
          </div>
        );
      case "vehicle_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
              <div>
                <FormField label="Class of Truck" required>
                  <SearchableSelect name="truckClass" placeholder="Select Truck Class" options={vehicleOptions} searchable required />
                </FormField>
                <FormField label="Model Number" required>
                  <Input name="modelNumber" className="alphanumeric all_uppercase" placeholder="Enter Model Number" data-validate="required" />
                </FormField>
                <FormField label="Model Year" required>
                  <select name="modelYear" className="form-control border border-gray-300 rounded px-3 py-2" required>
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </FormField>
                <FormField label="Chassis Number" required>
                  <Input name="chassisNumber" className="alphanumeric all_uppercase" placeholder="Enter Chassis Number" data-validate="required" />
                </FormField>
              </div>
              <div>
                <FormField label="Engine Number" required>
                  <Input name="engineNumber" className="alphanumeric all_uppercase" placeholder="Enter Engine Number" data-validate="required" />
                </FormField>
                <FormField label="Vehicle Weight (in Kgs)" required>
                  <Input name="vehicleWeight" className="number_with_decimal" type="text" placeholder="Enter Weight" data-validate="required" />
                </FormField>
                <FormField label="Unladen Weight (in Kgs)" required>
                  <Input name="unladenWeight" className="number_with_decimal" type="text" placeholder="Enter Unladen Weight" data-validate="required" />
                </FormField>
              </div>
            </div>
          </div>
        );
      case "vehicle_expiry_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
              <div>
                <FormField label="F.C. Expiry Date" required>
                  <DatePicker date={fcexpiryDate} setDate={setFcexpiryDate} placeholder="Select date" className="w-full" />
                </FormField>
                <FormField label="Insurance Company" required>
                  <SearchableSelect name="insuranceCompany" placeholder="Select Insurance Company" searchable required options={insuranceOptions} />
                </FormField>
                <FormField label="Insurance Expiry" required>
                  <DatePicker date={insuranceExpiry} setDate={setInsuranceExpiry} placeholder="Insurance Expiry Date" className="w-full" />
                </FormField>
                <FormField label="Permit Expiry Date" required>
                  <DatePicker date={permitExpiryDate} setDate={setPermitExpiryDate} placeholder="Permit Expiry Date" className="w-full" />
                </FormField>
              </div>
              <div>
                <FormField label="N.P. Expiry Date" required>
                  <DatePicker date={npExpiryDate} setDate={setNpExpiryDate} placeholder="NP Expiry Date" className="w-full" />
                </FormField>
                <FormField label="Quarterly Tax Expiry" required>
                  <DatePicker date={quarterlyTaxExpiry} setDate={setQuarterlyTaxExpiry} placeholder="Quarterly Tax Expiry" className="w-full" />
                </FormField>
                <FormField label="Loan Status" required>
                  <RadioGroup name="loanStatus" options={[{ value: "Closed", label: "Closed" }, { value: "Open", label: "Open" }]} required />
                </FormField>
              </div>
            </div>
          </div>
        );
      case "load_availed_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
              <div>
                <FormField label="Loan Provider" required>
                  <SearchableSelect name="loanProvider" placeholder="Select Loan Provider" options={bankOptions} searchable required />
                </FormField>
                <FormField label="Loan Start Date" required>
                <DatePicker  date={loanStartDate} setDate={setLoanStartDate}  placeholder="Loan Start Date"  className="w-full"  data-validate="required"/>

                </FormField>
              </div>
              <div>
                <FormField label="Loan Amount" required>
                  <Input name="loanAmount" type="text" className="number_with_decimal" placeholder="Enter Loan Amount" data-validate="required" min="0" step="0.01" />
                </FormField>
                <FormField label="Loan Tenure" required>
                  <Input name="loanTenure" type="text" className="whole_number" placeholder="Enter Loan Tenure (months/years)" data-validate="required" min="0" />
                </FormField>
                <FormField label="Loan Interest" required>
                  <Input name="loanInterest" className="number_with_decimal" type="text" placeholder="Enter Loan Interest (%)" data-validate="required" min="0" step="0.01" />
                </FormField>
              </div>
            </div>
          </div>
        );
      case "vehicle_purchase_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
              <div>
                <FormField label="Truck Invoice No." required>
                  <Input name="truckInvoiceNo" className="alphanumeric all_uppercase" placeholder="Enter Truck Invoice Number" data-validate="required" />
                </FormField>
                <FormField label="Truck Invoice Date" required>
                  <DatePicker date={truckInvoiceDate} setDate={setTruckInvoiceDate} placeholder="Truck Invoice Date" className="w-full" />
                </FormField>
                <FormField label="Endorsement Status" required>
                  <RadioGroup name="endorsementStatus" options={[{ value: "Endorsed", label: "Endorsed" }, { value: "Not Endorsed", label: "Not Endorsed" }]} required />
                </FormField>
                <FormField label="Endorsed With">
                  <Input name="endorsedWith" className="alphanumeric capitalize" placeholder="Enter Truck Endorsed With" />
                </FormField>
              </div>
              <div>
                <FormField label="Truck Status" required>
                  <RadioGroup name="truckStatus" options={[{ value: "Running", label: "Running" }, { value: "Sold", label: "Sold" }]} required />
                </FormField>
                <FormField label="Duty Driver Name" required>
                  <Input name="dutyDriverName" className="alphabet_only capitalize" placeholder="Enter Duty Driver Name" data-validate="required" />
                </FormField>
                <FormField label="Dealer Name" required>
                  <Input name="dealerName" className="alphabet_only capitalize" placeholder="Enter Dealer Name" data-validate="required" />
                </FormField>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-2">
            <div className="text-center py-8">
              <p className="text-gray-500">{tabs.find((tab) => tab.id === activeTab)?.label} content will be added here</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout pageTitle="Vehicle Registration">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6" style={{ height: "calc(100vh - 103px)", overflowY: "auto" }}>
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Truck Registration Number" required>
                    <Input name="truck-registration" placeholder="Enter registration number" className="alphanumeric no_space all_uppercase" data-validate="required" />
                  </FormField>
                  <FormField label="Truck Type" required>
                    <SearchableSelect name="truckType" placeholder="Select truck type" options={vehicleTypeOptions} searchable required />
                  </FormField>
                  <FormField label="Makers Name" required>
                    <Input name="maker-name" placeholder="Enter makers name" className="capitalize alphanumeric" data-validate="required" />
                  </FormField>
                  <FormField label="Nature of Goods Weight" required>
                    <Input name="goods-weight" placeholder="Enter weight" className="only_number" data-validate="required" />
                  </FormField>
                </div>
              </div>
              <div className="mx-2 mt-5 md:overflow-x-auto overflow-x-visible">
                <div className="md:max-w-[650px] lg:max-w-full">
                  <ul className="flex whitespace-nowrap w-full border-b border-gray-300 mr-3">
                    {tabs.map((tab) => (
                      <li key={tab.id} className={`mr-6 pb-2 cursor-pointer hover:text-[#009333] ${activeTab === tab.id ? "text-[#009333] border-b-2 border-[#009333]" : ""}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3">{renderTabContent()}</div>
            </form>
          </div>
        </main>
        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button onClick={handleSubmit} className="btn-sm btn-primary">Save</button>
          <button className="btn-secondary btn-sm" onClick={handleErrorToast}>Cancel</button>
        </footer>
        <ToastContainer />
      </div>
    </Layout>
  );
}
