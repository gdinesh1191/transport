 "use client";
import { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";
import useInputValidation from "@/app/utils/inputValidations";
import ToastContainer, { showToast } from "@/app/utils/toaster";
import { Input, RadioGroup } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import { validateForm, FormErrors } from "@/app/utils/formValidations";
import DatePicker from "@/app/utils/commonDatepicker";
import { useSearchParams } from "next/navigation";
import { apiCall } from "@/app/utils/api";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: string;
  htmlFor?: string;
}

const FormField = ({ label, required = false, children, className = "", error, htmlFor }: FormFieldProps) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50" htmlFor={htmlFor}>
      {" "}
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4">
      {children}
      {error && <p className="error-message text-red-500 text-xs mt-1">{error}</p>}
    </div>
  </div>
);
 
interface VehicleRegistrationFormValues {
  registrationNumber?: string;
  truckType?: string;
  makerName?: string;
  natureOfGoodsWeight?: number;
  owner?: "New" | "Existing";
  address?: string;
  registrationDate?: Date;
  ownerName?: string;
  ownerShipType?: "Owned" | "Leased";
  classOfTruck?: string;
  modelNumber?: string;
  modelYear?: number;
  chasisNumber?: string;
  engineNumber?: string;
  vehicleWeight?: number;
  unladenWeight?: number;
  fcExpiry?: Date;
  insuranceCompany?: string;
  insuranceExpiry?: Date;
  permitExpiryDate?: Date;
  npExpiryDate?: Date;
  quarterlyTaxExpiry?: Date;
  loanStatus?: "Closed" | "Open";
  loanProvider?: string;
  loanStartDate?: Date;
  loanAmount?: number;
  loanTenure?: number;
  loanInterest?: number;
  truckInvoiceNumber?: string;
  truckInvoiceDate?: Date;
  endorsementStatus?: "Endorsed" | "Not Endorsed";
  endorsedWith?: string;
  truckStatus?: "Running" | "Sold";
  dutyDriverName?: string;
  dealerName?: string;
  // Add any other properties that your form might use
}

