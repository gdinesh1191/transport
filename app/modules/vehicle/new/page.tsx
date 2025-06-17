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
      {error && (  
        <p className="error-message text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  </div>
);
export default function NewVehicle() {
  const insuranceOptions: Option[] = [
    { value: "icici", label: "ICICI Lombard" },
    { value: "hdfc", label: "HDFC Ergo" },
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  useInputValidation();
  const handleErrorToast = () =>
    showToast.error("Failed to save vehicle information.");
  const tabs = [
    { id: "owner_information", label: "Owner Information" },
    { id: "vehicle_details", label: "Vehicle Details" },
    { id: "vehicle_expiry_details", label: "Vehicle Expiry Details" },
    { id: "load_availed_details", label: "Loan Availed Details" },
    { id: "vehicle_purchase_details", label: "Vehicle Purchase Details" },
  ];
  const [loanProvider, setLoanProvider] = useState<string | undefined>(undefined);
  const [insuranceCompany, setInsuranceCompany] = useState<string | undefined>(undefined);
  const [classOfTruck, setClassOfTruck] = useState<string | undefined>(undefined);
  const [truckType, setTruckType] = useState<string | undefined>(undefined);
  const [registrationDate, setregistrationDate] = useState<Date | undefined>();
  const [insuranceExpiry, setInsuranceExpiry] = useState<Date | undefined>();
  const [permitExpiryDate, setPermitExpiryDate] = useState<Date | undefined>();
  const [npExpiryDate, setNpExpiryDate] = useState<Date | undefined>();
  const [quarterlyTaxExpiry, setQuarterlyTaxExpiry] = useState<
    Date | undefined
  >();
  const [truckInvoiceDate, setTruckInvoiceDate] = useState<Date | undefined>();
  const [fcExpiry, setFcexpiryDate] = useState<Date | undefined>();
  const [loanStartDate, setLoanStartDate] = useState<Date | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  function formatDateToDMY(date: Date | undefined) {
    if (!date) return "";
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  }


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const validationResults = validateForm(formRef.current); // Get all errors
      setFormErrors(validationResults); // Update error state
      const isFormValid = Object.keys(validationResults).length === 0;
      if (isFormValid) {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());
        console.log("Form submitted successfully", formValues);
        try {
          const payload = {
            token: "putVehicle",
            data: {
              ...formValues,
              // Format dates as DD/MM/YYYY strings for the payload
              registrationDate: formatDateToDMY(registrationDate),
              insuranceExpiry: formatDateToDMY(insuranceExpiry),
              permitExpiryDate: formatDateToDMY(permitExpiryDate),
              npExpiryDate: formatDateToDMY(npExpiryDate),
              quarterlyTaxExpiry: formatDateToDMY(quarterlyTaxExpiry),
              truckInvoiceDate: formatDateToDMY(truckInvoiceDate),
              fcExpiry: formatDateToDMY(fcExpiry),
              loanStartDate: formatDateToDMY(loanStartDate),
            },
          };
          const response = await apiCall(payload);
          if (response.status === 200) {
            console.log(response);
            showToast.success("Vehicle information saved successfully!");
            setFormErrors({});
            formRef.current.reset(); // Reset the form fields
            setregistrationDate(undefined);
            setInsuranceExpiry(undefined);
            setPermitExpiryDate(undefined);
            setNpExpiryDate(undefined);
            setQuarterlyTaxExpiry(undefined);
            setTruckInvoiceDate(undefined);
            setFcexpiryDate(undefined);
            setLoanStartDate(undefined);
            setLoanProvider(undefined);
            setInsuranceCompany(undefined);
            setClassOfTruck(undefined);
            setTruckType(undefined);
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
          setActiveTab(firstErrorTabId);  
          setTimeout(() => {
             const firstErrorFieldElement =
              formRef.current?.querySelector(`.error-message`);
            if (firstErrorFieldElement) {
              firstErrorFieldElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 100);  
        }
      }
    }
  };
  const searchParams = useSearchParams();
  const edit_id = searchParams.get("id");  
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!edit_id) return;
      const payload = {
        token: "getVehicle",
        data: { id: Number(edit_id) },
      };
      try {
        const response = await apiCall(payload);
        if (response.status === 200) {
          const vehicleData = response.data;
          console.log("Fetched vehicle data:", vehicleData);
        } else {
          showToast.error("Failed to fetch vehicle data");
        }
      } catch (err) {
        console.error("API error:", err);
        showToast.error("Something went wrong");
      }
    };
    fetchVehicle();
  }, [edit_id]);
  return (
    <Layout pageTitle="Vehicle Registration">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div
            className="px-4 py-6"
            style={{ height: "calc(100vh - 103px)", overflowY: "auto" }}
          >
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField
                    label="Truck Registration Number"
                    required
                    error={formErrors.registrationNumber}
                    htmlFor="registrationNumber"
                  >
                    <Input
                      id="registrationNumber"  
                      name="registrationNumber"
                      placeholder="Enter registration number"
                      className="alphanumeric no_space all_uppercase"
                      data-validate="required"
                    />
                  </FormField>
                  <FormField
                    label="Truck Type"
                    required
                    error={formErrors.truckType}
                    htmlFor="truckType"
                  >
                      <SearchableSelect
        id="truckType"
        name="truckType"
        placeholder="Select truck type"
        options={vehicleTypeOptions}
        searchable
        data-validate="required"
        value={truckType}
        onChange={(opt) => setTruckType(opt?.value)}
      />
                  </FormField>
                  <FormField
                    label="Makers Name"
                    required
                    error={formErrors.makerName}
                    htmlFor="makerName"
                  >
                    <Input
                      id="makerName"  
                      name="makerName"
                      placeholder="Enter makers name"
                      className="capitalize alphanumeric"
                      data-validate="required"
                    />
                  </FormField>
                  <FormField
                    label="Nature of Goods Weight"
                    required
                    error={formErrors.natureOfGoodsWeight}
                    htmlFor="natureOfGoodsWeight"
                  >
                    <Input
                      id="natureOfGoodsWeight"
                      name="natureOfGoodsWeight"
                      placeholder="Enter weight"
                      className="number_with_decimal"
                      data-validate="required"
                    />
                  </FormField>
                </div>
              </div>
              <div className="mx-2 mt-5 md:overflow-x-auto overflow-x-visible">
                <div className="md:max-w-[650px] lg:max-w-full">
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
              </div>
              <div className="mt-3">
                {}
                <div
                  id="owner_information_tab_content"
                  className={`p-2 ${
                    activeTab === "owner_information" ? "block" : "hidden"
                  }`}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField
                        label="Owner"
                        error={formErrors.owner}
                        htmlFor="owner"
                      >
                        <RadioGroup
                          id="owner"  
                          name="owner"
                          options={[
                            { value: "New", label: "New" },
                            { value: "Existing", label: "Existing" },
                          ]}
                        />
                      </FormField>
                      <FormField
                        label="Address"
                        required
                        error={formErrors.address}
                        htmlFor="address"
                      >
                        <Input
                          id="address" 
                          name="address"
                          placeholder="Enter Address"
                          className="capitalize"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Registration Date"
                        error={formErrors.registrationDate}
                        htmlFor="registrationDate"
                      >
                         <DatePicker
                          id="registrationDate"
                          name="registrationDate" // Prop to pass the name down
                          date={registrationDate}
                          disableFuture
                          setDate={setregistrationDate}
                          placeholder="Select date"
                          className="w-full"
                          required={true}
                          data-validate="required" // Added data-validate
                        />
                      </FormField>
                    </div>
                    <div>
                      <FormField
                        label="Owners Name"
                        required
                        error={formErrors.ownerName}
                        htmlFor="ownerName"
                      >
                        <Input
                          id="ownerName" // Added ID for htmlFor
                          name="ownerName"
                          placeholder="Enter Owners Name"
                          className="alphabet_only capitalize"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Ownership Type"
                        required
                        error={formErrors.ownershipType}
                        htmlFor="ownershipType"
                      >
                        <RadioGroup
                          id="ownershipType"
                          name="ownershipType"
                          options={[
                            { value: "Owned", label: "Owned" },
                            { value: "Leased", label: "Leased" },
                          ]}
                          data-validate="required"
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div
                  id="vehicle_details_tab_content"
                  className={`p-2 ${
                    activeTab === "vehicle_details" ? "block" : "hidden"
                  }`}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField
                        label="Class of Truck"
                        required
                        error={formErrors.vehicleType}
                        htmlFor="vehicleType"
                      >
      <SearchableSelect
        id="classOfTruck"
        name="classOfTruck"
        placeholder="Choose a vehicle"
        options={vehicleOptions}
        searchable
        data-validate="required"
        value={classOfTruck}
        onChange={(opt) => setClassOfTruck(opt?.value)}
      />
                      </FormField>
                      <FormField
                        label="Model Number"
                        required
                        error={formErrors.modelNumber}
                        htmlFor="modelNumber"
                      >
                        <Input
                          id="modelNumber" // Added ID for htmlFor
                          name="modelNumber"
                          className="alphanumeric all_uppercase"
                          placeholder="Enter Model Number"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Model Year"
                        required
                        error={formErrors.modelYear}
                        htmlFor="modelYear"
                      >
                        <select
                          id="modelYear" 
                          name="modelYear"
                          className="form-control border border-gray-300 rounded px-3 py-2"
                          data-validate="required"
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
                      <FormField
                        label="Chassis Number"
                        required
                        error={formErrors.chasisNumber}
                        htmlFor="chasisNumber"
                      >
                        <Input
                          id="chasisNumber"  
                          name="chasisNumber"
                          className="alphanumeric all_uppercase"
                          placeholder="Enter Chassis Number"
                          data-validate="required"
                        />
                      </FormField>
                    </div>
                    <div>
                      <FormField
                        label="Engine Number"
                        required
                        error={formErrors.engineNumber}
                        htmlFor="engineNumber"
                      >
                        <Input
                          id="engineNumber"
                          name="engineNumber"
                          className="alphanumeric all_uppercase"
                          placeholder="Enter Engine Number"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Vehicle Weight (in Kgs)"
                        required
                        error={formErrors.vehicleWeight}
                        htmlFor="vehicleWeight"
                      >
                        <Input
                          id="vehicleWeight"
                          name="vehicleWeight"
                          className="number_with_decimal"
                          type="text"
                          placeholder="Enter Weight"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Unladen Weight (in Kgs)"
                        required
                        error={formErrors.unladenWeight}
                        htmlFor="unladenWeight"
                      >
                        <Input
                          id="unladenWeight" // Added ID for htmlFor
                          name="unladenWeight"
                          className="number_with_decimal"
                          type="text"
                          placeholder="Enter Unladen Weight"
                          data-validate="required"
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div
                  id="vehicle_expiry_details_tab_content"
                  className={`p-2 ${
                    activeTab === "vehicle_expiry_details" ? "block" : "hidden"
                  }`}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField
                        label="F.C. Expiry Date"
                        required
                        error={formErrors.fcExpiry}
                        htmlFor="fcExpiry"
                      >
                        <DatePicker
                          id="fcExpiry"
                          disablePast
                          name="fcExpiry"
                          required={true}
                          date={fcExpiry}
                          setDate={setFcexpiryDate}
                          placeholder="Select date"
                          className="w-full"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Insurance Company"
                        required
                        error={formErrors.insuranceCompany}
                        htmlFor="insuranceCompany"
                      >
                          <SearchableSelect
        id="insuranceCompany"
        name="insuranceCompany"
        placeholder="Select Insurance Company"
        options={insuranceOptions}
        searchable
        data-validate="required"
        value={insuranceCompany}
        onChange={(opt) => setInsuranceCompany(opt?.value)}
      />
                      </FormField>
                      <FormField
                        label="Insurance Expiry"
                        required
                        error={formErrors.insuranceExpiry}
                        htmlFor="insuranceExpiry"
                      >
                        <DatePicker
                          required={true}
                          id="insuranceExpiry"
                          name="insuranceExpiry"
                          date={insuranceExpiry}
                          disablePast
                          setDate={setInsuranceExpiry}
                          placeholder="Insurance Expiry Date"
                          className="w-full"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Permit Expiry Date"
                        required
                        error={formErrors.permitExpiryDate}
                        htmlFor="permitExpiryDate"
                      >
                        <DatePicker
                          required={true}
                          id="permitExpiryDate" // Added ID for htmlFor
                          name="permitExpiryDate" // Prop to pass the name down
                          date={permitExpiryDate}
                          setDate={setPermitExpiryDate}
                          placeholder="Permit Expiry Date"
                          className="w-full"
                          disablePast
                          data-validate="required"
                        />
                      </FormField>
                    </div>
                    <div>
                      <FormField
                        label="N.P. Expiry Date"
                        required
                        error={formErrors.npExpiryDate}
                        htmlFor="npExpiryDate"
                      >
                        <DatePicker
                          required={true}
                          id="npExpiryDate" // Added ID for htmlFor
                          name="npExpiryDate" // Prop to pass the name down
                          date={npExpiryDate}
                          setDate={setNpExpiryDate}
                          placeholder="NP Expiry Date"
                          className="w-full"
                          disablePast
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Quarterly Tax Expiry"
                        required
                        error={formErrors.quarterlyTaxExpiry}
                        htmlFor="quarterlyTaxExpiry"
                      >
                        <DatePicker
                          required={true}
                          id="quarterlyTaxExpiry" // Added ID for htmlFor
                          name="quarterlyTaxExpiry" // Prop to pass the name down
                          date={quarterlyTaxExpiry}
                          setDate={setQuarterlyTaxExpiry}
                          placeholder="Quarterly Tax Expiry"
                          className="w-full"
                          disablePast
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Loan Status"
                        required
                        error={formErrors.loanStatus}
                        htmlFor="loanStatus"
                      >
                        <RadioGroup
                          id="loanStatus" // Added ID for htmlFor
                          name="loanStatus"
                          options={[
                            { value: "Closed", label: "Closed" },
                            { value: "Open", label: "Open" },
                          ]}
                          data-validate="required"
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div
                  id="load_availed_details_tab_content"
                  className={`p-2 ${
                    activeTab === "load_availed_details" ? "block" : "hidden"
                  }`}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField
                        label="Loan Provider"
                        required
                        error={formErrors.loanProvider}
                        htmlFor="loanProvider"
                      >
                         <SearchableSelect
        id="loanProvider"
        name="loanProvider"
        placeholder="Select Loan Provider"
        options={bankOptions}
        searchable
        data-validate="required"
        value={loanProvider}
        onChange={(opt) => setLoanProvider(opt?.value)}
      />
                      </FormField>
                      <FormField
                        label="Loan Start Date"
                        required
                        error={formErrors.loanStartDate}
                        htmlFor="loanStartDate"
                      >
                        <DatePicker
                          required={true}
                          id="loanStartDate" // Added ID for htmlFor
                          name="loanStartDate" // Prop to pass the name down
                          date={loanStartDate}
                          setDate={setLoanStartDate}
                          placeholder="Loan Start Date"
                          className="w-full"
                          data-validate="required"
                        />
                      </FormField>
                    </div>
                    <div>
                      <FormField
                        label="Loan Amount"
                        required
                        error={formErrors.loanAmount}
                        htmlFor="loanAmount"
                      >
                        <Input
                          id="loanAmount" // Added ID for htmlFor
                          name="loanAmount"
                          type="text"
                          className="number_with_decimal"
                          placeholder="Enter Loan Amount"
                          data-validate="required"
                          min="0"
                          step="0.01"
                        />
                      </FormField>
                      <FormField
                        label="Loan Tenure"
                        required
                        error={formErrors.loanTenure}
                        htmlFor="loanTenure"
                      >
                        <Input
                          id="loanTenure" // Added ID for htmlFor
                          name="loanTenure"
                          type="text"
                          className="whole_number"
                          placeholder="Enter Loan Tenure (months/years)"
                          data-validate="required"
                          min="0"
                        />
                      </FormField>
                      <FormField
                        label="Loan Interest"
                        required
                        error={formErrors.loanInterest}
                        htmlFor="loanInterest"
                      >
                        <Input
                          id="loanInterest" // Added ID for htmlFor
                          name="loanInterest"
                          className="number_with_decimal"
                          type="text"
                          placeholder="Enter Loan Interest (%)"
                          data-validate="required"
                          min="0"
                          step="0.01"
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
                <div
                  id="vehicle_purchase_details_tab_content"
                  className={`p-2 ${
                    activeTab === "vehicle_purchase_details"
                      ? "block"
                      : "hidden"
                  }`}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-10">
                    <div>
                      <FormField
                        label="Truck Invoice No."
                        required
                        error={formErrors.truckInvoiceNumber}
                        htmlFor="truckInvoiceNumber"
                      >
                        <Input
                          id="truckInvoiceNumber" // Added ID for htmlFor
                          name="truckInvoiceNumber"
                          className="alphanumeric all_uppercase"
                          placeholder="Enter Truck Invoice Number"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Truck Invoice Date"
                        required
                        error={formErrors.truckInvoiceDate}
                        htmlFor="truckInvoiceDate"
                      >
                        <DatePicker
                          required={true}
                          id="truckInvoiceDate" // Added ID for htmlFor
                          name="truckInvoiceDate" // Prop to pass the name down
                          date={truckInvoiceDate}
                          setDate={setTruckInvoiceDate}
                          placeholder="Truck Invoice Date"
                          className="w-full"
                          disableFuture
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Endorsement Status"
                        required
                        error={formErrors.endorsementStatus}
                        htmlFor="endorsementStatus"
                      >
                        <RadioGroup
                          id="endorsementStatus" // Added ID for htmlFor
                          name="endorsementStatus"
                          options={[
                            { value: "Endorsed", label: "Endorsed" },
                            { value: "Not Endorsed", label: "Not Endorsed" },
                          ]}
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Endorsed With"
                        error={formErrors.endorsedWith}
                        htmlFor="endorsedWith"
                      >
                        <Input
                          id="endorsedWith" // Added ID for htmlFor
                          name="endorsedWith"
                          className="alphanumeric capitalize"
                          placeholder="Enter Truck Endorsed With"
                        />
                      </FormField>
                    </div>
                    <div>
                      <FormField
                        label="Truck Status"
                        required
                        error={formErrors.truckStatus}
                        htmlFor="truckStatus"
                      >
                        <RadioGroup
                          id="truckStatus" // Added ID for htmlFor
                          name="truckStatus"
                          options={[
                            { value: "Running", label: "Running" },
                            { value: "Sold", label: "Sold" },
                          ]}
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Duty Driver Name"
                        required
                        error={formErrors.dutyDriverName}
                        htmlFor="dutyDriverName"
                      >
                        <Input
                          id="dutyDriverName" // Added ID for htmlFor
                          name="dutyDriverName"
                          className="alphabet_only capitalize"
                          placeholder="Enter Duty Driver Name"
                          data-validate="required"
                        />
                      </FormField>
                      <FormField
                        label="Dealer Name"
                        required
                        error={formErrors.dealerName}
                        htmlFor="dealerName"
                      >
                        <Input
                          id="dealerName" // Added ID for htmlFor
                          name="dealerName"
                          className="alphabet_only capitalize"
                          placeholder="Enter Dealer Name"
                          data-validate="required"
                        />
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
            onClick={() => setFormErrors({})}
          >
            Cancel
          </button>
        </footer>
        <ToastContainer />
      </div>
    </Layout>
  );
}
