"use client";

import {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
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
  // It's possible useInputValidation() is causing the single-character issue.
  // For debugging, consider commenting it out temporarily to see if the input behavior changes.
  useInputValidation();

  const [showForm, setShowForm] = useState(false);
  const [itemDetails, setItemDetails] = useState<ItemDetail[]>([
    {
      id: Date.now(),
      itemName: "",
      remarks: "",
      quantity: "",
      rent: "",
      total: "",
    },
  ]);
  const [otherCharges, setOtherCharges] = useState("0");
  const initialModalRef = useRef<HTMLDivElement | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState(true);

  // Calculate subtotal
  const subtotal = itemDetails
    .reduce((sum, item) => {
      return sum + parseFloat(item.total || "0");
    }, 0)
    .toFixed(2);

  // Calculate net total
  const netTotal = (
    parseFloat(subtotal) + parseFloat(otherCharges || "0")
  ).toFixed(2);

  useEffect(() => {
    const isDateValid =
      selectedDate instanceof Date && !isNaN(selectedDate.getTime());
    const isVehicleValid = vehicleNumber.trim() !== "";
    const isDriverValid = driverName.trim() !== "";

    setIsFormValid(isDateValid && isVehicleValid && isDriverValid);
  }, [selectedDate, vehicleNumber, driverName]);

  const handleAddItem = useCallback(() => {
    setItemDetails((prevDetails) => [
      ...prevDetails,
      {
        id: Date.now(),
        itemName: "",
        remarks: "",
        quantity: "",
        rent: "",
        total: "",
      },
    ]);
  }, []);

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
    setItemDetails([
      {
        id: Date.now(),
        itemName: "",
        remarks: "",
        quantity: "",
        rent: "",
        total: "",
      },
    ]); // Reset item details
    setOtherCharges("0"); // Reset other charges
    setIsFormValid(false);
    setShowForm(false); // Ensure the main form is hidden again
  };

  const handleDeleteItem = useCallback((id: number) => {
    setItemDetails((prevDetails) => {
      const updatedItems = prevDetails.filter((item) => item.id !== id);
      // If all rows are deleted, add one empty row back
      if (updatedItems.length === 0) {
        return [
          {
            id: Date.now(),
            itemName: "",
            remarks: "",
            quantity: "",
            rent: "",
            total: "",
          },
        ];
      }
      return updatedItems;
    });
  }, []);

  const handleItemUpdate = useCallback(
    (id: number, updatedFields: Partial<ItemDetail>) => {
      setItemDetails((prevDetails) =>
        prevDetails.map((item) =>
          item.id === id ? { ...item, ...updatedFields } : item
        )
      );
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && validateForm(formRef.current)) {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());
      console.log("Main form submitted successfully", formValues);
    }

    const payload = {
      agentBrokerName: AgentBrokerName,
      fromPlace: (
        document.querySelector('[name="fromPlace"]') as HTMLInputElement
      )?.value.trim(),
      toPlace: (
        document.querySelector('[name="toPlace"]') as HTMLInputElement
      )?.value.trim(),
      tripDate: selectedDate ? selectedDate.toLocaleDateString("en-GB") : "",
      vehicleNumber,
      driverName,
      // Filter out completely empty rows before submission
      itemDetails: itemDetails.filter(
        (item) =>
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

  // --- START: Refactored TableRow Component ---
  const TableRow = ({
    item,
    index,
    onItemUpdate,
    onDelete,
    onAddItem,
    isLastRow,
  }: {
    item: ItemDetail;
    index: number;
    onItemUpdate: (id: number, updatedFields: Partial<ItemDetail>) => void;
    onDelete: (id: number) => void;
    onAddItem: () => void;
    isLastRow: boolean;
  }) => {
    // Local state for all input fields within this row
    const [rowItem, setRowItem] = useState<ItemDetail>(item);
    const prevTotalRef = useRef(item.total); // To track previous total for new row logic

    // Effect to update local state if parent item prop changes (e.g., when a new row is added and item prop is initialized)
    useEffect(() => {
      setRowItem(item);
    }, [item]);

    // Effect to trigger new row addition when total changes to a non-zero value
 useEffect(() => {
      const newTotal = parseFloat(rowItem.total);
      const prevTotal = parseFloat(prevTotalRef.current);

      if (
        isLastRow &&
        !isNaN(newTotal) && // New total must be a valid number
        newTotal > 0 &&     // New total must be greater than zero
        (isNaN(prevTotal) || prevTotal === 0) // Previous total was not a number or was zero
      ) {
        const timer = setTimeout(() => {
          onAddItem();
        }, 100); // Small delay

        return () => clearTimeout(timer);
      }
      prevTotalRef.current = rowItem.total; // Update ref for next render
    }, [rowItem.total, isLastRow, onAddItem]);
    const calculateTotal = (qty: string, rentVal: string) => {
      const quantity = parseFloat(qty) || 0;
      const rent = parseFloat(rentVal) || 0;
      return (quantity * rent).toFixed(2);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let newRowItem: ItemDetail = { ...rowItem, [name]: value };

      if (name === "quantity" || name === "rent") {
        // Only allow numbers and decimals for quantity and rent
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          const newQuantity = name === "quantity" ? value : rowItem.quantity;
          const newRent = name === "rent" ? value : rowItem.rent;
          newRowItem.total = calculateTotal(newQuantity, newRent);
        } else {
          // If invalid input, don't update the state but let the user continue typing
          return;
        }
      }

      setRowItem(newRowItem); // Update local state immediately for smooth typing

      // Debounce the update to the parent state
      // This helps prevent excessive re-renders of the entire table on every keystroke
      const timer = setTimeout(() => {
        onItemUpdate(rowItem.id, newRowItem);
      }, 300); // Adjust debounce time as needed (e.g., 300ms)

      return () => clearTimeout(timer); // Cleanup previous timer on re-render
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Ensure the latest `rowItem` state is propagated to the parent on blur
      onItemUpdate(rowItem.id, rowItem);
    };

    return (
      <tr>
        <td className="p-2 text-center w-[3%]">{index + 1}</td>
        <td className="p-2 w-[30%]">
          <Input
            type="text"
            name="itemName" // Changed name to match key in ItemDetail
            className="w-full alphanumeric"
            placeholder="Enter Item Name"
            value={rowItem.itemName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name="remarks" // Changed name to match key in ItemDetail
            className="w-full alphanumeric"
            placeholder="Enter Remarks"
            value={rowItem.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name="quantity" // Changed name to match key in ItemDetail
            className="w-full number_with_decimal"
            placeholder="Enter Quantity"
            value={rowItem.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name="rent" // Changed name to match key in ItemDetail
            className="w-full number_with_decimal"
            placeholder="Enter Rent"
            value={rowItem.rent}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name="total" // Changed name to match key in ItemDetail
            className="w-full text-right total"
            placeholder="Auto-calculated Total"
            value={rowItem.total}
            readOnly
          />
        </td>
        <td className="p-2 text-center w-[7%]">
          <button
            type="button"
            className="text-red-600 delete-row mx-1 cursor-pointer"
            onClick={() => onDelete(item.id)}
          >
            <i className="ri-delete-bin-line text-[16px]"></i>
          </button>
        </td>
      </tr>
    );
  };
  // --- END: Refactored TableRow Component ---

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
                        onChange={(selectedValue: string | null) =>
                          setAgentBrokerName(selectedValue || "")
                        }
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
                      <TableRow
                        key={item.id}
                        item={item}
                        index={index}
                        onItemUpdate={handleItemUpdate}
                        onDelete={handleDeleteItem}
                        onAddItem={handleAddItem}
                        isLastRow={index === itemDetails.length - 1} // Pass this prop
                      />
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="ml-5"></div>

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
                          className="w-full text-right other charges"
                          value={otherCharges}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setOtherCharges(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <hr className="my-2 border-t border-gray-200" />
                    <div className="flex justify-between items-center font-semibold text-base">
                      <span className="pl-2">Net Total</span>
                      <span className="pr-2 text-[#009333]">{netTotal}</span>
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
                  name="tripDate"
                  disablePast
                  selected={selectedDate}
                  onChange={(date: Date | undefined) => setSelectedDate(date)}
                  placeholder="Select Date"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block w-full form-label">
                  Vehicle Number
                </label>
                <SearchableSelect
                  name="vehicleNumber"
                  placeholder="Select Vehicle Number"
                  options={vehicleOptions}
                  searchable
                  data-validate="required"
                  onChange={(selectedValue: string | null) =>
                    setVehicleNumber(selectedValue || "")
                  }
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
                  onChange={(selectedValue: string | null) =>
                    setDriverName(selectedValue || "")
                  }
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