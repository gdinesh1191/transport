"use client";

import { useRef, useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { validateForm } from "@/app/utils/formValidations"; // Import the utility

import DatePicker from "@/app/utils/commonDatepicker";
import CommonTypeahead from "@/app/utils/commonTypehead";

import dayjs, { Dayjs } from "dayjs";

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
    {options.map((option) => (
      <label key={option.value} className="form-label">
        <input
          type="radio"
          name={name}
          value={option.value}
          className="form-radio"
          {...(required ? { "data-validate": "required" } : {})}
        />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);

const NewExpense = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [fileName, setFileName] = useState("No file chosen");
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Customer Ledger");
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");

  const [tableData, setTableData] = useState([
    { id: 1, sNo: 1, name: "Bangalore", remarks: "-", status: false },
    { id: 2, sNo: 2, name: "Chennai", remarks: "South India", status: true },
    { id: 3, sNo: 3, name: "Delhi", remarks: "-", status: false },
    { id: 4, sNo: 4, name: "Mumbai", remarks: "Financial Hub", status: true },
    { id: 5, sNo: 5, name: "Kolkata", remarks: "-", status: false },
    { id: 6, sNo: 6, name: "Hyderabad", remarks: "IT City", status: true },
    { id: 7, sNo: 7, name: "Pune", remarks: "-", status: false },
    { id: 8, sNo: 8, name: "Ahmedabad", remarks: "-", status: true },
    { id: 9, sNo: 9, name: "Bangalore", remarks: "-", status: false },
    { id: 10, sNo: 10, name: "Chennai", remarks: "South India", status: true },
    { id: 11, sNo: 11, name: "Delhi", remarks: "-", status: false },
    { id: 12, sNo: 12, name: "Mumbai", remarks: "Financial Hub", status: true },
    { id: 13, sNo: 13, name: "Kolkata", remarks: "-", status: false },
    { id: 14, sNo: 14, name: "Hyderabad", remarks: "IT City", status: true },
    { id: 15, sNo: 15, name: "Pune", remarks: "-", status: false },
    { id: 16, sNo: 16, name: "Ahmedabad", remarks: "-", status: true },

    // Add more data as needed
  ]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSaveUpdate = () => {
    // Logic to save/update data
    console.log("Save & Update:", { name, remarks });
    // In a real application, you'd typically send this data to an API
  };

  const handleRefresh = () => {
    // Logic to refresh data
    console.log("Refreshing data...");
    // In a real application, you'd typically refetch data from an API
  };

  const handleToggleStatus = (id: any) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, status: !row.status } : row
      )
    );
  };

  const nameData = [
    {
      id: 1,
      name: "Aaaaaaaaaaaaaaaa",
      description:
        "This is a detailed description for Aaaaaaaaaaaaaaaa item with more information about its features and usage.",
    },
    {
      id: 2,
      name: "Ad Agency Solutions",
      description:
        "Professional advertising and marketing solutions for businesses of all sizes.",
    },
    {
      id: 3,
      name: "Anil Alta Technologies",
      description: "Advanced technology solutions and IT services provider.",
    },
    {
      id: 4,
      name: "Anil Maggie Foods",
      description:
        "Quality food products and catering services for various occasions.",
    },
    {
      id: 5,
      name: "Anil Kumar Enterprises",
      description:
        "Multi-business enterprise offering various commercial services.",
    },
    {
      id: 6,
      name: "Arun Suppliers",
      description:
        "Reliable supplier of industrial and commercial goods and materials.",
    },
    {
      id: 7,
      name: "Asdfasf Industries",
      description:
        "Manufacturing and industrial solutions provider with quality products.",
    },
    {
      id: 8,
      name: "Alpha Beta Corp",
      description: "Corporate solutions and business consulting services.",
    },
    {
      id: 9,
      name: "Amazing Products Ltd",
      description: "Innovative product development and distribution company.",
    },
    {
      id: 10,
      name: "Advance Systems",
      description:
        "Advanced system integration and technical support services.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      if (validateForm(formRef.current)) {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());

        console.log("Form submitted successfully", formValues);
        setFileName("No file chosen");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  const handleNameSelect = (item: any) => {
    console.log("Selected name:", item);
  };

  const handleAddNewName = () => {
    console.log("Add new name clicked");
    // Handle add new logic here
  };

  return (
    <Layout pageTitle="Expense New">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              {/* Basic Vehicle Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
                <div className="space-y-4">
                  <FormField label="Category" required>
                    <select
                      name="category"
                      className="form-control px-3 py-2"
                      data-validate="required"
                    >
                      <option value="">Select Category</option>
                      <option value="fuelCharges">Fuel Charges</option>
                      <option value="tollCharges">Toll Charges</option>
                      <option value="driverAllowance">Driver Allowance</option>
                      <option value="service">Vehicle Service on Trip</option>
                    </select>
                  </FormField>

                  <FormField label="Date" className="md:items-start" required>
                    <DatePicker
                      date={selectedDate}
                      setDate={setSelectedDate}
                      placeholder="Select date"
                      className="w-full"
                    />
                  </FormField>

                  <FormField label="Description" className="md:items-start">
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Enter description"
                      className="form-control capitalize h-[80px]"
                    ></textarea>
                  </FormField>

                  <FormField label="Amount" required>
                    <Input
                      name="amount"
                      placeholder="Enter amount"
                      className="form-control numbers-decimal"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Name" required>
                    <CommonTypeahead
                      name="name" // This name will be used for form data
                      placeholder="Enter name"
                      data={nameData} // Pass the page-specific data
                      required={true}
                      onSelect={handleNameSelect}
                      onAddNew={handleAddNewName}
                      searchFields={["name"]}
                      displayField="name"
                      minSearchLength={1}
                    />
                  </FormField>

                  <FormField label="Payment Method" required>
                    <RadioGroup
                      name="paymentMethod"
                      options={[
                        { value: "Cash", label: "Cash" },
                        { value: "UPI", label: "UPI" },
                        { value: "Net Banking", label: "Net Banking" },
                      ]}
                      required
                    />
                  </FormField>

                  <FormField label="Attachments" required>
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label
                            htmlFor="attachmentInput"
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
                      <input
                        type="file"
                        id="attachmentInput"
                        name="attachment"
                        className="hidden"
                        data-validate="required"
                        onChange={handleFileUpload}
                        required
                      />
                    </div>
                  </FormField>
                  <button
                    id="ModalBtn"
                    onClick={openModal}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer"
                  >
                    Open Configuration Modal
                  </button>
                </div>
              </div>
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
          <button type="button" className="btn-sm btn-secondary">
            Cancel
          </button>
        </footer>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50"  onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-[0.5rem] w-full max-w-[85%] min-h-[calc(100vh-90px)] flex flex-col custom-helvetica">
            {/* Modal Header */}
            <div className="relative border-b border-[#dee2e6] px-4 py-2 bg-[#f8f8f8] rounded-tl-md">
              <span className="text-[16px] text-[#212529]">Settings</span>
              <button
                onClick={closeModal}
                className="absolute -top-[10px] -right-[10px] text-gray-500 hover:text-gray-700 bg-[#909090] hover:bg-[#cc0000] rounded-full w-[30px] h-[30px] border-2 border-white cursor-pointer"
              >
                <i className="ri-close-line text-white"></i>
              </button>
            </div>

            {/* Modal Body (Sidebar + Content) */}
            <div className="row p-[16px] m-0 flex-1 flex flex-col">
              <div className="grid grid-cols-12 min-h-[calc(100vh-250px)] flex-1">
                {/* Sidebar */}
               <div className="col-span-2 bg-[#f0f0f0] rounded-bl-md -m-4 overflow-y-auto h-[calc(100vh-90px)]">

                  <ul className="text-[14px] text-[#000000]">
                    {[
                      "Customer Ledger",
                      "Product Ledger",
                      "Expense Ledger",
                      "Unit Ledger",
                      "Bank Accounts",
                      "Mandatory Fields",
                    ].map((tab) => (
                      <li
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer px-4 py-2 sidebar-tab ${
                          activeTab === tab ? "bg-white " : ""
                        }`}
                      >
                        <a
                          href="#"
                          className="block px-1 py-1 w-full whitespace-normal"
                        >
                          {tab}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Main Content Area */}
                <div className="col-span-10 pl-4 pr-4 -mt-4 -mb-4 -mr-[10px] flex flex-col flex-1">
                  {/* Input Form */}
                  <div
                    className="bg-white rounded-md m-[15px] mr-[5px]  shadow-[0_2px_8px_rgba(60,72,88,0.08)] border border-gray-200"
                  

                  >
                    <div className="flex flex-col md:flex-row md:flex-nowrap items-end gap-3 p-6">
                      <div className="w-full md:w-1/3">
                        <div className="relative">
                          <label
                            htmlFor="name"
                            className="form-label"
                          >
                            Name<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full form-control"
                          />
                          <div className="text-red-500 absolute top-full left-0 text-xs mt-1">
                            {/* Error message goes here */}
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-1/3">
                        <label
                          htmlFor="remarks"
                          className=" form-label"
                        >
                          Remarks
                        </label>
                        <input
                          type="text"
                          id="remarks"
                          placeholder="Enter your Remarks"
                          autoComplete="off"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="w-full form-control"
                        />
                      </div>

                      <div className="w-full md:w-1/3 flex justify-start">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleSaveUpdate}
                            className="btn-sm btn-primary"
                          >
                            Save & Update
                          </button>
                          <i
                            onClick={handleRefresh}
                            className="ri-refresh-line text-[#0d6efd] font-semibold text-[18px] cursor-pointer"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table Display */}
                  <div className="ml-5  overflow-hidden rounded-t-lg h-[calc(100vh-277px)] border border-[#ebeff3] ">
                    <div className="h-full overflow-y-auto  ">
                      <table className="w-full text-sm ">
                        <thead className="sticky-table-header ">
                          <tr>
                            <th className="th-cell  w-[5%] text-left">
                              <input type="checkbox" className="mr-3" />
                            </th>
                            <th className="th-cell w-[10%] text-left">
                              <span>S.No</span>
                            </th>
                            <th className="th-cell w-[45%]  text-left">
                              <div className="flex items-center justify-between relative">
                                <span className="font-semibold">Name</span>
                                <i
                                  className="ri-arrow-down-s-fill text-[12px] dropdown-icon-hover"
                                  id="sortDropdownBtn"
                                ></i>
                              </div>
                            </th>
                            <th className="th-cell w-[25%]  text-left">
                              Remarks
                            </th>
                            <th className="th-cell w-[15%]  text-left">
                              <div className="flex items-center justify-between relative">
                                <span>Status</span>
                                <i
                                  className="ri-arrow-down-s-fill text-[12px] dropdown-icon-hover"
                                  id="statusDropdownBtn"
                                ></i>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebeff3]">
                          {tableData.map((row) => (
                            <tr key={row.id} className="tr-hover group">
                              <td className="td-cell w-[5%] ">
                                <input type="checkbox" className="mr-3" />
                              </td>
                              <td className="td-cell w-[5%]">
                                <span className="float-left">{row.sNo}</span>
                              <span className="float-right">
                                   <i className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"
                                />
                              </span>
                              </td>
                              <td className="td-cell w-[45%] ">
                                <div className="flex items-center justify-between">
                                  <span>{row.name}</span>
                                </div>
                              </td>
                              <td className="td-cell w-[25%] ">
                                <div className="flex items-center justify-between">
                                  <span>{row.remarks}</span>
                                </div>
                              </td>
                              <td className="td-cell w-[15%] ">
                                <div className="flex items-center">
                                  <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={row.status}
                                      onChange={() =>
                                        handleToggleStatus(row.id)
                                      }
                                    />
                                    <div className="w-7.5 h-4 bg-white rounded-full border border-gray-300 peer-checked:bg-[#009333] transition-colors"></div>
                                    <div className="absolute left-0.5 top-0.2 w-2.5 h-2.5 bg-[#bfbfbf] rounded-full shadow transition-transform peer-checked:translate-x-4 peer-checked:bg-white"></div>
                                  </label>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-[#ebeff3] border-t border-[#ebeff3] w-[98%] ml-5  rounded-b-lg">
                    <div className="px-3 py-2 text-right text-[14px] text-[#212529]">
                      Total Entries: 21
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NewExpense;
