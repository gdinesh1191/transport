"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect, useCallback } from "react";
import Layout from "../../../components/Layout";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { validateForm } from "@/app/utils/formValidations";
import useInputValidation from "@/app/utils/inputValidations";
import { Input } from "@/app/utils/form-controls";

// Interface for item details
interface ItemDetail {
  id: number; // Unique ID for each item for easy management
  itemName: string;
  remarks: string;
  quantity: string;
  rent: string;
  total: string;
}

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

export default function NewTrip() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [AgentBrokerName, setAgentBrokerName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  useInputValidation();

  const [showForm, setShowForm] = useState(false);
  const [itemDetails, setItemDetails] = useState<ItemDetail[]>([
    { id: Date.now(), itemName: "", remarks: "", quantity: "", rent: "", total: "" }
  ]);
  const [otherCharges, setOtherCharges] = useState("0");
  const initialModalRef = useRef<HTMLDivElement | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState(true);

  // Calculate subtotal
  const subtotal = itemDetails.reduce((sum, item) => {
    return sum + parseFloat(item.total || "0");
  }, 0).toFixed(2);

  // Calculate net total
  const netTotal = (
    parseFloat(subtotal) + parseFloat(otherCharges || "0")
  ).toFixed(2);

  useEffect(() => {
    const isDateValid = selectedDate instanceof Date && !isNaN(selectedDate.getTime());
    const isVehicleValid = vehicleNumber.trim() !== "";
    const isDriverValid = driverName.trim() !== "";

    setIsFormValid(isDateValid && isVehicleValid && isDriverValid);
  }, [selectedDate, vehicleNumber, driverName]);

  // Effect to automatically add a new row
  useEffect(() => {
    const lastItem = itemDetails[itemDetails.length - 1];
    if (lastItem && parseFloat(lastItem.total) > 0) {
      // Check if the last item's total is greater than 0
      // And also ensure it's not just an empty row with quantity/rent
      // to prevent adding new rows without meaningful input
      if (lastItem.quantity.trim() !== "" && lastItem.rent.trim() !== "") {
          handleAddItem();
      }
    }
  }, [itemDetails]); // Triggered when itemDetails changes

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
    if (initialModalRef.current) {
      initialModalRef.current.classList.add("hidden");
    }
    if (!isFormValid) {
      console.warn("Attempted to create trip with invalid initial form data.");
      return;
    }
    setShowForm(true);
  };

  const handleCancelTrip = () => {
    if (initialModalRef.current) {
      initialModalRef.current.classList.add("hidden");
    }
    setSelectedDate(undefined);
    setVehicleNumber("");
    setDriverName("");
    setItemDetails([{ id: Date.now(), itemName: "", remarks: "", quantity: "", rent: "", total: "" }]); // Reset item details
    setOtherCharges("0"); // Reset other charges
    setIsFormValid(false);
  };

  const handleAddItem = useCallback(() => {
    // Only add a new row if the last row is not completely empty
    const lastItem = itemDetails[itemDetails.length - 1];
    if (lastItem && (lastItem.itemName || lastItem.remarks || lastItem.quantity || lastItem.rent || parseFloat(lastItem.total) > 0)) {
        setItemDetails(prevDetails => [
            ...prevDetails,
            { id: Date.now(), itemName: "", remarks: "", quantity: "", rent: "", total: "" }
        ]);
    }
  }, [itemDetails]); // Dependency on itemDetails to get the latest lastItem

  const handleDeleteItem = useCallback((id: number) => {
    setItemDetails(prevDetails => {
        const updatedItems = prevDetails.filter(item => item.id !== id);
        // If all rows are deleted, add one empty row back
        if (updatedItems.length === 0) {
            return [{ id: Date.now(), itemName: "", remarks: "", quantity: "", rent: "", total: "" }];
        }
        return updatedItems;
    });
  }, []);

  // Validation functions for numeric inputs
  const validateNumericInput = (value: string): string => {
    // Allow empty string, numbers, and decimal points
    const numericValue = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  const handleItemChange = useCallback((id: number, field: keyof ItemDetail, value: string) => {
    setItemDetails(prevDetails =>
      prevDetails.map(item => {
        if (item.id === id) {
          let processedValue = value;
          
          // Apply validation for numeric fields
          if (field === "quantity" || field === "rent") {
            processedValue = validateNumericInput(value);
          }
          
          const newItem = { ...item, [field]: processedValue };
          
          // Calculate total if quantity or rent changes
          if (field === "quantity" || field === "rent") {
            const quantity = parseFloat(newItem.quantity) || 0;
            const rent = parseFloat(newItem.rent) || 0;
            newItem.total = (quantity * rent).toFixed(2);
          }
          return newItem;
        }
        return item;
      })
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && validateForm(formRef.current)) {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());
      console.log("Main form submitted successfully", formValues);
    }

    const payload = {
      agentBrokerName: AgentBrokerName,
      fromPlace: (document.querySelector('[name="fromPlace"]') as HTMLInputElement)?.value.trim(),
      toPlace: (document.querySelector('[name="toPlace"]') as HTMLInputElement)?.value.trim(),
      tripDate: selectedDate ? selectedDate.toLocaleDateString("en-GB") : "",
      vehicleNumber,
      driverName,
      // Filter out completely empty rows before submission
      itemDetails: itemDetails.filter(item =>
        item.itemName.trim() !== "" ||
        item.remarks.trim() !== "" ||
        parseFloat(item.quantity) > 0 ||
        parseFloat(item.rent) > 0 ||
        parseFloat(item.total) > 0
      ),
      subTotal: subtotal,
      otherCharges,
      netTotal,
    };

    console.log("Final submission payload:", payload);
    // You would typically send this payload to your backend
    alert("Form submitted! Check console for payload.");
  };

  const TableRow = ({ item, index }: { item: ItemDetail; index: number }) => (
    <tr>
      <td className="p-2 text-center w-[3%]">{index + 1}</td>
      <td className="p-2 w-[30%]">
        <Input
          type="text"
          name={`itemName-${item.id}`}
          className="w-full" // Removed alphanumeric class that might restrict input
          placeholder="Enter Item Name"
          value={item.itemName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, "itemName", e.target.value)}
          maxLength={100} // Add reasonable max length instead of character restriction
        />
      </td>
      <td className="p-2 w-[15%]">
        <Input
          type="text"
          name={`remarks-${item.id}`}
          className="w-full" // Removed alphanumeric class
          placeholder="Enter Remarks"
          value={item.remarks}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, "remarks", e.target.value)}
          maxLength={200} // Add reasonable max length
        />
      </td>
      <td className="p-2 w-[15%]">
        <Input
          type="text"
          name={`quantity-${item.id}`}
          className="w-full" // Removed number_with_decimal class, handling validation in code
          placeholder="Enter Quantity"
          value={item.quantity}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, "quantity", e.target.value)}
          inputMode="decimal" // Better mobile keyboard
        />
      </td>
      <td className="p-2 w-[15%]">
        <Input
          type="text"
          name={`rent-${item.id}`}
          className="w-full" // Removed number_with_decimal class, handling validation in code
          placeholder="Enter Rent"
          value={item.rent}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, "rent", e.target.value)}
          inputMode="decimal" // Better mobile keyboard
        />
      </td>
      <td className="p-2 w-[15%]">
        <Input
          type="text"
          name={`total-${item.id}`}
          className="w-full text-right total"
          placeholder="Auto-calculated Total"
          value={item.total}
          readOnly
        />
      </td>
      <td className="p-2 text-center w-[7%]">
        <button type="button" className="text-red-600 delete-row mx-1 cursor-pointer" onClick={() => handleDeleteItem(item.id)}>
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
                        onChange={(selectedValue: string | null) => setAgentBrokerName(selectedValue || "")}
                        initialValue={AgentBrokerName}
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
                      <td className="p-2 w-[15%]">Total Amount</td>
                      <td className="p-2 w-[7%] text-center">Action</td>
                    </tr>
                  </thead>
                  <tbody id="productTableBody">
                    {itemDetails.map((item, index) => (
                      <TableRow key={item.id} item={item} index={index} />
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="ml-5">
                  
                  </div>

                  <div className="bg-[#f9f9fb] p-4 rounded-xl w-full md:max-w-md space-y-4 text-sm text-[#212529] md:mr-[6.5%]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Sub Total</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          name="subtotal"
                          placeholder="Auto-calculated subtotal"
                          className="w-full text-right subtotal"
                          value={subtotal}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Other Charges</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          name="otherCharges"
                          placeholder="Enter Other Charges"
                          className="w-full text-right"
                          value={otherCharges}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = validateNumericInput(e.target.value);
                            setOtherCharges(value);
                          }}
                          inputMode="decimal"
                        />
                      </div>
                    </div>
                    <hr className="my-2 border-t border-gray-200" />
                    <div className="flex justify-between items-center font-semibold text-base">
                      <span className="pl-2">Net Total</span>
                      <span className="pr-2 text-[#009333]">
                        {netTotal}
                      </span>
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
                  id="tripDate"
                  name="tripDate" disablePast
                  selected={selectedDate}
                  onChange={(date: Date | undefined) => setSelectedDate(date)}
                  placeholder="Select Date"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block w-full form-label">Vehicle Number</label>
                <SearchableSelect
                  name="vehicleNumber"
                  placeholder="Select Vehicle Number"
                  options={vehicleOptions}
                  searchable
                  data-validate="required"
                  onChange={(selectedValue: string | null) => setVehicleNumber(selectedValue || "")}
                  initialValue={vehicleNumber}
                />
              </div>
              <div>
                <label className="block w-full form-label">Driver Name</label>
                <SearchableSelect
                  name="driverName"
                  placeholder="Select Driver Name"
                  options={driverOptions}
                  searchable
                  data-validate="required"
                  onChange={(selectedValue: string | null) => setDriverName(selectedValue || "")}
                  initialValue={driverName}
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
                className={`btn-sm btn-primary ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
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