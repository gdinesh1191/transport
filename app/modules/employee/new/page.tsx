"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import Layout from "../../../components/Layout";

import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import useInputValidation from "@/app/utils/inputValidations";
import DatePicker from "@/app/utils/commonDatepicker";
import { validateForm, FormErrors } from "@/app/utils/formValidations";
import { Input, RadioGroup } from "@/app/utils/form-controls";

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
  error?: string; // Add an error prop to FormField
  htmlFor?: string;
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

const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error,
  htmlFor, // Destructure htmlFor prop
}: FormFieldProps) => (
  <div
    className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}
  >
    <label className="form-label w-50" htmlFor={htmlFor}>
      {" "}
      {/* Use htmlFor here */}
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4">
      {children}
      {error && ( // Conditionally render error message
        <p className="error-message text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  </div>
);

export default function NewEmployee() {
  const [activeTab, setActiveTab] = useState<string>("Bank_details");
  const [showModal, setShowModal] = useState<boolean>(true);
  const [employeeType, setEmployeeType] = useState<string>("");
  const [fileName, setFileName] = useState("No file chosen");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  useInputValidation();
  const [dob, setDob] = useState<Date | undefined>();
  const [licenseExpiryDate, handleLicenseExpiryChange] = useState<
    Date | undefined
  >();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [familyNumber, setFamilyNumber] = useState("");

  const stateOptions = [
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Telangana", label: "Telangana" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Punjab", label: "Punjab" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  ];

  const [bankForm, setBankForm] = useState<Omit<BankDetails, "id">>({
    bankName: "",
    accountNumber: "",
    accountName: "",
    ifscCode: "",
    branchName: "",
  });

  const [proofDetailsForm, setProofDetailsForm] = useState({
    aadhaarNumber: "",
    panNumber: "",
  });

  const [driverDetailsForm, setDriverDetailsForm] = useState({
    licenseNumber: "",
    licenseExpiry: "",
    truckNumber: "",
    licenseIssuedBy: "",
  });

  const handleProofChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProofDetailsForm({
      ...proofDetailsForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDriverChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriverDetailsForm({
      ...driverDetailsForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    let value = e.target.value.replace(/[^\d]/g, "");

    // Ensure first digit is between 6–9 if it's the first digit
    if (value.length === 1 && !/^[6-9]$/.test(value)) return;

    setter(value);
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
    const { bankName, accountNumber, accountName, ifscCode, branchName } =
      bankForm;

    if (bankName && accountNumber && accountName && ifscCode && branchName) {
      const newBank: BankDetails = {
        id: bankIdCounter,
        bankName,
        accountNumber,
        accountName,
        ifscCode,
        branchName,
      };

      setBankList((prev) => [...prev, newBank]);
      setBankIdCounter((prev) => prev + 1);

      // Clear form
      setBankForm({
        bankName: "",
        accountNumber: "",
        accountName: "",
        ifscCode: "",
        branchName: "",
      });

      setBankError("");
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Example size validation (optional)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should not exceed 2MB.");
        fileInput.value = ""; // ✅ This is allowed
        setFileName("No file chosen");
        return;
      }

      setFileName(file.name); // ✅ Update UI
    } else {
      setFileName("No file chosen");
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
    ...(employeeType === "Driver"
      ? [{ id: "Driver_details", label: "Driver Details" }]
      : []),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submission logic here

    if (formRef.current) {
      const validationResults = validateForm(formRef.current); // Get all errors
      setFormErrors(validationResults); // Update error state

      const isFormValid = Object.keys(validationResults).length === 0;

      if (isFormValid) {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());
        console.log("Form submitted successfully", formValues);




          let firstErrorTabId: string | null = null;
        for (const tab of tabs) {
          // Check if any field within this tab has an error
          const tabContentDiv = formRef.current.querySelector(
            `#${tab.id}_tab_content`
          );
          if (tabContentDiv) {
            const fieldsInTab =
              tabContentDiv.querySelectorAll<HTMLElement>("[name]");
            for (const field of fieldsInTab) {
              if (
                field.getAttribute("name") &&
                validationResults[field.getAttribute("name")!]
              ) {
                firstErrorTabId = tab.id;
                break;
              }
            }
          }
          if (firstErrorTabId) break;
        }

        if (firstErrorTabId && firstErrorTabId !== activeTab) {
          setActiveTab(firstErrorTabId); // Switch to the tab with the first error
          // Optional: Scroll to the first error field in that tab
          setTimeout(() => {
            // Find the *first* error message element within the *entire form* after the tab has switched
            const firstErrorFieldElement =
              formRef.current?.querySelector(`.error-message`);
            if (firstErrorFieldElement) {
              firstErrorFieldElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 100); // Give React time to render the new tab content
        }
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bank_details":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
            <div className="lg:border-r lg:border-gray-300 lg:pr-4">
              <div>
                <FormField label="Account Name" required>
                  <Input
                    type="text"
                    name="accountName"
                    value={bankForm.accountName}
                    onChange={handleBankChange}
                    placeholder="Enter Account Name"
                    className="alphabet_only capitalize"
                    maxLength={50}
                  />
                </FormField>

                <FormField label="Account Number" required>
                  <Input
                    name="accountNumber"
                    type="text"
                    value={bankForm.accountNumber}
                    onChange={handleBankChange}
                    className="only_number"
                    placeholder="Enter Account Number"
                    maxLength={18}
                  />
                </FormField>

                <FormField label="IFSC Code" required>
                  <Input
                    name="ifscCode"
                    type="text"
                    value={bankForm.ifscCode}
                    onChange={handleBankChange}
                    placeholder="Enter IFSC Code"
                    className="alphanumeric all_uppercase"
                    maxLength={11}
                  />
                </FormField>

                <FormField label="Bank Name" required>
                  <Input
                    name="bankName"
                    type="text"
                    value={bankForm.bankName}
                    onChange={handleBankChange}
                    placeholder="Enter Bank Name"
                    className="alphabet_only capitalize"
                    maxLength={50}
                  />
                </FormField>

                <FormField label="Branch Name" required>
                  <Input
                    name="branchName"
                    type="text"
                    value={bankForm.branchName}
                    onChange={handleBankChange}
                    placeholder="Enter Branch Name"
                    className="alphabet_only capitalize"
                    maxLength={50}
                  />
                </FormField>

                {bankError && (
                  <div className="text-red-500 text-sm mt-2 text-end">
                    {bankError}
                  </div>
                )}
                <FormField label="">
                  <button
                    type="button"
                    onClick={handleAddBank}
                    className="btn-sm btn-primary"
                  >
                    Add Bank
                  </button>
                </FormField>
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
                        <button
                          type="button"
                          onClick={() => handleEditBank(bank.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <i className="ri-pencil-line text-lg cursor-pointer"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBank(bank.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <i className="ri-delete-bin-line text-lg cursor-pointer"></i>
                        </button>
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
              <FormField label="License Number" required
                              error={formErrors.licenseNumber} 
                                                            htmlFor="licenseNumber">
                <Input
                  name="licenseNumber"
                  className="form-control alphanumeric all_uppercase"
                  value={driverDetailsForm.licenseNumber}
                  onChange={handleDriverChange}
                  placeholder="Enter License Number"
                  maxLength={20}
                  data-validate="required"
                />
              </FormField>
              <FormField label="License Expiry Date" required
                error={formErrors.licenseExpiry} htmlFor="licenseExpiry">
                <DatePicker
                  date={licenseExpiryDate}
                  disablePast
                  setDate={handleLicenseExpiryChange}
                  name="licenseExpiry"
                  data-validate="required"
                />
              </FormField>

              <FormField label="License Issued By" required
                              error={formErrors.licenseIssuedBy} htmlFor="licenseIssuedBy">
                <Input
                  name="licenseIssuedBy"
                  className="form-control alphabet_only capitalize"
                  value={driverDetailsForm.licenseIssuedBy}
                  onChange={handleDriverChange}
                  placeholder="Enter License Issued By"
                  data-validate="required"
                  maxLength={50}
                />
              </FormField>
            </div>
            <div></div>
          </div>
        );

      default:
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
              <div className="space-y-4">
                <FormField label="Aadhaar Number" required
                                  error={formErrors.aadhaarNumber} htmlFor="aadhaarNumber">
                  <Input
                    name="aadhaarNumber"
                    value={proofDetailsForm.aadhaarNumber}
                    onChange={handleProofChange}
                    placeholder="Enter Aadhaar Number"
                    className="only_number"
                    maxLength={12}
                    data-validate="required"
                  />
                </FormField>
                <FormField label="PAN Number" required 
                                                  error={formErrors.panNumber} htmlFor="panNumber">
                  <Input
                    name="panNumber"
                    value={proofDetailsForm.panNumber}
                    onChange={handleProofChange}
                    placeholder="Enter PAN Number"
                    className="alphanumeric all_uppercase"
                    maxLength={10}
                    data-validate="required"
                  />
                </FormField>
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
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              <div className="border-b border-gray-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 px-4 py-2">
                  <FormField
                    label="Name"
                    required
                    error={formErrors.employeeName}
                    htmlFor="employeeName"
                  >
                    <div>
                      <div className="flex gap-2">
                        <select name="salutation" className="form-control w-30">
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                        </select>
                        <Input
                          data-validate="required"
                          name="employeeName"
                          placeholder="Enter Name"
                          className="form-control lg: w-300 alphabet_only capitalize"
                        />
                      </div>
                    </div>
                  </FormField>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 px-4 py-6">
                <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                  <FormField label="DOB" required>
                    <DatePicker
                      date={dob}
                      disableFuture
                      setDate={setDob}
                      name="dob"
                      className=" w-full"
                      data-validate="required"
                    />
                  </FormField>
                  <FormField
                    label="Gender"
                    required
                    error={formErrors.gender}
                    htmlFor="gender"
                  >
                    <select
                      name="gender"
                      className="form-control "
                      data-validate="required"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                  <FormField
                    label="Blood Group"
                    required
                    error={formErrors.bloodGroup}
                    htmlFor="bloodGroup"
                  >
                    <Input
                      name="bloodGroup"
                      placeholder="Enter Blood Group"
                      className="form-control w-full all_uppercase"
                      data-validate="required"
                    />
                  </FormField>
                  <FormField
                    label="Phone Number"
                    required
                    error={formErrors.phoneNumber}
                    htmlFor="phoneNumber"
                  >
                    <Input
                      name="phoneNumber"
                      placeholder="Enter Phone Number"
                      className="form-control w-full only_number"
                      data-validate="required"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e: any) =>
                        handleNumberChange(e, setPhoneNumber)
                      }
                    />
                  </FormField>
                  <FormField
                    label="Whatsapp Number"
                    required
                    error={formErrors.whatsappNumber}
                    htmlFor="whatsappNumber"
                  >
                    <Input
                      name="whatsappNumber"
                      placeholder="Enter Phone Number"
                      className="form-control w-full only_number"
                      data-validate="required"
                      maxLength={10}
                      value={whatsappNumber}
                      onChange={(e: any) =>
                        handleNumberChange(e, setWhatsappNumber)
                      }
                    />
                  </FormField>
                  <FormField label="Family Number">
                    <Input
                      name="familyNumber"
                      placeholder="Enter Phone Number"
                      className="form-control w-full only_number"
                      maxLength={10}
                      value={familyNumber}
                      onChange={(e: any) =>
                        handleNumberChange(e, setFamilyNumber)
                      }
                    />
                  </FormField>
                </div>

                <div className="space-y-4">
                  <FormField label="Address Line 1">
                    <Input
                      name="addressLine1"
                      placeholder="Enter Address Line 1"
                      className="form-control w-full  capitalize "
                    />
                  </FormField>
                  <FormField label="">
                    <Input
                      name="addressLine2"
                      placeholder="Enter Address Line 2"
                      className="form-control w-full  capitalize"
                    />
                  </FormField>

                  <FormField label="Picture Path" required>
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label
                            htmlFor="picturepathInput"
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
                      <Input
                        type="file"
                        id="picturepathInput"
                        name="picturepath"
                        className="hidden"
                        onChange={handleFileUpload}
                        required
                      />
                    </div>
                  </FormField>
                  <FormField label="Remarks">
                    <Input
                      name="remarks"
                      placeholder="Enter Remarks"
                      className="form-control w-full alphabetnumeric capitalize"
                    />
                  </FormField>
                  <div>
                    <FormField
                      label="State"
                      required
                      error={formErrors.state}
                      htmlFor="state"
                    >
                      <SearchableSelect
                        name="state"
                        placeholder="Select State"
                        options={stateOptions}
                        searchable
                        className="w-full"
                        data-validate="required"
                      />
                    </FormField>
                    <FormField label="Pincode">
                      <Input
                        name="pincode"
                        placeholder="Enter Pincode"
                        className="w-full only_number"
                        maxLength={6}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
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

              {/* Tab Content */}
              <div className="mt-3">{renderTabContent()}</div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button
            type="submit"
            onClick={handleSubmit as any}
            className="btn-sm btn-primary"
          >
            Save
          </button>
          <button
            type="button"
            className="btn-sm btn-secondary"
            onClick={() => setFormErrors({})}
          >
            Cancel
          </button>
        </footer>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[500px] mx-4 mt-10">
            <div className="text-center p-4">
              <div className="flex justify-center items-center mb-5 gap-2">
                <i className="ri-user-line text-green-600 text-3xl"></i>
                <h2 className="text-[#000000] text-2xl">
                  Select Employee Type
                </h2>
              </div>
              <p className="text-md text-gray-600 mb-7">
                Choose the employee type that best describes your business
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmployeeType("staff");
                    setShowModal(false);
                  }}
                  className="employee_type_btn bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800 px-4 py-2 rounded-md w-full"
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmployeeType("Driver");
                    setShowModal(false);
                  }}
                  className="employee_type_btn bg-[#f3f4f6] hover:bg-[#009333] hover:text-white  text-gray-800 px-4 py-2 rounded-md w-full"
                >
                  Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
