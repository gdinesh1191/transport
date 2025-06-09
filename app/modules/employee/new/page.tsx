"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";




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
    <label className="form-label w-1/2">
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4">{children}</div>
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
    className={`form-control `}
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
    {options.map((option, index) => (
      <label key={option.value} className="form-label">
        <input
          type="radio"
          name={name}
          value={option.value}
          className="form-radio"
          {...(required && index === 0 ? { "data-validate": "required" } : {})}
        />
        <span className="ml-2">{option.label}</span>
      </label>
    ))}
  </div>
);




export default function Newemployee() {
  const [activeTab, setActiveTab] = useState("Bank_details");
  const [showModal, setShowModal] = useState(true);
  const [employeeType, setEmployeeType] = useState("");

  const tabs = [
    { id: "Bank_details", label: "Bank Details" },
    { id: "proof_details", label: "Proof Details" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form valid, proceed to save!");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bank_details":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6   px-4 py-6">
            <div className=" lg:border-r lg:border-gray-300 lg:pr-4">
              <div>
                <FormField label="Account Name" required>
                  <Input
                    name="accountName"
                    placeholder="Enter Account Name"
                    className="capitalize"
                    data-validate="required"
                  />
                </FormField>

                <FormField label="Account Number" required>
                  <Input
                    name="accountNumber"
                    placeholder="Enter Account Number"
                    data-validate="required"
                  />
                </FormField>

                <FormField label="IFSC Code" required>
                  <Input
                    name="ifscCode"
                    placeholder="Enter IFSC Code"
                    data-validate="required"
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Bank Name" required>
                  <Input
                    name="bankName"
                    placeholder="Enter Bank Name"
                    className="capitalize"
                    data-validate="required"
                  />
                </FormField>

                <FormField label="Branch Name" required>
                  <Input
                    name="branchName"
                    placeholder="Enter Branch Name"
                    className="capitalize"
                    data-validate="required"
                  />
                </FormField>
                <FormField label="">
                  {/* Button Styled as per your image */}
                  <input
                    type="button"
                    value="Add Bank"
                    className="mt-2 w-full px-4 py-2 rounded bg-[#009333] text-white text-sm font-medium hover:bg-[#007a2a]"
                  />
                </FormField>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-left">
                <thead className=" text-gray-700 font-semibold">
                  <tr>
                    <th className=" px-3 py-2">#</th>
                    <th className=" px-3 py-2">S.No</th>
                    <th className=" px-3 py-2">Bank</th>
                    <th className=" px-3 py-2">Account Number</th>
                    <th className=" px-3 py-2">IFSC</th>
                    <th className=" px-3 py-2">Branch</th>
                    <th className=" px-3 py-2">Actions</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-2">
            <div className="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
              <div className="space-y-4">
                <FormField
                  label="Aadhaar Number"
                  required
                  
                >
                  <Input
                    name="aadhaarNumber"
                    placeholder="Enter Aadhaar Number"
                    className="w-full numeric-only"
                    maxLength={12}
                    data-validate="required"
                  />
                </FormField>

                <FormField
                  label="PAN Number"
                  required
                  
                >
                  <Input
                    name="panNumber"
                    placeholder="Enter PAN Number"
                    className="w-full uppercase alphanumeric"
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



   if (showModal) {
    return (
    <div className="fixed inset-0 flex items-start justify-center bg-[rgba(0,0,0,0.5)] z-50">

        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[500px] mx-4 mt-10">
          <div className="text-center p-4">
            <div className="flex justify-center items-center mb-5 gap-2">
              <i className="ri-user-line text-green-600 text-3xl"></i>
              <h2 className="text-[#000000] text-2xl">Select Employee Type</h2>
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
                  setEmployeeType("driver");
                  setShowModal(false);
                }}
                className="employee_type_btn bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800 px-4 py-2 rounded-md w-full"
              >
                Driver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    
    <Layout pageTitle=" Employee New">
      <div className="min-h-screen bg-gray-50">
        <main id="main-content" className="flex-1 ">
          <div className=" flex-1  overflow-y-auto h-[calc(100vh-103px)] custom-scrollbar ">
            <form onSubmit={handleSubmit}>
              {/* Basic employee Information */}
              <div className="  border-b border-gray-300 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-4 py-2">
                  <FormField label="Name" required >
                    <div>
                      <div className="flex gap-2">
                        <select
                          name="salutation"
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                        </select>
                        <Input
                          name="employeeName"
                          placeholder="Enter Name"
                          className="w-full capitalize alphabet-only"
                          data-validate="required"
                        />
                      </div>
                    </div>
                  </FormField>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  px-4 py-6">
                <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                  <FormField label="DOB" required >
                    <Input
                      name="dob"
                      type="date"
                      className="w-full"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Gender" required >
                    <select
                      name="gender"
                      className="form-control w-full border border-gray-300 rounded px-3 py-2"
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
                    
                  >
                    <Input
                      name="bloodGroup"
                      placeholder="Enter Blood Group"
                      className="w-full "
                      data-validate="required"
                    />
                  </FormField>

                  <FormField
                    label="Phone Number"
                    required
                    
                  >
                    <Input
                      name="phone"
                      placeholder="Enter Phone Number"
                      className="w-full numeric-only"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField
                    label="Whatsapp Number"
                    required
                    
                  >
                    <Input
                      name="whatsapp"
                      placeholder="Enter Phone Number"
                      className="w-full numeric-only"
                      data-validate="required"
                    />
                  </FormField>

                  <FormField label="Family Number" >
                    <Input
                      name="familyNumber"
                      placeholder="Enter Phone Number"
                      className="w-full numeric-only"
                    />
                  </FormField>
                </div>

                <div className="space-y-4">
                  <FormField label="Address Line 1" >
                    <Input
                      name="addressLine1"
                      placeholder="Enter Address Line 1"
                      className="w-full capitalize"
                    />
                  </FormField>

                  <FormField label="" >
                    <Input
                      name="addressLine2"
                      placeholder="Enter Address Line 2"
                      className="w-full capitalize"
                    />
                  </FormField>

                  <FormField label="Picture Path" >
                    <Input type="file" name="picture" className="w-full" />
                  </FormField>

                  <FormField label="Remarks" >
                    <Input
                      name="remarks"
                      placeholder="Enter Remarks"
                      className="w-full capitalize"
                    />
                  </FormField>

                  <div>
                    <FormField
                      label="State"
                      required
                      
                    >
                      <select
                        name="state"
                        className="form-control w-full border border-gray-300 rounded px-3 py-2"
                        data-validate="required"
                      >
                        <option value="">Select State</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        {/* Add more states as needed */}
                      </select>
                    </FormField>

                    <FormField label="Pincode" >
                      <Input
                        name="pincode"
                        placeholder="Enter Pincode"
                        className="w-full numeric-only"
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
            onClick={handleSubmit}
            className="bg-[#009333] text-white border border-[#009333] px-[0.5rem] py-[0.25rem] text-[0.875rem] font-normal rounded-[0.25rem]"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-[#6c757d] text-white border border-[#6c757d] px-[0.5rem] py-[0.25rem] text-[0.875rem] font-normal rounded-[0.25rem]"
          >
            Cancel
          </button>
        </footer>
      </div>
    </Layout>
  );
}
