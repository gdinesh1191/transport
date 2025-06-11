"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Layout from "../../../components/Layout";

// Type definitions
interface BankDetails {
  id: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  ifscCode: string;
  branchName: string;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface InputProps {
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  "data-validate"?: string;
}

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  required?: boolean;
}

// Form field components for reusability
const FormField: React.FC<FormFieldProps> = ({ label, required = false, children, className = "" }) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-1/2">
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4">{children}</div>
  </div>
);

const Input: React.FC<InputProps> = ({ name, placeholder, type = "text", className = "", ...props }) => (
  <input type={type} name={name} placeholder={placeholder} className={`form-control ${className}`} {...props} />
);

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, required = false }) => (
  <div className="space-x-4">
    {options.map((option, index) => (
      <label key={option.value} className="form-label">
        <input type="radio" name={name} value={option.value} className="form-radio" {...(required && index === 0 ? { "data-validate": "required" } : {})} />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);

export default function NewEmployee() {
  const [activeTab, setActiveTab] = useState<string>("Bank_details");
  const [showModal, setShowModal] = useState<boolean>(true);
  const [employeeType, setEmployeeType] = useState<string>("");

  const [bankForm, setBankForm] = useState<Omit<BankDetails, "id">>({
    bankName: "", accountNumber: "", accountName: "", ifscCode: "", branchName: "",
  });

  const [proofDetailsForm, setProofDetailsForm] = useState({
    aadhaarNumber: "", panNumber: "",
  });

  const [driverDetailsForm, setDriverDetailsForm] = useState({
    licenseNumber: "", licenseExpiry: "", truckNumber: "", licenseIssuedBy: "",
  });

  const handleProofChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProofDetailsForm({ ...proofDetailsForm, [e.target.name]: e.target.value });
  };

  const handleDriverChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriverDetailsForm({ ...driverDetailsForm, [e.target.name]: e.target.value });
  };

  const [bankList, setBankList] = useState<BankDetails[]>([]);
  const [bankIdCounter, setBankIdCounter] = useState<number>(1);
  const [bankError, setBankError] = useState<string>("");

  const handleBankChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "accountNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setBankForm({ ...bankForm, [name]: numericValue });
    } else {
      setBankForm({ ...bankForm, [name]: value });
    }
    setBankError("");
  };

  const handleAddBank = () => {
    const { bankName, accountNumber, accountName, ifscCode, branchName } = bankForm;

    if (bankName && accountNumber && accountName && ifscCode && branchName) {
      const newBank: BankDetails = {
        id: bankIdCounter, bankName, accountNumber, accountName, ifscCode, branchName,
      };

      setBankList((prev) => [...prev, newBank]);
      setBankIdCounter((prev) => prev + 1);

      // Clear form
      setBankForm({ bankName: "", accountNumber: "", accountName: "", ifscCode: "", branchName: "" });
    } else {
      setBankError('Please fill all bank details before clicking "Add Bank".');
    }
  };

  const handleEditBank = (id: number) => {
    const bank = bankList.find((b) => b.id === id);
    if (bank) {
      const { id: bankId, ...bankWithoutId } = bank;
      setBankForm(bankWithoutId);
      setBankList((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleDeleteBank = (id: number) => {
    setBankList((prev) => prev.filter((b) => b.id !== id));
  };

  const handleEmployeeTypeChange = (type: string) => {
    setEmployeeType(type);
    setShowModal(false);
  };

  const tabs = [
    { id: "Bank_details", label: "Bank Details" },
    { id: "Proof_details", label: "Proof Details" },
    ...(employeeType === "Driver" ? [{ id: "Driver_details", label: "Driver Details" }] : []),
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submission logic here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bank_details":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
            <div className="lg:border-r lg:border-gray-300 lg:pr-4">
              <div>
                <FormField label="Account Name" required><Input type="text" name="accountName" value={bankForm.accountName} onChange={handleBankChange} placeholder="Enter Account Name" className="capitalize " data-validate="required" /></FormField>
                <FormField label="Account Number" required><Input name="accountNumber" type="text" value={bankForm.accountNumber} onChange={handleBankChange} className="only_number" placeholder="Enter Account Number" data-validate="required" /></FormField>
                <FormField label="IFSC Code" required><Input name="ifscCode" type="text" value={bankForm.ifscCode} onChange={handleBankChange} placeholder="Enter IFSC Code" data-validate="required" className="alphanumeric" /></FormField>
                <FormField label="Bank Name" required><Input name="bankName" type="text" value={bankForm.bankName} onChange={handleBankChange} placeholder="Enter Bank Name" className="capitalize" data-validate="required" /></FormField>
                <FormField label="Branch Name" required><Input name="branchName" type="text" value={bankForm.branchName} onChange={handleBankChange} placeholder="Enter Branch Name" className="capitalize" data-validate="required" /></FormField>
                {bankError && (<div className="text-red-500 text-sm mt-2 text-end">{bankError}</div>)}
                <FormField label=""><input type="button" value="Add Bank" onClick={handleAddBank} className="mt-2 w-full px-4 py-2 rounded bg-[#009333] text-white text-sm font-medium hover:bg-[#007a2a]" /></FormField>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-left">
                <thead className="text-[#475867]">
                  <tr>
                    <th className="px-3 py-2">S.No</th>
                    <th className="px-3 py-2">Account Name</th>
                    <th className="px-3 py-2">Account Number</th>
                    <th className="px-3 py-2">IFSC</th>
                    <th className="px-3 py-2">Bank</th>
                    <th className="px-3 py-2">Branch</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[#000000]">
                  {bankList.map((bank, index) => (
                    <tr key={bank.id}>
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{bank.accountName}</td>
                      <td className="px-3 py-2">{bank.accountNumber}</td>
                      <td className="px-3 py-2">{bank.ifscCode}</td>
                      <td className="px-3 py-2">{bank.bankName}</td>
                      <td className="px-3 py-2">{bank.branchName}</td>
                      <td className="px-3 py-2 text-center">
                        <button type="button" onClick={() => handleEditBank(bank.id)} className="text-blue-500 ">Edit</button>
                        <button type="button" onClick={() => handleDeleteBank(bank.id)} className="text-red-500  ml-2">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Driver_details":
        if (employeeType !== "Driver") return null;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
            <div>
              <FormField label="License Number" required><Input name="licenseNumber" className="form-control" value={driverDetailsForm.licenseNumber} onChange={handleDriverChange} placeholder="Enter License Number" data-validate="required" /></FormField>
              <FormField label="License Expiry Date" required><Input type="date" className="form-control" name="licenseExpiry" value={driverDetailsForm.licenseExpiry} onChange={handleDriverChange} data-validate="required" /></FormField>
              <FormField label="Truck Number" required><Input name="truckNumber" className="form-control" value={driverDetailsForm.truckNumber} onChange={handleDriverChange} placeholder="Enter Truck Number" /></FormField>
              <FormField label="License Issued By" required><Input name="licenseIssuedBy" value={driverDetailsForm.licenseIssuedBy} onChange={handleDriverChange} placeholder="Enter License Issued By" /></FormField>
            </div>
            <div></div>
          </div>
        );

      default:
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
              <div className="space-y-4">
                <FormField label="Aadhaar Number" required><Input name="aadhaarNumber" value={proofDetailsForm.aadhaarNumber} onChange={handleProofChange} placeholder="Enter Aadhaar Number" className="form-control w-full numeric-only" maxLength={12} data-validate="required" /></FormField>
                <FormField label="PAN Number" required><Input name="panNumber" value={proofDetailsForm.panNumber} onChange={handleProofChange} placeholder="Enter PAN Number" className="form-control w-full alphanumeric" maxLength={10} data-validate="required" /></FormField>
              </div>
            </div>
            <div></div>
          </div>
        );
    }
  };

  return (
    <Layout pageTitle="Employee New">
      <div className="min-h-screen">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-103px)]">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-gray-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
                  <FormField label="Name" required>
                    <div>
                      <div className="flex gap-2">
                        <select name="salutation" className="form-control w-30">
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                        </select>
                        <Input name="employeeName" placeholder="Enter Name" className="form-control lg: w-300 capitalize alphabet-only " data-validate="required" />
                      </div>
                    </div>
                  </FormField>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
                <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                  <FormField label="DOB" required><Input name="dob" type="date" className="form-control w-full" data-validate="required" /></FormField>
                  <FormField label="Gender" required>
                    <select name="gender" className="form-control " data-validate="required">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                  <FormField label="Blood Group" required><Input name="bloodGroup" placeholder="Enter Blood Group" className="form-control w-full" data-validate="required" /></FormField>
                  <FormField label="Phone Number" required><Input name="phone" placeholder="Enter Phone Number" className="form-control w-full numeric-only" data-validate="required" /></FormField>
                  <FormField label="Whatsapp Number" required><Input name="whatsapp" placeholder="Enter Phone Number" className="form-control w-full numeric-only" data-validate="required" /></FormField>
                  <FormField label="Family Number"><Input name="familyNumber" placeholder="Enter Phone Number" className="form-control w-full numeric-only" /></FormField>
                </div>

                <div className="space-y-4">
                  <FormField label="Address Line 1"><Input name="addressLine1" placeholder="Enter Address Line 1" className="form-control w-full capitalize" /></FormField>
                  <FormField label=""><Input name="addressLine2" placeholder="Enter Address Line 2" className="form-control w-full capitalize" /></FormField>
                  <FormField label="Picture Path"><Input type="file" name="picture" className="w-full" /></FormField>
                  <FormField label="Remarks"><Input name="remarks" placeholder="Enter Remarks" className="form-control w-full capitalize" /></FormField>
                  <div>
                    <FormField label="State" required>
                      <select name="state" className="form-control w-full" data-validate="required">
                        <option value="">Select State</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                    </FormField>
                    <FormField label="Pincode"><Input name="pincode" placeholder="Enter Pincode" className="w-full numeric-only" /></FormField>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mx-2 mt-5">
                <ul className="flex whitespace-nowrap w-full border-b border-gray-300 mr-3">
                  {tabs.map((tab) => (
                    <li key={tab.id} className={`mr-6 pb-2 cursor-pointer hover:text-[#009333] ${activeTab === tab.id ? "text-[#009333] border-b-2 border-[#009333]" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</li>
                  ))}
                </ul>
              </div>

              {/* Tab Content */}
              <div className="mt-3">{renderTabContent()}</div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button type="submit" onClick={handleSubmit as any} className="btn-sm btn-primary">Save</button>
          <button type="button" className="btn-sm btn-secondary">Cancel</button>
        </footer>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[500px] mx-4 mt-10">
            <div className="text-center p-4">
              <div className="flex justify-center items-center mb-5 gap-2">
                <i className="ri-user-line text-green-600 text-3xl"></i>
                <h2 className="text-[#000000] text-2xl">Select Employee Type</h2>
              </div>
              <p className="text-md text-gray-600 mb-7">Choose the employee type that best describes your business</p>
              <div className="flex gap-4 justify-center">
                <button type="button" onClick={() => { setEmployeeType("staff"); setShowModal(false); }} className="employee_type_btn bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800 px-4 py-2 rounded-md w-full">Staff</button>
                <button type="button" onClick={() => { setEmployeeType("Driver"); setShowModal(false); }} className="employee_type_btn bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800 px-4 py-2 rounded-md w-full">Driver</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}