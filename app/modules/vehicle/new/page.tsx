"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";
import useInputValidation from "@/app/utils/inputValidations";

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
    <div className="flex flex-col w-3/4">{children}</div>
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
    {options.map((option, index) => (
      <label key={option.value} className="form-label">
        <input
          type="radio"
          name={name}
          value={option.value}
          className="form-radio"
          {...(required && index === 0 ? { "data-validate": "required" } : {})}
        />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);

export default function NewVehicle() {
  const [activeTab, setActiveTab] = useState("owner_information");
  useInputValidation();

  const tabs = [
    { id: "owner_information", label: "Owner Information" },
    { id: "vehicle_details", label: "Vehicle Details" },
    { id: "vehicle_expiry_details", label: "Vehicle Expiry Details" },
    { id: "load_availed_details", label: "Loan Availed Details" },
    { id: "vehicle_purchase_details", label: "Vehicle Purchase Details" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form valid, proceed to save!");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "owner_information":
        return (
          <div className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FormField label="Owner" required>
                  <RadioGroup
                    name="ownerType"
                    options={[
                      { value: "New", label: "New" },
                      { value: "Existing", label: "Existing" },
                    ]}
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
                    options={[
                      { value: "Owned", label: "Owned" },
                      { value: "Leased", label: "Leased" },
                    ]}
                    required
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      case "vehicle_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FormField label="Class of Truck" required>
                  <select
                    name="truckClass"
                    className="form-control border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Truck Class</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </FormField>
                <FormField label="Model Number" required>
                  <Input
                    name="modelNumber" className="alphanumeric all_uppercase"
                    placeholder="Enter Model Number"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Model Year" required>
                  <select
                    name="modelYear"
                    className="form-control border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </FormField>
                <FormField label="Chassis Number" required>
                  <Input
                    name="chassisNumber" className="alphanumeric all_uppercase"
                    placeholder="Enter Chassis Number"
                    data-validate="required"
                  />
                </FormField>
              </div>
              <div>
                <FormField label="Engine Number" required>
                  <Input
                    name="engineNumber" className="alphanumeric all_uppercase"
                    placeholder="Enter Engine Number"
                    data-validate="required"
                  />
                </FormField>
                
                <FormField label="Vehicle Weight (in Kgs)" required>
                  <Input
                    name="vehicleWeight" className="number_with_decimal"
                    type="number"
                    placeholder="Enter Weight"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Unladen Weight (in Kgs)" required>
                  <Input
                    name="unladenWeight" className="number_with_decimal"
                    type="number"
                    placeholder="Enter Unladen Weight"
                    data-validate="required"
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      case "vehicle_expiry_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FormField label="F.C. Expiry Date" required>
                  <Input
                    name="fcExpiryDate"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Insurance Company" required>
                  <select
                    name="insuranceCompany"
                    className="form-control border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Insurance Company</option>
                    <option value="icici">ICICI Lombard</option>
                    <option value="hdfc">HDFC Ergo</option>
                    <option value="newindia">New India Assurance</option>
                    <option value="others">Others</option>
                  </select>
                </FormField>
                <FormField label="Insurance Expiry" required>
                  <Input
                    name="insuranceExpiry"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Permit Expiry Date" required>
                  <Input
                    name="permitExpiryDate"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
              </div>
              <div>
                <FormField label="N.P. Expiry Date" required>
                  <Input
                    name="npExpiryDate"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Quarterly Tax Expiry" required>
                  <Input
                    name="quarterlyTaxExpiry"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Loan Status" required>
                  <RadioGroup
                    name="loanStatus"
                    options={[
                      { value: "Closed", label: "Closed" },
                      { value: "Open", label: "Open" },
                    ]}
                    required
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      case "load_availed_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FormField label="Loan Provider" required>
                  <select
                    name="loanProvider"
                    className="form-control border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Loan Provider</option>
                    <option value="bankA">Bank A</option>
                    <option value="bankB">Bank B</option>
                    <option value="financeCompany">Finance Company</option>
                    <option value="others">Others</option>
                  </select>
                </FormField>
                <FormField label="Loan Start Date" required>
                  <Input
                    name="loanStartDate"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
              </div>
              <div>
                <FormField label="Loan Amount" required>
                  <Input
                    name="loanAmount"
                    type="number" className="number_with_decimal"
                    placeholder="Enter Loan Amount"
                    data-validate="required"
                    min="0"
                    step="0.01"
                  />
                </FormField>
                <FormField label="Loan Tenure" required>
                  <Input
                    name="loanTenure"
                    type="number" className="whole_number"
                    placeholder="Enter Loan Tenure (months/years)"
                    data-validate="required"
                    min="0"
                  />
                </FormField>
                <FormField label="Loan Interest" required>
                  <Input
                    name="loanInterest" className="number_with_decimal"
                    type="number"
                    placeholder="Enter Loan Interest (%)"
                    data-validate="required"
                    min="0"
                    step="0.01"
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      case "vehicle_purchase_details":
        return (
          <div className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <FormField label="Truck Invoice No." required>
                  <Input
                    name="truckInvoiceNo" className="alphanumeric all_uppercase"
                    placeholder="Enter Truck Invoice Number"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Truck Invoice Date" required>
                  <Input
                    name="truckInvoiceDate"
                    type="date"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Endorsement Status" required>
                  <RadioGroup
                    name="endorsementStatus"
                    options={[
                      { value: "Endorsed", label: "Endorsed" },
                      { value: "Not Endorsed", label: "Not Endorsed" },
                    ]}
                    required
                  />
                </FormField>
                <FormField label="Endorsed With">
                  <Input
                    name="endorsedWith" className="alphanumeric capitalize"
                    placeholder="Enter Truck Endorsed With"
                  />
                </FormField>
              </div>
              <div>
                <FormField label="Truck Status" required>
                  <RadioGroup
                    name="truckStatus"
                    options={[
                      { value: "Running", label: "Running" },
                      { value: "Sold", label: "Sold" },
                    ]}
                    required
                  />
                </FormField>
                <FormField label="Duty Driver Name" required>
                  <Input
                    name="dutyDriverName" className="alphabet_only capitalize"
                    placeholder="Enter Duty Driver Name"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="Dealer Name" required>
                  <Input
                    name="dealerName" className="alphabet_only capitalize"
                    placeholder="Enter Dealer Name"
                    data-validate="required"
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
              <p className="text-gray-500">
                {tabs.find((tab) => tab.id === activeTab)?.label} content will
                be added here
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout pageTitle="Vehicle Registration">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div
            className="px-4 py-6"
            style={{ height: "calc(100vh - 103px)", overflowY: "auto" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField
                    label="Truck Registration Number"
                    required
                    className="md:items-start"
                  >
                    <Input
                      name="truck-registration"
                      placeholder="Enter registration number"
                      className="alphanumeric no_space all_uppercase"
                      data-validate="required"
                    />{" "}
                  </FormField>
                  <FormField
                    label="Truck Type"
                    required
                    className="md:items-start"
                  >
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
                  <FormField
                    label="Makers Name"
                    required
                    className="md:items-start"
                  >
                    <Input
                      name="maker-name"
                      placeholder="Enter makers name"
                      className="capitalize alphanumeric"
                      data-validate="required"
                    />
                  </FormField>
                  <FormField
                    label="Nature of Goods Weight"
                    required
                    className="md:items-start"
                  >
                    <Input
                      name="goods-weight"
                      placeholder="Enter weight"
                      className="only_number"
                      data-validate="required"
                    />
                  </FormField>
                </div>
              </div>

              <div className="mx-2 mt-5">
                <ul className="flex whitespace-nowrap w-full border-b border-gray-300 mr-3">
                  {tabs.map((tab) => (
                    <li
                      key={tab.id}
                      className={`mr-6 pb-2 cursor-pointer hover:text-[#009333] ${
                        activeTab === tab.id
                          ? "text-[#009333] border-b-2 border-[#009333]"
                          : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">{renderTabContent()}</div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-sm btn-primary"
          >
            Save
          </button>
          <button type="button" className="btn-secondary">
            Cancel
          </button>
        </footer>
      </div>
    </Layout>
  );
}
