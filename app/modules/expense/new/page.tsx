 "use client";

import { useRef, useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { validateForm } from "@/app/utils/formValidations"; // Import the utility
 
import DatePicker from "@/app/utils/commonDatepicker";
import CommonTypeahead from "@/app/utils/commonTypehead";

import dayjs, { Dayjs } from 'dayjs';

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
 
  const [fileName, setFileName] = useState('No file chosen');
  const formRef = useRef<HTMLFormElement>(null);
 const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] = useState('Product Ledger');
  const [formData, setFormData] = useState({
    name: '',
    remarks: ''
  });


  const [tableData, setTableData] = useState([
    { id: 1, name: 'aandagalur gate', remarks: 'Gate', status: true },
    { id: 2, name: 'ban galore', remarks: '', status: false },
    { id: 3, name: 'Erode', remarks: '', status: true },
    { id: 4, name: 'gate', remarks: '', status: true },
    { id: 5, name: 'gate 1', remarks: '', status: true },
    { id: 6, name: 'gate 2', remarks: '', status: true }
  ]);

   const sidebarItems = [
    'Customer Ledger',
    'Product Ledger',
    'Expense Ledger',
    'Unit Ledger',
    'Bank Accounts',
    'Mandatory Fields'
  ];
 const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUpdate = () => {
    if (formData.name.trim()) {
      const newEntry = {
        id: tableData.length + 1,
        name: formData.name,
        remarks: formData.remarks,
        status: true
      };
      setTableData(prev => [...prev, newEntry]);
      setFormData({ name: '', remarks: '' });
    }
  };

  const toggleStatus = (id:any) => {
    setTableData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleRefresh = () => {
    setFormData({ name: '', remarks: '' });
  };
   
  const nameData = [
    { id: 1, name: "Aaaaaaaaaaaaaaaa", description: "This is a detailed description for Aaaaaaaaaaaaaaaa item with more information about its features and usage." },
    { id: 2, name: "Ad Agency Solutions", description: "Professional advertising and marketing solutions for businesses of all sizes." },
    { id: 3, name: "Anil Alta Technologies", description: "Advanced technology solutions and IT services provider." },
    { id: 4, name: "Anil Maggie Foods", description: "Quality food products and catering services for various occasions." },
    { id: 5, name: "Anil Kumar Enterprises", description: "Multi-business enterprise offering various commercial services." },
    { id: 6, name: "Arun Suppliers", description: "Reliable supplier of industrial and commercial goods and materials." },
    { id: 7, name: "Asdfasf Industries", description: "Manufacturing and industrial solutions provider with quality products." },
    { id: 8, name: "Alpha Beta Corp", description: "Corporate solutions and business consulting services." },
    { id: 9, name: "Amazing Products Ltd", description: "Innovative product development and distribution company." },
    { id: 10, name: "Advance Systems", description: "Advanced system integration and technical support services." }
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
      setFileName('No file chosen');
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
                    <select name="category" className="form-control px-3 py-2" data-validate="required">
                      <option value="">Select Category</option>
                      <option value="fuelCharges">Fuel Charges</option>
                      <option value="tollCharges">Toll Charges</option>
                      <option value="driverAllowance">Driver Allowance</option>
                      <option value="service">Vehicle Service on Trip</option>
                    </select>
                  </FormField>

                  <FormField label="Date" className="md:items-start" required>
                  <DatePicker date={selectedDate} setDate={setSelectedDate} placeholder="Select date" className="w-full" />  
                  </FormField>

                  <FormField label="Description" className="md:items-start">
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Enter description"
                      data-validate="required"
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
                      searchFields={['name']}
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
                        { value: "Net Banking", label: "Net Banking" }
                      ]}
                      required
                    />
                  </FormField>

                  <FormField label="Attachments" required>
                    <div className="w-full flex-grow flex flex-col">
                      <div className="flex items-center justify-start gap-3">
                        <div className="border border-gray-200 rounded-sm px-3 py-1 cursor-pointer">
                          <label htmlFor="attachmentInput" className="flex items-center gap-1 text-[#009333] text-sm cursor-pointer">
                            <i className="ri-upload-2-line text-md"></i>Upload File
                          </label>
                        </div>
                        <span id="fileName" className="text-gray-600 text-sm truncate">{fileName}</span>
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
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Open Config Modal
      </button>


                </div>
              </div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button type="submit" onClick={handleSubmit} className="btn-sm btn-primary">Save</button>
          <button type="button" className="btn-sm btn-secondary">Cancel</button>
        </footer>
      </div>


    {showModal && (
        <div className=" fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex justify-center items-center z-50">
          <div className="bg-white max-w-[80%] min-h-[calc(100vh-50px)]  rounded-xl shadow-xl relative">
            {/* Header */}
            <div className="flex justify-between items-center  px-4 py-2 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-50  bg-white">
                <div className="p-4 space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item}
                      onClick={() => setActiveTab(item)}
                    className={`cursor-pointer px-3 py-2 h-10 text-sm rounded transition-colors ${
  activeTab === item
    ? 'font-medium '
    : 'text-[#000000] hover:bg-gray-100 hover:text-[#000000]'
}`}

                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                {/* Form Section */}
                <div className="bg-gray-50 p-4 mb-6 rounded border">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks
                      </label>
                      <input
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        placeholder="Enter your Remarks"
                        className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleSaveUpdate}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      Save & Update
                    </button>
                    <button
                      onClick={handleRefresh}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors"
                      title="Refresh"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Table Section */}
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700 w-16">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            S.NO
                          </div>
                        </th>
                        <th className="text-left p-3 font-medium text-gray-700">
                          <div className="flex items-center gap-1">
                            NAME
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </th>
                        <th className="text-left p-3 font-medium text-gray-700">
                          Remarks
                        </th>
                        <th className="text-left p-3 font-medium text-gray-700 w-24">
                          <div className="flex items-center gap-1">
                            Status
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={row.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" />
                              {index + 1}
                            </div>
                          </td>
                          <td className="p-3 text-blue-600 hover:underline cursor-pointer">
                            {row.name}
                          </td>
                          <td className="p-3 text-gray-600">
                            {row.remarks}
                          </td>
                          <td className="p-3">
                            <div 
                              onClick={() => toggleStatus(row.id)}
                              className="cursor-pointer"
                            >
                              <div className={`w-11 h-6 rounded-full relative transition-colors ${
                                row.status ? 'bg-green-500' : 'bg-gray-300'
                              }`}>
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                                  row.status ? 'translate-x-5' : 'translate-x-0.5'
                                }`}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Table Footer */}
                  <div className="bg-gray-50 px-4 py-3 text-sm text-gray-600 text-right border-t">
                    Total Entries: {tableData.length}
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