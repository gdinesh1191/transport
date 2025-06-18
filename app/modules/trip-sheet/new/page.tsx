"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import Layout from "../../../components/Layout";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { validateForm } from "@/app/utils/formValidations";
import useInputValidation from "@/app/utils/inputValidations";
import { Input } from "@/app/utils/form-controls";

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
  const [itemDetails, setItemDetails] = useState([
    { id: 1, itemName: "", remarks: "", quantity: "", rent: "", total: "" },
  ]); // Initialize with one row
  const [otherCharges, setOtherCharges] = useState("0");
  const initialModalRef = useRef<HTMLDivElement | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState(true);

  const [subTotal, setSubTotal] = useState("0.00");
  const [netTotal, setNetTotal] = useState("0.00");

  useEffect(() => {
    const isDateValid = selectedDate instanceof Date && !isNaN(selectedDate.getTime());
    const isVehicleValid = vehicleNumber.trim() !== "";
    const isDriverValid = driverName.trim() !== "";

    console.log("selectedDate:", selectedDate);
    console.log("vehicleNumber:", vehicleNumber);
    console.log("driverName:", driverName);
    console.log("Form valid?", isDateValid && isVehicleValid && isDriverValid);

    setIsFormValid(isDateValid && isVehicleValid && isDriverValid);
  }, [selectedDate, vehicleNumber, driverName]);

  useEffect(() => {
    const calculatedSubTotal = itemDetails.reduce((acc, item) => {
      const total = parseFloat(item.total) || 0;
      return acc + total;
    }, 0);
    setSubTotal(calculatedSubTotal.toFixed(2));
  }, [itemDetails]);

  useEffect(() => {
    const calculatedNetTotal = (parseFloat(subTotal) + parseFloat(otherCharges || "0")).toFixed(2);
    setNetTotal(calculatedNetTotal);
  }, [subTotal, otherCharges]);

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
    setIsFormValid(false);
  };

  // Function to add a new row
  const addRow = () => {
    setItemDetails((prevDetails) => [
      ...prevDetails,
      {
        id: prevDetails.length > 0 ? Math.max(...prevDetails.map(item => item.id)) + 1 : 1,
        itemName: "",
        remarks: "",
        quantity: "",
        rent: "",
        total: "",
      },
    ]);
  };

  // Function to delete a row
  const deleteRow = (id: number) => {
    setItemDetails((prevDetails) => prevDetails.filter((item) => item.id !== id));
  };

  // Function to update an item's details (quantity, rent, total)
  const updateItemDetail = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setItemDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && validateForm(formRef.current)) {
      const formData = new FormData(formRef.current);
      const formValues = Object.fromEntries(formData.entries());
      console.log("Main form submitted successfully", formValues);
    }

    const agentBrokerName = AgentBrokerName; // Use state
    const fromPlace = (
      document.querySelector('[name="fromPlace"]') as HTMLInputElement
    )?.value.trim();
    const toPlace = (
      document.querySelector('[name="toPlace"]') as HTMLInputElement
    )?.value.trim();

    // Use the state for item details directly
    const itemDetailsPayload = itemDetails.map(item => ({
      itemName: item.itemName,
      remarks: item.remarks,
      quantity: item.quantity,
      rent: item.rent,
      total: item.total,
    })).filter(item => item.itemName || item.remarks || item.quantity || item.rent || item.total); // Filter out empty rows if desired

    const payload = {
      agentBrokerName: agentBrokerName,
      fromPlace,
      toPlace,
      tripDate: selectedDate ? selectedDate.toLocaleDateString("en-GB") : "",
      vehicleNumber,
      driverName,
      itemDetails: itemDetailsPayload,
      subTotal: subTotal, // Use the state value
      otherCharges,
      netTotal, // Use the state value
    };

    console.log("Final submission payload:", payload);
  };

  const TableRow = ({ index, item, updateItemDetail, deleteRow }: {
    index: number;
    item: { id: number; itemName: string; remarks: string; quantity: string; rent: string; total: string };
    updateItemDetail: (id: number, field: string, value: string | number) => void;
    deleteRow: (id: number) => void;
  }) => {
    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newQuantity = e.target.value;
      updateItemDetail(item.id, "quantity", newQuantity);
      calculateTotal(newQuantity, item.rent);
    };

    const handleRentChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newRent = e.target.value;
      updateItemDetail(item.id, "rent", newRent);
      calculateTotal(item.quantity, newRent);
    };

    const calculateTotal = (quantity: string, rent: string) => {
      const qty = parseFloat(quantity) || 0;
      const rnt = parseFloat(rent) || 0;
      const newTotal = (qty * rnt).toFixed(2);
      updateItemDetail(item.id, "total", newTotal);
    };

    useEffect(() => {
        // Recalculate total if quantity or rent changes from parent (e.g., initial load)
        calculateTotal(item.quantity, item.rent);
    }, [item.quantity, item.rent]);

    return (
      <tr>
        <td className="p-2 text-center w-[3%]">{index}</td>
        <td className="p-2 w-[30%]">
          <Input
            type="text"
            name={`itemName-${item.id}`} // Unique name for each input
            className="w-full alphanumeric"
            placeholder="Enter Item Name"
            value={item.itemName}
            onChange={(e:any) => updateItemDetail(item.id, "itemName", e.target.value)}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name={`remarks-${item.id}`} // Unique name
            className="w-full alphanumeric"
            placeholder="Enter Remarks"
            value={item.remarks}
            onChange={(e:any) => updateItemDetail(item.id, "remarks", e.target.value)}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name={`quantity-${item.id}`} // Unique name
            className="w-full number_with_decimal"
            placeholder="Enter Quantity"
            value={item.quantity}
            onChange={handleQuantityChange}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name={`rent-${item.id}`} // Unique name
            className="w-full number_with_decimal"
            placeholder="Enter Rent"
            value={item.rent}
            onChange={handleRentChange}
          />
        </td>
        <td className="p-2 w-[15%]">
          <Input
            type="text"
            name={`total-${item.id}`} // Unique name
            className="w-full text-right total"
            placeholder="Auto-calculated Total"
            value={item.total}
            readOnly
          />
        </td>
        <td className="p-2 text-center w-[7%]">
          <button
            type="button"
            className="text-red-600 delete-row mx-1 cursor-pointer"
            onClick={() => deleteRow(item.id)}
          >
            <i className="ri-delete-bin-line text-[16px]"></i>
          </button>
        </td>
      </tr>
    );
  };

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
                        onChange={(selectedValue: string | null) => setAgentBrokerName(selectedValue || "")} // Corrected
                        initialValue={AgentBrokerName} // Ensure this prop is passed to maintain selection
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
                        index={index + 1}
                        item={item}
                        updateItemDetail={updateItemDetail}
                        deleteRow={deleteRow}
                      />
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="ml-5">
                    <button
                      type="button"
                      onClick={addRow}
                      className="btn-sm btn-outline-primary"
                    >
                      <i className="ri-add-line mr-1"></i>Add New Row
                    </button>
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
                          value={subTotal}
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
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setOtherCharges(e.target.value)}
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
                  onChange={(selectedValue: string | null) => setVehicleNumber(selectedValue || "")} // Corrected
                  initialValue={vehicleNumber} // Ensure this prop is passed to maintain selection
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
                  onChange={(selectedValue: string | null) => setDriverName(selectedValue || "")} // Corrected
                  initialValue={driverName} // Ensure this prop is passed to maintain selection
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