export default function NewVehicle() {
  const [initialFormValues, setInitialFormValues] = useState<VehicleRegistrationFormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formKey, setFormKey] = useState(0); // New state to force re-mounting of components for reset
  useInputValidation();

  // Date states, initialized based on initialFormValues
  const [registrationDate, setRegistrationDate] = useState<Date | undefined>(undefined);
  const [fcExpiry, setFcExpiry] = useState<Date | undefined>(undefined);
  const [insuranceExpiry, setInsuranceExpiry] = useState<Date | undefined>(undefined);
  const [permitExpiryDate, setPermitExpiryDate] = useState<Date | undefined>(undefined);
  const [npExpiryDate, setNpExpiryDate] = useState<Date | undefined>(undefined);
  const [quarterlyTaxExpiry, setQuarterlyTaxExpiry] = useState<Date | undefined>(undefined);
  const [loanStartDate, setLoanStartDate] = useState<Date | undefined>(undefined);
  const [truckInvoiceDate, setTruckInvoiceDate] = useState<Date | undefined>(undefined);

  // SearchableSelect states
  const [selectedTruckType, setSelectedTruckType] = useState<string | undefined>(undefined);
  const [selectedClassOfTruck, setSelectedClassOfTruck] = useState<string | undefined>(undefined);
  const [selectedInsuranceCompany, setSelectedInsuranceCompany] = useState<string | undefined>(undefined);
  const [selectedLoanProvider, setSelectedLoanProvider] = useState<string | undefined>(undefined);
  const [dynamicBankOptions, setDynamicBankOptions] = useState<Option[]>([]);
 const fetchOptions = async (type: string) => {
    try {
      const payload = {
       
           token : "getOption",
           data : {
            "type": "insuranceCompany"
          
        }
      };
      const response = await apiCall(payload);
      if (response.status === 200 && response.data) {
        // Transform the response data to Option[] format
        return response.data.map((item: any) => ({
          value: item.id.toString(), // Assuming 'id' is suitable for value
          label: item.name,
        }));
      }
      return [];
    } catch (error) {
      console.error(`Failed to fetch options for ${type}:`, error);
      showToast.error(`Failed to load ${type} options.`);
      return [];
    }
  };

  
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

  const handleErrorToast = () => showToast.error("Failed to save vehicle information.");

  const tabs = [
    { id: "owner_information", label: "Owner Information" },
    { id: "vehicle_details", label: "Vehicle Details" },
    { id: "vehicle_expiry_details", label: "Vehicle Expiry Details" },
    { id: "load_availed_details", label: "Loan Availed Details" },
    { id: "vehicle_purchase_details", label: "Vehicle Purchase Details" },
  ];

  const formRef = useRef<HTMLFormElement>(null);

  function formatDateToDMY(date: Date | undefined) {
    if (!date) return "";
    return date.toLocaleDateString("en-GB");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const validationResults = validateForm(formRef.current);
      setFormErrors(validationResults);
      const isFormValid = Object.keys(validationResults).length === 0;

      if (isFormValid) {
        const formData = new FormData(formRef.current);
        // Manually add values from controlled SearchableSelect components
        formData.set("truckType", selectedTruckType || "");
        formData.set("classOfTruck", selectedClassOfTruck || "");
        formData.set("insuranceCompany", selectedInsuranceCompany || "");
        formData.set("loanProvider", selectedLoanProvider || "");

        const formValues = Object.fromEntries(formData.entries());
        console.log("Form submitted successfully", formValues);
        try {
          const payload = {
            token: "putVehicle",
            data: {
              ...formValues,
              registrationDate: formValues.registrationDate ? formatDateToDMY(new Date(formValues.registrationDate as string)) : "",
              insuranceExpiry: formValues.insuranceExpiry ? formatDateToDMY(new Date(formValues.insuranceExpiry as string)) : "",
              permitExpiryDate: formValues.permitExpiryDate ? formatDateToDMY(new Date(formValues.permitExpiryDate as string)) : "",
              npExpiryDate: formValues.npExpiryDate ? formatDateToDMY(new Date(formValues.npExpiryDate as string)) : "",
              quarterlyTaxExpiry: formValues.quarterlyTaxExpiry ? formatDateToDMY(new Date(formValues.quarterlyTaxExpiry as string)) : "",
              truckInvoiceDate: formValues.truckInvoiceDate ? formatDateToDMY(new Date(formValues.truckInvoiceDate as string)) : "",
              fcExpiry: formValues.fcExpiry ? formatDateToDMY(new Date(formValues.fcExpiry as string)) : "",
              loanStartDate: formValues.loanStartDate ? formatDateToDMY(new Date(formValues.loanStartDate as string)) : "",
            },
          };
          const response = await apiCall(payload);
          if (response.status === 200) {
            formRef.current.reset();
            setInitialFormValues({});
            setFormKey((prevKey) => prevKey + 1);
            showToast.success("Vehicle information saved successfully!");
            // Reset date states
            setRegistrationDate(undefined);
            setFcExpiry(undefined);
            setInsuranceExpiry(undefined);
            setPermitExpiryDate(undefined);
            setNpExpiryDate(undefined);
            setQuarterlyTaxExpiry(undefined);
            setLoanStartDate(undefined);
            setTruckInvoiceDate(undefined);
            // Reset SearchableSelect states
            setSelectedTruckType(undefined);
            setSelectedClassOfTruck(undefined);
            setSelectedInsuranceCompany(undefined);
            setSelectedLoanProvider(undefined);
          } else {
            handleErrorToast();
          }
        } catch (error) {
          console.error("API call error:", error);
          handleErrorToast();
        }
      } else {
        showToast.error("Please correct the errors in the form.");
        let firstErrorTabId: string | null = null;
        for (const tab of tabs) {
          const tabContentDiv = formRef.current.querySelector(`#${tab.id}_tab_content`);
          if (tabContentDiv) {
            const fieldsInTab = tabContentDiv.querySelectorAll<HTMLElement>("[name]");
            for (const field of fieldsInTab) {
              if (field.getAttribute("name") && validationResults[field.getAttribute("name")!]) {
                firstErrorTabId = tab.id;
                break;
              }
            }
          }
          if (firstErrorTabId) break;
        }
        if (firstErrorTabId && firstErrorTabId !== activeTab) {
          setActiveTab(firstErrorTabId);
          setTimeout(() => {
            const firstErrorFieldElement = formRef.current?.querySelector(".error-message");
            if (firstErrorFieldElement) {
              firstErrorFieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        }
      }
    }
  };

  const searchParams = useSearchParams();
  const edit_id = searchParams.get("id");
  useEffect(() => {
    // Fetch bank options when the component mounts
    const loadBankOptions = async () => {
      const options = await fetchOptions("bank"); // Assuming 'bank' is the type for bank options
      setDynamicBankOptions(options);
    };

    loadBankOptions(); // Call the function to load bank options
    // ... (existing fetchVehicle logic)
  }, [edit_id]); // Dependency on edit_id

  function parseDMYtoJSDate(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JS Date
    }
    return undefined;
  }

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!edit_id) {
        setInitialFormValues({});
        setFormKey((prevKey) => prevKey + 1);
        // Reset all date pickers when switching to "new" mode
        setRegistrationDate(undefined);
        setFcExpiry(undefined);
        setInsuranceExpiry(undefined);
        setPermitExpiryDate(undefined);
        setNpExpiryDate(undefined);
        setQuarterlyTaxExpiry(undefined);
        setLoanStartDate(undefined);
        setTruckInvoiceDate(undefined);
        // Reset all SearchableSelect states
        setSelectedTruckType(undefined);
        setSelectedClassOfTruck(undefined);
        setSelectedInsuranceCompany(undefined);
        setSelectedLoanProvider(undefined);
        return;
      }
      const payload = {
        token: "getVehicle",
        data: { id: Number(edit_id) },
      };
      try {
        const response = await apiCall(payload);
        if (response.status === 200) {
          const vehicleData: VehicleRegistrationFormValues = response.data; // Type assertion here
          const transformedData: VehicleRegistrationFormValues = {
            ...vehicleData,
            registrationDate: parseDMYtoJSDate(vehicleData.registrationDate as unknown as string),
            insuranceExpiry: parseDMYtoJSDate(vehicleData.insuranceExpiry as unknown as string),
            permitExpiryDate: parseDMYtoJSDate(vehicleData.permitExpiryDate as unknown as string),
            npExpiryDate: parseDMYtoJSDate(vehicleData.npExpiryDate as unknown as string),
            quarterlyTaxExpiry: parseDMYtoJSDate(vehicleData.quarterlyTaxExpiry as unknown as string),
            truckInvoiceDate: parseDMYtoJSDate(vehicleData.truckInvoiceDate as unknown as string),
            fcExpiry: parseDMYtoJSDate(vehicleData.fcExpiry as unknown as string),
            loanStartDate: parseDMYtoJSDate(vehicleData.loanStartDate as unknown as string),
          };
          setInitialFormValues(transformedData);
          setFormKey((prevKey) => prevKey + 1); // Trigger re-render of form with new defaultValues

          // Update DatePicker states
          setRegistrationDate(transformedData.registrationDate);
          setFcExpiry(transformedData.fcExpiry);
          setInsuranceExpiry(transformedData.insuranceExpiry);
          setPermitExpiryDate(transformedData.permitExpiryDate);
          setNpExpiryDate(transformedData.npExpiryDate);
          setQuarterlyTaxExpiry(transformedData.quarterlyTaxExpiry);
          setLoanStartDate(transformedData.loanStartDate);
          setTruckInvoiceDate(transformedData.truckInvoiceDate);

          // Update SearchableSelect states
          setSelectedTruckType(transformedData.truckType);
          setSelectedClassOfTruck(transformedData.classOfTruck);
          setSelectedInsuranceCompany(transformedData.insuranceCompany);
          setSelectedLoanProvider(transformedData.loanProvider);
        } else {
          showToast.error("Failed to fetch vehicle data");
          setInitialFormValues({});
          setFormKey((prevKey) => prevKey + 1);
        }
      } catch (err) {
        console.error("API error:", err);
        showToast.error("Something went wrong");
        setInitialFormValues({});
        setFormKey((prevKey) => prevKey + 1);
      }
    };
    fetchVehicle();
  }, [edit_id]); // Dependency on edit_id to refetch/reset when ID changes

  return (
    <Layout pageTitle="Vehicle Registration">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6" style={{ height: "calc(100vh - 103px)", overflowY: "auto" }}>
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off" key={formKey}>
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Truck Registration Number" required error={formErrors.registrationNumber} htmlFor="registrationNumber">
                    <Input id="registrationNumber" name="registrationNumber" placeholder="Enter registration number" className="alphanumeric no_space all_uppercase" data-validate="required" defaultValue={initialFormValues.registrationNumber} />
                  </FormField>
                  <FormField label="Truck Type" required error={formErrors.truckType} htmlFor="truckType">
                    <SearchableSelect
                      id="truckType"
                      name="truckType"
                      placeholder="Select truck type"
                      options={vehicleTypeOptions}
                      searchable
                      data-validate="required"
                      initialValue={selectedTruckType}
                      onChange={(selectedValue: string | null) => setSelectedTruckType(selectedValue || undefined)}
                    />
                  </FormField>
                  <FormField label="Makers Name" required error={formErrors.makerName} htmlFor="makerName">
                    <Input id="makerName" name="makerName" placeholder="Enter makers name" className="capitalize alphanumeric" data-validate="required" defaultValue={initialFormValues.makerName} />
                  </FormField>
                  <FormField label="Nature of Goods Weight" required error={formErrors.natureOfGoodsWeight} htmlFor="natureOfGoodsWeight">
                    <Input id="natureOfGoodsWeight" name="natureOfGoodsWeight" placeholder="Enter weight" className="number_with_decimal" data-validate="required" defaultValue={initialFormValues.natureOfGoodsWeight} />
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
              <div className="mt-3">
                {/* Tabs Content */}
                <div id="owner_information_tab_content" className={`p-2 ${activeTab === "owner_information" ? "block" : "hidden"}`}>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField label="Owner" error={formErrors.owner} htmlFor="owner">
                        <RadioGroup id="owner" name="owner" options={[{ value: "New", label: "New" }, { value: "Existing", label: "Existing" }]} defaultValue={initialFormValues.owner} />
                      </FormField>
                      <FormField label="Address" required error={formErrors.address} htmlFor="address">
                        <Input id="address" name="address" placeholder="Enter Address" className="capitalize" data-validate="required" defaultValue={initialFormValues.address} />
                      </FormField>
                      <FormField label="Registration Date" error={formErrors.registrationDate} htmlFor="registrationDate">
                        <DatePicker id="registrationDate" name="registrationDate" disableFuture placeholder="Select date" className="w-full" required={true} data-validate="required" initialDate={registrationDate} onChange={setRegistrationDate} selected={registrationDate} />
                      </FormField>
                    </div>
                    <div>
                      <FormField label="Owners Name" required error={formErrors.ownerName} htmlFor="ownerName">
                        <Input id="ownerName" name="ownerName" placeholder="Enter Owners Name" className="alphabet_only capitalize" data-validate="required" defaultValue={initialFormValues.ownerName} />
                      </FormField>
                      <FormField label="Ownership Type" required error={formErrors.ownerShipType} htmlFor="ownerShipType">
                        <RadioGroup id="ownerShipType" name="ownerShipType" options={[{ value: "Owned", label: "Owned" }, { value: "Leased", label: "Leased" }]} data-validate="required" defaultValue={initialFormValues.ownerShipType} />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div id="vehicle_details_tab_content" className={`p-2 ${activeTab === "vehicle_details" ? "block" : "hidden"}`}>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField label="Class of Truck" required error={formErrors.classOfTruck} htmlFor="classOfTruck">
                        <SearchableSelect
                          id="classOfTruck"
                          name="classOfTruck"
                          placeholder="Choose a vehicle"
                          options={vehicleOptions}
                          searchable
                          data-validate="required"
                          initialValue={selectedClassOfTruck}
                          onChange={(selectedValue: string | null) => setSelectedClassOfTruck(selectedValue || undefined)}
                        />
                      </FormField>
                      <FormField label="Model Number" required error={formErrors.modelNumber} htmlFor="modelNumber">
                        <Input id="modelNumber" name="modelNumber" className="alphanumeric all_uppercase" placeholder="Enter Model Number" data-validate="required" defaultValue={initialFormValues.modelNumber} />
                      </FormField>
                      <FormField label="Model Year" required error={formErrors.modelYear} htmlFor="modelYear">
                        <select id="modelYear" name="modelYear" className="form-control border border-gray-300 rounded px-3 py-2" data-validate="required" defaultValue={initialFormValues.modelYear}>
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
                      <FormField label="Chassis Number" required error={formErrors.chasisNumber} htmlFor="chasisNumber">
                        <Input id="chasisNumber" name="chasisNumber" className="alphanumeric all_uppercase" placeholder="Enter Chassis Number" data-validate="required" defaultValue={initialFormValues.chasisNumber} />
                      </FormField>
                    </div>
                    <div>
                      <FormField label="Engine Number" required error={formErrors.engineNumber} htmlFor="engineNumber">
                        <Input id="engineNumber" name="engineNumber" className="alphanumeric all_uppercase" placeholder="Enter Engine Number" data-validate="required" defaultValue={initialFormValues.engineNumber} />
                      </FormField>
                      <FormField label="Vehicle Weight (in Kgs)" required error={formErrors.vehicleWeight} htmlFor="vehicleWeight">
                        <Input id="vehicleWeight" name="vehicleWeight" className="number_with_decimal" type="text" placeholder="Enter Weight" data-validate="required" defaultValue={initialFormValues.vehicleWeight} />
                      </FormField>
                      <FormField label="Unladen Weight (in Kgs)" required error={formErrors.unladenWeight} htmlFor="unladenWeight">
                        <Input id="unladenWeight" name="unladenWeight" className="number_with_decimal" type="text" placeholder="Enter Unladen Weight" data-validate="required" defaultValue={initialFormValues.unladenWeight} />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div id="vehicle_expiry_details_tab_content" className={`p-2 ${activeTab === "vehicle_expiry_details" ? "block" : "hidden"}`}>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField label="F.C. Expiry Date" required error={formErrors.fcExpiry} htmlFor="fcExpiry">
                        <DatePicker id="fcExpiry" disablePast name="fcExpiry" required={true} placeholder="Select date" className="w-full" data-validate="required" initialDate={fcExpiry} onChange={setFcExpiry} selected={fcExpiry} />
                      </FormField>
                      <FormField label="Insurance Company" required error={formErrors.insuranceCompany} htmlFor="insuranceCompany">
                        <SearchableSelect
                          id="insuranceCompany"
                          name="insuranceCompany"
                          placeholder="Select Insurance Company"
                          options={dynamicBankOptions}
                          searchable
                          data-validate="required"
                          initialValue={selectedInsuranceCompany}
                          onChange={(selectedValue: string | null) => setSelectedInsuranceCompany(selectedValue || undefined)}
                        />
                      </FormField>
                      <FormField label="Insurance Expiry" required error={formErrors.insuranceExpiry} htmlFor="insuranceExpiry">
                        <DatePicker required={true} id="insuranceExpiry" name="insuranceExpiry" disablePast placeholder="Insurance Expiry Date" className="w-full" data-validate="required" initialDate={insuranceExpiry} onChange={setInsuranceExpiry} selected={insuranceExpiry} />
                      </FormField>
                      <FormField label="Permit Expiry Date" required error={formErrors.permitExpiryDate} htmlFor="permitExpiryDate">
                        <DatePicker required={true} id="permitExpiryDate" name="permitExpiryDate" placeholder="Permit Expiry Date" className="w-full" disablePast data-validate="required" initialDate={permitExpiryDate} onChange={setPermitExpiryDate} selected={permitExpiryDate} />
                      </FormField>
                    </div>
                    <div>
                      <FormField label="N.P. Expiry Date" required error={formErrors.npExpiryDate} htmlFor="npExpiryDate">
                        <DatePicker required={true} id="npExpiryDate" name="npExpiryDate" placeholder="NP Expiry Date" className="w-full" disablePast data-validate="required" initialDate={npExpiryDate} onChange={setNpExpiryDate} selected={npExpiryDate} />
                      </FormField>
                      <FormField label="Quarterly Tax Expiry" required error={formErrors.quarterlyTaxExpiry} htmlFor="quarterlyTaxExpiry">
                        <DatePicker required={true} id="quarterlyTaxExpiry" name="quarterlyTaxExpiry" placeholder="Quarterly Tax Expiry" className="w-full" disablePast data-validate="required" initialDate={quarterlyTaxExpiry} onChange={setQuarterlyTaxExpiry} selected={quarterlyTaxExpiry} />
                      </FormField>
                      <FormField label="Loan Status" required error={formErrors.loanStatus} htmlFor="loanStatus">
                        <RadioGroup id="loanStatus" name="loanStatus" options={[{ value: "Closed", label: "Closed" }, { value: "Open", label: "Open" }]} data-validate="required" defaultValue={initialFormValues.loanStatus} />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div id="load_availed_details_tab_content" className={`p-2 ${activeTab === "load_availed_details" ? "block" : "hidden"}`}>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField label="Loan Provider" required error={formErrors.loanProvider} htmlFor="loanProvider">
                        <SearchableSelect
                          id="loanProvider"
                          name="loanProvider"
                          placeholder="Select Loan Provider"
                          options={bankOptions}
                          searchable
                          initialValue={selectedLoanProvider}
                          onChange={(selectedValue: string | null) => setSelectedLoanProvider(selectedValue || undefined)}
                        />
                      </FormField>
                      <FormField label="Loan Start Date" required error={formErrors.loanStartDate} htmlFor="loanStartDate">
                        <DatePicker required={true} id="loanStartDate" name="loanStartDate" placeholder="Loan Start Date" className="w-full" data-validate="required" initialDate={loanStartDate} onChange={setLoanStartDate} selected={loanStartDate} />
                      </FormField>
                    </div>
                    <div>
                      <FormField label="Loan Amount" required error={formErrors.loanAmount} htmlFor="loanAmount">
                        <Input id="loanAmount" name="loanAmount" type="text" className="number_with_decimal" placeholder="Enter Loan Amount" data-validate="required" min="0" step="0.01" defaultValue={initialFormValues.loanAmount} />
                      </FormField>
                      <FormField label="Loan Tenure" required error={formErrors.loanTenure} htmlFor="loanTenure">
                        <Input id="loanTenure" name="loanTenure" type="text" className="whole_number" placeholder="Enter Loan Tenure (months/years)" data-validate="required" min="0" defaultValue={initialFormValues.loanTenure} />
                      </FormField>
                      <FormField label="Loan Interest" required error={formErrors.loanInterest} htmlFor="loanInterest">
                        <Input id="loanInterest" name="loanInterest" type="text" className="number_with_decimal" placeholder="Enter Loan Interest (%)" data-validate="required" min="0" step="0.01" defaultValue={initialFormValues.loanInterest} />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div id="vehicle_purchase_details_tab_content" className={`p-2 ${activeTab === "vehicle_purchase_details" ? "block" : "hidden"}`}>
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField label="Truck Invoice No." required error={formErrors.truckInvoiceNumber} htmlFor="truckInvoiceNumber">
                        <Input id="truckInvoiceNumber" name="truckInvoiceNumber" className="alphanumeric all_uppercase" placeholder="Enter Truck Invoice Number" data-validate="required" defaultValue={initialFormValues.truckInvoiceNumber} />
                      </FormField>
                      <FormField label="Truck Invoice Date" required error={formErrors.truckInvoiceDate} htmlFor="truckInvoiceDate">
                        <DatePicker required={true} id="truckInvoiceDate" name="truckInvoiceDate" placeholder="Truck Invoice Date" className="w-full" disableFuture data-validate="required" initialDate={truckInvoiceDate} onChange={setTruckInvoiceDate} selected={truckInvoiceDate} />
                      </FormField>
                      <FormField label="Endorsement Status" required error={formErrors.endorsementStatus} htmlFor="endorsementStatus">
                        <RadioGroup id="endorsementStatus" name="endorsementStatus" options={[{ value: "Endorsed", label: "Endorsed" }, { value: "Not Endorsed", label: "Not Endorsed" }]} data-validate="required" defaultValue={initialFormValues.endorsementStatus} />
                      </FormField>
                      <FormField label="Endorsed With" error={formErrors.endorsedWith} htmlFor="endorsedWith">
                        <Input id="endorsedWith" name="endorsedWith" className="alphanumeric capitalize" placeholder="Enter Truck Endorsed With" defaultValue={initialFormValues.endorsedWith} />
                      </FormField>
                    </div>
                    <div>
                      <FormField label="Truck Status" required error={formErrors.truckStatus} htmlFor="truckStatus">
                        <RadioGroup id="truckStatus" name="truckStatus" options={[{ value: "Running", label: "Running" }, { value: "Sold", label: "Sold" }]} data-validate="required" defaultValue={initialFormValues.truckStatus} />
                      </FormField>
                      <FormField label="Duty Driver Name" required error={formErrors.dutyDriverName} htmlFor="dutyDriverName">
                        <Input id="dutyDriverName" name="dutyDriverName" className="alphabet_only capitalize" placeholder="Enter Duty Driver Name" data-validate="required" defaultValue={initialFormValues.dutyDriverName} />
                      </FormField>
                      <FormField label="Dealer Name" required error={formErrors.dealerName} htmlFor="dealerName">
                        <Input id="dealerName" name="dealerName" className="alphabet_only capitalize" placeholder="Enter Dealer Name" data-validate="required" defaultValue={initialFormValues.dealerName} />
                      </FormField>
                    </div>
                  </div>
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
              if (!edit_id) {
                formRef.current?.reset();
                setInitialFormValues({});
                setFormKey((prevKey) => prevKey + 1);
                 setRegistrationDate(undefined);
                setFcExpiry(undefined);
                setInsuranceExpiry(undefined);
                setPermitExpiryDate(undefined);
                setNpExpiryDate(undefined);
                setQuarterlyTaxExpiry(undefined);
                setLoanStartDate(undefined);
                setTruckInvoiceDate(undefined);
                // Reset SearchableSelect states on Cancel for new forms
                setSelectedTruckType(undefined);
                setSelectedClassOfTruck(undefined);
                setSelectedInsuranceCompany(undefined);
                setSelectedLoanProvider(undefined);
              } else {
                setFormKey((prevKey) => prevKey + 1);
              }
            }}
          >
            Cancel
          </button>
        </footer>
          <ToastContainer /> 
      </div>
    </Layout>
  );
}