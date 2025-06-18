"use client";

import { useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker"; // Assuming this is your DatePicker component
import { validateForm } from "@/app/utils/formValidations";
import useInputValidation from "@/app/utils/inputValidations";

// Form field components for reusability
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
    <div className="flex flex-col w-3/4 flex-grow">{children}</div>
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

export default function NewTrip() {
  const [tripDate, setTripDate] = useState(""); // This state isn't being used for validation, `selectedDate` is.
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  useInputValidation(); // This hook is for general input validation, not directly controlling the modal button.

  const [showForm, setShowForm] = useState(false);
  const [itemDetails, setItemDetails] = useState([]); // Not relevant to the current problem
  const [otherCharges, setOtherCharges] = useState("0"); // Not relevant to the current problem
  const initialModalRef = useRef<HTMLDivElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Initialize as undefined
  const [isFormValid, setIsFormValid] = useState(false); // Initialize to false

  useEffect(() => {
    // Check if selectedDate is a valid Date object (not null, undefined, or "Invalid Date")
    const isDateValid = selectedDate instanceof Date && !isNaN(selectedDate.getTime());
    const isVehicleValid = vehicleNumber.trim() !== "";
    const isDriverValid = driverName.trim() !== "";

    console.log("selectedDate:", selectedDate);
    console.log("vehicleNumber:", vehicleNumber);
    console.log("driverName:", driverName);
    console.log("Form valid?", isDateValid && isVehicleValid && isDriverValid);

    setIsFormValid(isDateValid && isVehicleValid && isDriverValid);
  }, [selectedDate, vehicleNumber, driverName]); // Depend on these states

  const agentOptions: Option[] = [
    { value: "40", label: "Karthi" },
    { value: "39", label: "Kumar" },
    { value: "41", label: "Hardik" },
  ];
  const vehicleOptions = [
    { value: "TN01AB1234", label: "TN01AB1234" },
    { value: "TN02CD5678", label: "TN02CD5678" },
  ];
  const driverOptions = [
    { value: "John", label: "John" },
    { value: "Michael", label: "Michael" },
  ];

  const handleCreateTrip = () => {
    // This check is redundant if the button is already disabled when !isFormValid
    if (!isFormValid) return;

    if (initialModalRef.current) {
      initialModalRef.current.classList.add("hidden");
    }
    setShowForm(true);
  };

  const handleCancelTrip = () => {
    if (initialModalRef.current) {
      initialModalRef.current.classList.add("hidden");
    }
    // Optionally reset states when cancelling to ensure modal reappears correctly if needed
    setSelectedDate(undefined);
    setVehicleNumber("");
    setDriverName("");
    setIsFormValid(false); // Reset form validity
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && validateForm(formRef.current)) {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());
      console.log("Form submitted successfully", formValues);
    }

    const vehicleType = (
      document.querySelector('[name="vehicleType"]') as HTMLSelectElement
    )?.value;
    const fromPlace = (
      document.querySelector('[name="fromPlace"]') as HTMLInputElement
    )?.value.trim();
    const toPlace = (
      document.querySelector('[name="toPlace"]') as HTMLInputElement
    )?.value.trim();

    const rows = document.querySelectorAll("#productTableBody tr");
    const itemDetailsPayload: any[] = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const item = {
        itemName: cells[1]?.querySelector("input")?.value.trim() || "",
        remarks: cells[2]?.querySelector("input")?.value.trim() || "",
        quantity: cells[3]?.querySelector("input")?.value.trim() || "",
        rent: cells[4]?.querySelector("input")?.value.trim() || "",
        total: cells[5]?.querySelector("input")?.value.trim() || "",
      };

      if (
        item.itemName ||
        item.remarks ||
        item.quantity ||
        item.rent ||
        item.total
      ) {
        itemDetailsPayload.push(item);
      }
    });

    const subtotal = "0";
    const netTotal = (
      parseFloat(subtotal) + parseFloat(otherCharges || "0")
    ).toFixed(2);

    const payload = {
      agentBrokerName: vehicleType,
      fromPlace,
      toPlace,
      tripDate: selectedDate?.toISOString().split('T')[0], // Use selectedDate for tripDate
      vehicleNumber,
      driverName,
      itemDetails: itemDetailsPayload,
      subTotal: subtotal,
      otherCharges,
      netTotal,
    };

    console.log("Form is valid. Submitting...", payload);
  };

  const TableRow = ({ index }: { index: number }) => (
    <tr>
      <td className="p-2 text-center w-[3%]">{index}</td>
      <td className="p-2 w-[30%]">
        <input
          type="text"
          className="w-full form-control"
          placeholder="Enter Item Name"
        />
      </td>
      <td className="p-2 w-[15%]">
        <input
          type="text"
          className="w-full form-control"
          placeholder="Enter Remarks"
        />
      </td>
      <td className="p-2 w-[15%]">
        <input
          type="text"
          className="w-full form-control"
          placeholder="Enter Quantity"
        />
      </td>
      <td className="p-2 w-[15%]">
        <input
          type="text"
          className="w-full form-control"
          placeholder="Enter Rent"
        />
      </td>
      <td className="p-2 w-[15%]">
        <input
          type="text"
          className="w-full text-right form-control total"
          placeholder="Auto-calculated Total"
          readOnly
        />
      </td>
      <td className="p-2 text-center w-[7%]">
        <button className="text-blue-600 edit-row mx-1 cursor-pointer">
          <i className="ri-edit-line text-[16px]"></i>
        </button>
        <button className="text-red-600 delete-row mx-1 cursor-pointer">
          <i className="ri-delete-bin-line text-[16px]"></i>
        </button>
      </td>
    </tr>
  );

  return (
    <Layout pageTitle="NewTrip">
      <div className="flex-1">
        {showForm && (
          <main id="main-content" className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
              <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                  <div className="space-y-4">
                    <FormField label="Agent / Broker Name" required>
                      <SearchableSelect
                        name="agent/brokerName"
                        placeholder="Select Agent / Broker Name"
                        options={agentOptions}
                        searchable
                        data-validate="required"
                      />
                    </FormField>
                    <FormField label="Place From" required>
                      <Input
                        name="fromPlace"
                        placeholder="Enter place from"
                        className="form-control alphabet_only"
                        data-validate="required"
                      />
                    </FormField>
                    <FormField label="Place To" required>
                      <Input
                        name="toPlace"
                        placeholder="Enter Place to"
                        className="form-control alphabet_only"
                        data-validate="required"
                      />
                    </FormField>
                  </div>
                </div>

                <h2 className="text-lg text-[#009333] mb-4">Item Details</h2>

                <table className="w-full text-sm">
                  <thead className="bg-[#f8f9fa] text-left text-[#12344d]">
                    <tr>
                      <td className="p-2 w-[3%]">S.no</td>
                      <td className="p-2 w-[30%]">Item Name</td>
                      <td className="p-2 w-[15%]">Remarks</td>
                      <td className="p-2 w-[15%]">Quantity</td>
                      <td className="p-2 w-[15%]">Rent</td>
                      <td className="p-2 w-[15%] text-right">Total Amount</td>
                      <td className="p-2 w-[7%] text-center">Action</td>
                    </tr>
                  </thead>
                  <tbody id="productTableBody">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <TableRow key={index} index={index} />
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="ml-5">
                    <button
                      type="button"
                      className="bg-[#f1f1fa] text-[14px] text-[#212529] py-[0.375rem] px-[0.75rem] rounded-[0.375rem] cursor-pointer flex items-center gap-1"
                    >
                      <i className="ri-add-circle-fill text-[15px] text-[#009333]"></i>
                      Add New Item
                    </button>
                  </div>

                  <div className="bg-[#f9f9fb] p-4 rounded-xl w-full md:max-w-md space-y-4 text-sm text-[#212529] md:mr-[6.5%]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Sub Total</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Auto-calculated subtotal"
                          className="w-full text-right form-control subtotal"
                          value={"0.00"}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Other Charges</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Enter Other Charges"
                          className="w-full text-right form-control other charges"
                        />
                      </div>
                    </div>
                    <hr className="my-2 border-t border-gray-200" />
                    <div className="flex justify-between items-center font-semibold text-base">
                      <span className="pl-2">Net Total</span>
                      <span className="pr-2 text-[#009333]">0.00</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </main>
        )}

        <div
          id="initial-modal"
          ref={initialModalRef}
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-[0.5rem] shadow-lg w-[480px] p-[2rem]">
            <h2 className="text-xl text-[#000000] flex items-center justify-center gap-2">
              <i className="ri-bus-2-line text-[#009333] text-2xl"></i>
              Create a New Trip
            </h2>
            <p className="text-[#374151] mt-[16px] text-center">
              To create a new trip, please fill in the details below to help us
              process your request smoothly.
            </p>
            <form className="space-y-4 mt-[16px]">
              <div>
                <label className="block w-full form-label">Trip Date</label>
                <DatePicker
                  id="tripdate"
                  
                  name="tripdate"
                  required={true}
                  placeholder="Select date"
                  className="w-full"
                  data-validate="required"
                
                />
              </div>
              <div>
                <label className="block w-full form-label">
                  Vehicle Number
                </label>
                <SearchableSelect
                  name="vehicleNumber"
                  placeholder="Select vehicleNumber"
                  options={vehicleOptions}
                  searchable
                  data-validate="required"
                  onChange={(selected: any) =>
                    setVehicleNumber(selected?.value || "")
                  }
                />
              </div>
              <div>
                <label className="block w-full form-label">Driver Name</label>
                <SearchableSelect
                  name="driverName"
                  placeholder="Select driverName"
                  options={driverOptions}
                  searchable
                  data-validate="required"
                  onChange={(selected: any) =>
                    setDriverName(selected?.value || "")
                  }
                />
              </div>
            </form>
            <div className="mt-8 flex justify-end space-x-3">
              <button onClick={handleCancelTrip} className="btn-sm btn-light">
                Cancel
              </button>
              <button
                id="createTrip"
                onClick={handleCreateTrip}
                className={`btn-sm btn-primary ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid}
              >
                Create Trip
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn-sm btn-primary"
            >
              Save
            </button>
            <button type="button" className="btn-sm btn-secondary">
              Cancel
            </button>
          </footer>
        )}
      </div>
    </Layout>
  );
}