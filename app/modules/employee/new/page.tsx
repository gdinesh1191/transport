"use client";

import {useState,ChangeEvent,FormEvent,useRef,ReactNode,useEffect,} from "react";
import Layout from "../../../components/Layout";
import useInputValidation from "@/app/utils/inputValidations"; 
import DatePicker from "@/app/utils/commonDatepicker";
import { validateForm, FormErrors } from "@/app/utils/formValidations"; 
import { Input } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import ToastContainer, { showToast } from "@/app/utils/toaster";

interface BankDetails {
  id: number; bankName: string; accountNumber: string; accountName: string; ifscCode: string; branchName: string;
}

interface FormData {
  salutation: string; employeeName: string; phoneNumber: string; whatsappNumber: string; familyName: string; dob: Date | undefined; gender: string; bloodGroup: string; addressLine1: string; addressLine2: string; picturepath: File | null; remarks: string; state: string; pincode: string; 
  bankDetails: Omit<BankDetails, "id">; 
  bankList: BankDetails[]; 
  proofDetails: { aadhaarNumber: string; panNumber: string; };
  driverDetails: { licenseNumber: string; licenseExpiry: Date | undefined; truckNumber: string; licenseIssuedBy: string; };
}

interface FormFieldProps {
  label: string; required?: boolean; children: ReactNode; className?: string; error?: string; htmlFor?: string;
}

const FormField = ({ label, required = false, children, className = "", error, htmlFor }: FormFieldProps) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-start gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50 mt-2" htmlFor={htmlFor}>{label}{required && <span className="form-required text-red-500">*</span>} </label>
    <div className="flex flex-col w-3/4">{children}{error && (<p className="error-message text-red-500 text-xs mt-1">{error}</p>)} </div>
  </div>
);

