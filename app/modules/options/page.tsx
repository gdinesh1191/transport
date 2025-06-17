"use client";

import { useRef, useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { validateForm } from "@/app/utils/formValidations"; // Import the utility
import SweetAlert, { SweetAlertHandler } from "@/app/utils/sweetAlert";
import { apiCall } from "@/app/utils/api";
import { Input } from "@/app/utils/form-controls";

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


const ToggleSwitch = ({
  isChecked,
  onChange,
  disabled = false,
}: {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={isChecked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
    <div
      className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${
        isChecked ? "bg-[#008a39]" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform duration-300 ease-in-out ${
          isChecked ? "transform translate-x-4" : "transform translate-x-0"
        }`}
      />
    </div>
  </label>
);

const Options = () => {
  const [activeForm, setActiveForm] = useState<string>("insuranceCompany");
  const [formData, setFormData] = useState({
    name: "",
    remarks: "",
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const titles: { [key: string]: string } = {
    insuranceCompany: "Insurance Company",
    loanProvider: "Loan Provider",
    expensetype: "Expense Type",
  };
  const alertRef = useRef<SweetAlertHandler>(null);

  useEffect(() => {
    fetchOptions("insuranceCompany");
  }, []);
  

  const handleFormTypeClick = (formType: string) => {
    setActiveForm(formType);
    setFormData({ name: "", remarks: "" });
    setEditingId(null);
    fetchOptions(formType);
  };

  const handleToggleStatus = async (item: any, newStatus: boolean) => {
    try {
      const updateRequest = {
        token: "putOption",
        data: {
          id: item.id,
          name: item.name,
          remarks: item.remarks,
          status: newStatus ? 1 : 0,
          type: activeForm,
        },
      };

      const result = await apiCall(updateRequest);
      if (result.status === 200) {
        fetchOptions(activeForm);
      }
    } catch (err) {
      console.error("Failed to update toggle status:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // alertRef.current?.showAlert(
    //   "warning",
    //   "Are you sure?",
    //   "This cannot be undone.",
    //   () => {
    //     alertRef.current?.showAlert(
    //       "success",
    //       "Deleted!",
    //       "Your file was successfully deleted.",
    //       () => alertRef.current?.hideAlert() // ← Manually close it
    //     );
    //   },
    //   () => {
    //     alertRef.current?.showAlert(
    //       "error",
    //       "Cancelled!",
    //       "Your file is safe.",
    //       () => alertRef.current?.hideAlert() // ← Same here
    //     );
    //   }
    // );
    if (formRef.current) {
      if (validateForm(formRef.current)) {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());

        try {
          const payload = {
            token: "putOption",
            data: {
              id: editingId,
              name: formValues.name,
              remarks: formValues.remarks,
              type: activeForm,
              status: 1,
            },
          };
          const response = await apiCall(payload);
          if (response.status === 200) {
            fetchOptions(activeForm);
            setFormData({ name: "", remarks: "" });
            setEditingId(null);
          }
        } catch (error) {
          console.error("Error adding option:", error);
        }
      }
    }
  };

  const fetchOptions = async (type: string) => {
    try {
      const payload = {
        token: "getOption",
        data: {
          type: type,
        },
      };

      const response = await apiCall(payload);
      if (
        response &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setTableData(response.data);
      } else {
        setTableData([]);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setTableData([]);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name || "",
      remarks: item.remarks || "",
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    showWarning([id]); // Pass as array
  };

  const showWarning = (ids: number[]) => {

    alertRef.current?.showAlert(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      async () => {
        try {
          const payload = {
            token: "deleteOptions",
            data: {
              ids: ids, // Already array
            },
          };
          const res = await apiCall(payload);
          if (res.status === 200) {
            alertRef.current?.showAlert(
              "success",
              "Deleted!",
              "Your file has been deleted.",
              () => {
                alertRef.current?.hideAlert();
                fetchOptions(activeForm); // Also refresh after delete
              }
            );
          } else {
            alertRef.current?.showAlert(
              "error",
              "Oops!",
              "Something went wrong. Try again.",
              () => alertRef.current?.hideAlert()
            );
          }
        } catch (err) {
          alertRef.current?.showAlert(
            "error",
            "Error!",
            "Failed to delete file.",
            () => alertRef.current?.hideAlert()
          );
        }
      },
      () => {
        alertRef.current?.showAlert(
          "error",
          "Cancelled!",
          "Your file is safe.",
          () => alertRef.current?.hideAlert()
        );
      }
    );
  };

  return (
    <Layout pageTitle="Category">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto bg-white">
          <div className="flex">
            <aside className="w-[230px] h-[calc(100vh-45px)] bg-gray-100 text-gray-800 py-1 px-3 border-r border-gray-300 flex flex-col">
              <h2 className="text-[20px] text-[#009333] font-semibold mb-3">
                Options
              </h2>

              <ul className="flex-1 overflow-y-auto pr-1 space-y-1">
                <li
                  className={`p-1 cursor-pointer flex items-center gap-2 ${
                    activeForm === "insuranceCompany" ? "text-[#009333]" : ""
                  }`}
                  onClick={() => handleFormTypeClick("insuranceCompany")}
                >
                  <i className="ri-file-text-line text-lg"></i> Insurance
                  Compnay
                </li>
                <li
                  className={`p-1 cursor-pointer flex items-center gap-2 ${
                    activeForm === "loanProvider" ? "text-[#009333]" : ""
                  }`}
                  onClick={() => handleFormTypeClick("loanProvider")}
                >
                  <i className="ri-file-text-line text-lg"></i> Loan Provider
                </li>
                <li
                  className={`p-1 cursor-pointer flex items-center gap-2 ${
                    activeForm === "expensetype" ? "text-[#009333]" : ""
                  }`}
                  onClick={() => handleFormTypeClick("expensetype")}
                >
                  <i className="ri-file-text-line text-lg"></i> Expense Type
                </li>
              </ul>
            </aside>

            <div className="flex-1 flex flex-col">
              {activeForm && (
                <div className="px-4 py-2 border-b border-gray-300 bg-white w-full">
                  <h1 className="text-[18px] sm:text-[20px] font-semibold text-[#009333]">
                    {titles[activeForm]}
                  </h1>
                </div>
              )}

              {activeForm && (
                <div className="w-full flex justify-center pt-4">
                  <form
                    ref={formRef}
                    className="p-4 w-full max-w-2xl"
                    autoComplete="off"
                  >
                    <FormField label="Name" required>
                      <Input
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleInputChange}
                        data-validate="required"
                        className="capitalize w-full"
                      />
                    </FormField>

                    <FormField label="Remarks" required>
                      <Input
                        name="remarks"
                        placeholder="Enter remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        className="capitalize w-full"
                      />
                    </FormField>

                    <div className="mb-[10px] flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                      <label className="w-46 text-[14px]"></label>
                      <div className="flex-grow">
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className="btn-sm btn-primary disabled:opacity-50"
                        >
                          {editingId ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeForm && tableData.length > 0 && (
                <div className="mx-2 max-h-[calc(100vh-300px)] flex justify-center  overflow-hidden rounded-lg bg-white">
                  <div className="w-full max-w-2xl h-full overflow-y-auto border border-gray-200 rounded-lg shadow-lg">
                    <table className="w-full">
                      <colgroup>
                        <col className="w-[5%]" />
                        <col className="w-auto" />
                        <col className="w-auto" />
                        <col className="w-[15%]" />
                        {activeForm === "classOfTruck" && (
                          <col className="w-[15%]" />
                        )}
                      </colgroup>

                      <thead className="sticky-table-header bg-gray-100">
                        <tr>
                          <th className="th-cell">S.no</th>
                          <th className="th-cell">Name</th>
                          <th className="th-cell">Remarks</th>
                          <th className="th-cell">Action</th>
                          <th className="th-cell">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.map((item, index) => (
                          <tr key={item.id}>
                            <td className="td-cell text-center">{index + 1}</td>
                            <td className="td-cell">{item.name || ""}</td>
                            <td className="td-cell">{item.remarks || ""}</td>
                            <td className="td-cell">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-indigo-600 mr-2"
                                title="Edit"
                              >
                                <i className="ri-pencil-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </td>

                            <td className="td-cell text-center">
                              <ToggleSwitch
                                isChecked={item.status == 1}
                                onChange={(checked) =>
                                  handleToggleStatus(item, checked)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <SweetAlert ref={alertRef} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Options;