export default function NewEmployee() {
  const [activeTab, setActiveTab] = useState<string>("Bank_details");
  const [showModal, setShowModal] = useState<boolean>(true);
  const [employeeType, setEmployeeType] = useState<string>(""); // "Staff" or "Driver"
  const [fileName, setFileName] = useState("No file chosen");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
<<<<<<< HEAD
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [familyNumber, setFamilyNumber] = useState("");


  const [dob, setDob] = useState<Date | undefined>();
  useInputValidation(); // For real-time input formatting/masking
  const stateOptions = [

    { value: "Tamil Nadu", label: "Tamil Nadu" }

   

  ];
=======
  useInputValidation(); 
  const stateOptions = [{ value: "Tamil Nadu", label: "Tamil Nadu" }];
  
>>>>>>> 5918a04772cf11794335f23e04513e857b765067
  const [formData, setFormData] = useState<FormData>({
    salutation: "Mr.", employeeName: "", phoneNumber: "", whatsappNumber: "", familyName: "", dob: undefined, gender: "", bloodGroup: "", addressLine1: "", addressLine2: "", picturepath: null, remarks: "", state: "", pincode: "",
    bankDetails: { bankName: "", accountNumber: "", accountName: "", ifscCode: "", branchName: "" },
    bankList: [],
    proofDetails: { aadhaarNumber: "", panNumber: "" },
    driverDetails: { licenseNumber: "", licenseExpiry: undefined, truckNumber: "", licenseIssuedBy: "" },
  });
  
  const [bankIdCounter, setBankIdCounter] = useState<number>(1);
  const [bankInputError, setBankInputError] = useState<string>("");
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, picturepath: file }));
    setFileName(file ? file.name : "No file chosen");
  };

  const handleBankChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: name === "accountNumber" ? value.replace(/[^0-9]/g, "") : value },
    }));
    setBankInputError("");
  };

  const handleProofChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, proofDetails: { ...prev.proofDetails, [e.target.name]: e.target.value } }));
  };

  const handleDriverChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, driverDetails: { ...prev.driverDetails, [e.target.name]: e.target.value } }));
  };

  const handleDateChange = (date: Date | undefined, fieldName: "dob" | "licenseExpiry") => {
    if (fieldName === "dob") {
      setFormData((prev) => ({ ...prev, dob: date }));
    } else if (fieldName === "licenseExpiry") {
      setFormData((prev) => ({ ...prev, driverDetails: { ...prev.driverDetails, licenseExpiry: date } }));
    }
  };
 
  const handleSearchableSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBank = () => {
    const { bankName, accountNumber, accountName, ifscCode, branchName } = formData.bankDetails;

    if (bankName && accountNumber && accountName && ifscCode && branchName) {
      const newBank: BankDetails = { id: bankIdCounter, bankName, accountNumber, accountName, ifscCode, branchName };

      setFormData((prev) => ({ ...prev, bankList: [...prev.bankList, newBank] }));
      setBankIdCounter((prev) => prev + 1);

      setFormData((prev) => ({
        ...prev,
        bankDetails: { bankName: "", accountNumber: "", accountName: "", ifscCode: "", branchName: "" },
      }));
      setBankInputError("");
    } else {
      setBankInputError('Please fill all bank details before clicking "Add Bank".');
    }
  };

  const handleEditBank = (id: number) => {
    const bankToEdit = formData.bankList.find((b) => b.id === id);
    if (bankToEdit) {
      const { id: bankId, ...bankWithoutId } = bankToEdit;
      setFormData((prev) => ({ ...prev, bankDetails: bankWithoutId, bankList: prev.bankList.filter((b) => b.id !== id) }));
    }
  };

  const handleDeleteBank = (id: number) => {
    setFormData((prev) => ({ ...prev, bankList: prev.bankList.filter((b) => b.id !== id) }));
  };

  const handleEmployeeTypeChange = (type: string) => {
    setEmployeeType(type);
    setShowModal(false);
    if (type === "Staff" && activeTab === "Driver_details") {
      setActiveTab("Proof_details");
    }
    // Set initial tab based on employee type selection
    setActiveTab(type === "Staff" ? "Proof_details" : "Bank_details");
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

  const tabs = [
    { id: "Bank_details", label: "Bank Details" },
    { id: "Proof_details", label: "Proof Details" },
    ...(employeeType === "Driver" ? [{ id: "Driver_details", label: "Driver Details" }] : []),
  ];

  const handleErrorToast = () => showToast.error("Please correct the errors in the form."); // Changed error message

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const currentErrors: FormErrors = {};

    // --- Manual Validation for non-visible data (like arrays) ---
    if (formData.bankList.length === 0) {
      currentErrors.bankList = "At least one bank account is required.";
    }

    // --- Create temporary hidden inputs for all fields to be validated by validateForm ---
    const tempInputs: HTMLInputElement[] = [];

    const createTempInput = (name: string, value: string, dataValidate?: string) => {
      const input = document.createElement("input");
      input.type = "hidden"; input.name = name; input.value = value;
      if (dataValidate) input.setAttribute("data-validate", dataValidate);
      formRef.current?.appendChild(input);
      tempInputs.push(input);
    };

    const formatDate = (date?: Date) => date ? date.toISOString().split("T")[0] : "";

    // General Fields - now reflecting formData state
    createTempInput("employeeName", formData.employeeName, "required");
    createTempInput("phoneNumber", formData.phoneNumber, "required");
    createTempInput("whatsappNumber", formData.whatsappNumber, "required");
    createTempInput("familyName", formData.familyName, "required");
    createTempInput("dob", formatDate(formData.dob), "required");
    createTempInput("gender", formData.gender, "required");
    createTempInput("bloodGroup", formData.bloodGroup, "required");
    createTempInput("picturepath", formData.picturepath ? "file_present" : "", "required"); // Check for file presence
    createTempInput("state", formData.state, "required");

    // Proof Details
    createTempInput("aadhaarNumber", formData.proofDetails.aadhaarNumber, "required");
    createTempInput("panNumber", formData.proofDetails.panNumber, "required");

    // Driver-only Fields
    if (employeeType === "Driver") {
      createTempInput("licenseNumber", formData.driverDetails.licenseNumber, "required");
      createTempInput("licenseExpiry", formatDate(formData.driverDetails.licenseExpiry), "required");
      createTempInput("licenseIssuedBy", formData.driverDetails.licenseIssuedBy, "required");
    }

    // --- Run validation ---
    const validationResults = validateForm(formRef.current);
    Object.assign(currentErrors, validationResults);
    setFormErrors(currentErrors);

    // Cleanup temporary inputs
    tempInputs.forEach((input) => formRef.current?.removeChild(input));

    const isFormValid = Object.keys(currentErrors).length === 0;

    if (isFormValid) {
      console.log("Form submitted successfully!", formData);

      // Reset form state
      setFormData({
        salutation: "Mr.", employeeName: "", phoneNumber: "", whatsappNumber: "", familyName: "", dob: undefined, gender: "", bloodGroup: "", addressLine1: "", addressLine2: "", picturepath: null, remarks: "", state: "", pincode: "",
        bankDetails: { bankName: "", accountNumber: "", accountName: "", ifscCode: "", branchName: "" },
        bankList: [],
        proofDetails: { aadhaarNumber: "", panNumber: "" },
        driverDetails: { licenseNumber: "", licenseExpiry: undefined, truckNumber: "", licenseIssuedBy: "" },
      });

      setBankIdCounter(1);
      setBankInputError("");
      setFileName("No file chosen");
      setActiveTab(tabs[0].id);

      showToast.success("Employee information saved successfully!");
    } else {
      handleErrorToast();
      let firstErrorTabId: string | null = null;
      if (currentErrors.bankList) {
        firstErrorTabId = "Bank_details";
      } else if (currentErrors.aadhaarNumber || currentErrors.panNumber) {
        firstErrorTabId = "Proof_details";
      } else if (employeeType === "Driver" && (currentErrors.licenseNumber || currentErrors.licenseExpiry || currentErrors.licenseIssuedBy)) {
        firstErrorTabId = "Driver_details";
      } else if (currentErrors.employeeName || currentErrors.phoneNumber || currentErrors.whatsappNumber || currentErrors.familyName || currentErrors.dob || currentErrors.gender || currentErrors.bloodGroup || currentErrors.picturepath || currentErrors.state) {
        firstErrorTabId = "Personal_details"; 
      }

      if (firstErrorTabId && firstErrorTabId !== activeTab) {
        setActiveTab(firstErrorTabId);
        setTimeout(() => {
          const firstErrorField = formRef.current?.querySelector(".error-message");
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bank_details":
        return (
          <div id="Bank_details_tab_content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
              <div className="lg:border-r lg:border-gray-300 lg:pr-4">
                <div>
                  <FormField label="Account Name" required>
                    <Input type="text" name="accountName" value={formData.bankDetails.accountName} onChange={handleBankChange} placeholder="Enter Account Name" className="alphabet_only capitalize" maxLength={50} />
                  </FormField>

                  <FormField label="Account Number" required>
                    <Input name="accountNumber" type="text" value={formData.bankDetails.accountNumber} onChange={handleBankChange} className="only_number" placeholder="Enter Account Number" maxLength={18} />
                  </FormField>

                  <FormField label="IFSC Code" required>
                    <Input name="ifscCode" type="text" value={formData.bankDetails.ifscCode} onChange={handleBankChange} placeholder="Enter IFSC Code" className="alphanumeric all_uppercase" maxLength={11} />
                  </FormField>

                  <FormField label="Bank Name" required>
                    <Input name="bankName" type="text" value={formData.bankDetails.bankName} onChange={handleBankChange} placeholder="Enter Bank Name" className="alphabet_only capitalize" maxLength={50} />
                  </FormField>

                  <FormField label="Branch Name" required>
                    <Input name="branchName" type="text" value={formData.bankDetails.branchName} onChange={handleBankChange} placeholder="Enter Branch Name" className="alphabet_only capitalize" maxLength={50} />
                  </FormField>

                  {bankInputError && (
                    <div className="text-red-500 text-sm mt-2 text-end">{bankInputError}</div>
                  )}
                  <FormField label="">
                    <button type="button" onClick={handleAddBank} className="btn-sm btn-primary">Add Bank</button>
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
                    {formData.bankList.map((bank, index) => (
                      <tr key={bank.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{bank.accountName}</td>
                        <td className="px-3 py-2">{bank.accountNumber}</td>
                        <td className="px-3 py-2">{bank.ifscCode}</td>
                        <td className="px-3 py-2">{bank.bankName}</td>
                        <td className="px-3 py-2">{bank.branchName}</td>
                        <td className="px-3 py-2 text-center">
                          <button type="button" onClick={() => handleEditBank(bank.id)} className="text-blue-500 hover:text-blue-700">
                            <i className="ri-pencil-line text-lg cursor-pointer"></i>
                          </button>
                          <button type="button" onClick={() => handleDeleteBank(bank.id)} className="text-red-500 hover:text-red-700 ml-2">
                            <i className="ri-delete-bin-line text-lg cursor-pointer"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.bankList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-2 text-center text-gray-500">No bank details added.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {formErrors.bankList && (
                  <p className="error-message text-red-500 text-xs mt-1">{formErrors.bankList}</p>
                )}
              </div>
            </div>
          </div>
        );

      case "Driver_details":
        if (employeeType !== "Driver") return null;
        return (
          <div id="Driver_details_tab_content">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
              <div>
                <FormField label="License Number" required error={formErrors.licenseNumber} htmlFor="licenseNumber">
                  <Input name="licenseNumber" className="form-control alphanumeric all_uppercase" value={formData.driverDetails.licenseNumber} onChange={handleDriverChange} placeholder="Enter License Number" maxLength={20} data-validate="required" />
                </FormField>
                <FormField label="License Expiry Date" required error={formErrors.licenseExpiry} htmlFor="licenseExpiry">
                  <DatePicker date={formData.driverDetails.licenseExpiry} disablePast setDate={(date) => handleDateChange(date, "licenseExpiry")} name="licenseExpiry" data-validate="required" />
                </FormField>

                <FormField label="License Issued By" required error={formErrors.licenseIssuedBy} htmlFor="licenseIssuedBy">
                  <Input name="licenseIssuedBy" className="form-control alphabet_only capitalize" value={formData.driverDetails.licenseIssuedBy} onChange={handleDriverChange} placeholder="Enter License Issued By" data-validate="required" maxLength={50} />
                </FormField>
              </div>
              <div></div>
            </div>
          </div>
        );

      default: // This will be "Proof_details" or "Personal_details" if you add a new tab ID
        return (
          <div id="Proof_details_tab_content">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
              <div className="space-y-4">
                <FormField label="Aadhaar Number" required error={formErrors.aadhaarNumber} htmlFor="aadhaarNumber">
                  <Input name="aadhaarNumber" value={formData.proofDetails.aadhaarNumber} onChange={handleProofChange} placeholder="Enter Aadhaar Number" className="only_number" maxLength={12} data-validate="required" />
                </FormField>
                <FormField label="PAN Number" required error={formErrors.panNumber} htmlFor="panNumber">
                  <Input name="panNumber" value={formData.proofDetails.panNumber} onChange={handleProofChange} placeholder="Enter PAN Number" className="alphanumeric all_uppercase" maxLength={10} data-validate="required" />
                </FormField>
              </div>
            </div>
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
                  <FormField label="Name" required error={formErrors.employeeName} htmlFor="employeeName">
                    <div>
                      <div className="flex gap-2">
                        <select name="salutation" className="form-control w-30" value={formData.salutation} onChange={handleChange}>
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                        </select>
                        <Input data-validate="required" name="employeeName" placeholder="Enter Name" className="form-control lg: w-300 alphabet_only capitalize" value={formData.employeeName} onChange={handleChange} />
                      </div>
                    </div>
                  </FormField>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 px-4 py-6">
                <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                  <FormField label="DOB" required error={formErrors.dob} htmlFor="dob">
                    <DatePicker date={formData.dob} disableFuture setDate={(date) => handleDateChange(date, "dob")} name="dob" className="w-full" data-validate="required" />
                  </FormField>
                  <FormField label="Gender" required error={formErrors.gender} htmlFor="gender">
                    <select name="gender" className="form-control" data-validate="required" value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>
                  <FormField label="Blood Group" required error={formErrors.bloodGroup} htmlFor="bloodGroup">
                    <Input name="bloodGroup" placeholder="Enter Blood Group" className="form-control w-full all_uppercase" data-validate="required" value={formData.bloodGroup} onChange={handleChange} maxLength={3} />
                  </FormField>
<<<<<<< HEAD
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
                      onChange={(e:any) => handleNumberChange(e, setPhoneNumber)}

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
                      onChange={(e:any) => handleNumberChange(e, setWhatsappNumber)}

                    />
                  </FormField>
                  <FormField label="Family Number">
                    <Input
                      name="familyNumber"
                      placeholder="Enter Phone Number"
                      className="form-control w-full only_number"
                      maxLength={10}
                     onChange={(e:any) => handleNumberChange(e, setFamilyNumber)}
                    />
=======
                  <FormField label="Phone Number" required error={formErrors.phoneNumber} htmlFor="phoneNumber">
                    <Input name="phoneNumber" placeholder="Enter Phone Number" className="form-control w-full only_number" data-validate="required" maxLength={10} value={formData.phoneNumber} onChange={handleChange} />
                  </FormField>
                  <FormField label="Whatsapp Number" required error={formErrors.whatsappNumber} htmlFor="whatsappNumber">
                    <Input name="whatsappNumber" placeholder="Enter Phone Number" className="form-control w-full only_number" data-validate="required" maxLength={10} value={formData.whatsappNumber} onChange={handleChange} />
                  </FormField>
                  <FormField label="Family Number">
                    <Input name="familyName" placeholder="Enter Family Phone Number" className="form-control w-full only_number" maxLength={10} value={formData.familyName} onChange={handleChange} />
>>>>>>> 5918a04772cf11794335f23e04513e857b765067
                  </FormField>
                </div>

                <div className="space-y-4">
                  <FormField label="Address Line 1">
                    <Input name="addressLine1" placeholder="Enter Address Line 1" className="form-control w-full capitalize" value={formData.addressLine1} onChange={handleChange} />
                  </FormField>
                  <FormField label="">
                    <Input name="addressLine2" placeholder="Enter Address Line 2" className="form-control w-full capitalize" value={formData.addressLine2} onChange={handleChange} />
                  </FormField>

                  <FormField label="Picture Path" required error={formErrors.picturepath} htmlFor="picturepathInput">
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label htmlFor="picturepathInput" className="flex items-center gap-1 text-[#009333] text-sm cursor-pointer">
                            <i className="ri-upload-2-line text-md"></i>Upload File
                          </label>
                        </div>
                        <span id="fileName" className="text-gray-600 text-sm truncate">{fileName}</span>
                      </div>
                      <input type="file" id="picturepathInput" name="picturepath" className="hidden" onChange={handleFileChange} data-validate="required" />
                    </div>
                  </FormField>
                  <FormField label="Remarks">
                    <Input name="remarks" placeholder="Enter Remarks" className="form-control w-full alphabetnumeric capitalize" value={formData.remarks} onChange={handleChange} />
                  </FormField>
                  <div>
                    <FormField label="State" required error={formErrors.state} htmlFor="state">
                      <SearchableSelect name="state" placeholder="Select State" options={stateOptions} searchable className="w-full" data-validate="required" value={formData.state} onChange={(selectedOption) => handleSearchableSelectChange("state", selectedOption ? selectedOption.value : "")} />
                    </FormField>
                    <FormField label="Pincode">
                      <Input name="pincode" placeholder="Enter Pincode" className="w-full only_number" maxLength={6} value={formData.pincode} onChange={handleChange} />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mx-2 mt-5">
                <ul className="flex whitespace-nowrap w-full border-b border-gray-300 mr-3">
                  {tabs.map((tab) => (
                    <li key={tab.id} className={`mr-6 pb-2 cursor-pointer hover:text-[#009333] ${activeTab === tab.id ? "text-[#009333] border-b-2 border-[#009333]" : ""}`} onClick={() => setActiveTab(tab.id)}>
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
          <button type="submit" onClick={handleSubmit as any} className="btn-sm btn-primary">Save</button>
          <button type="button" className="btn-sm btn-secondary" onClick={() => setFormErrors({})}>Cancel</button>
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
                <button type="button" onClick={() => handleEmployeeTypeChange("Staff")} className="employee_type_btn bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800 px-4 py-2 rounded-md w-full">Staff</button>
                <button type="button" onClick={() => handleEmployeeTypeChange("Driver")} className="employee_type_btn bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800 px-4 py-2 rounded-md w-full">Driver</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </Layout>
  );
}