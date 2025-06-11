"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";

// Define tab key types
type TabKey = "all" | "pending" | "completed";

const ExpenseList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { key: "all", label: "All Lists" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
  ];

  const counts: Record<TabKey, number> = {
    all: 100,
    pending: 30,
    completed: 70,
  };

  const router = useRouter();

  const expenses = [
    { id: 1, date: "01/09/2023", paymentMethod: "Cash", amount: 1000, category: "Fuel", description: "Fuel for truck", status: "pending" },
    { id: 2, date: "02/09/2023", paymentMethod: "Card", amount: 500, category: "Maintenance", description: "Truck maintenance", status: "completed" },
    { id: 3, date: "03/09/2023", paymentMethod: "Cash", amount: 2000, category: "Toll", description: "Toll fees", status: "pending" },
    { id: 4, date: "04/09/2023", paymentMethod: "Card", amount: 1500, category: "Parking", description: "Parking fees", status: "completed" },
    { id: 5, date: "05/09/2023", paymentMethod: "Cash", amount: 1200, category: "Fuel", description: "Refueling at highway", status: "completed" },
    { id: 6, date: "06/09/2023", paymentMethod: "UPI", amount: 700, category: "Snacks", description: "Snacks for driver", status: "pending" },
    { id: 7, date: "07/09/2023", paymentMethod: "Card", amount: 300, category: "Toll", description: "Bridge toll", status: "completed" },
    { id: 8, date: "08/09/2023", paymentMethod: "Cash", amount: 950, category: "Maintenance", description: "Oil change", status: "pending" },
    { id: 9, date: "09/09/2023", paymentMethod: "Cash", amount: 200, category: "Snacks", description: "Tea and snacks", status: "completed" },
    { id: 10, date: "10/09/2023", paymentMethod: "Card", amount: 1600, category: "Fuel", description: "Diesel at pump", status: "completed" },
    { id: 11, date: "11/09/2023", paymentMethod: "Cash", amount: 800, category: "Parking", description: "Parking near warehouse", status: "pending" },
    { id: 12, date: "12/09/2023", paymentMethod: "UPI", amount: 600, category: "Fuel", description: "Half tank diesel", status: "completed" },
    { id: 13, date: "13/09/2023", paymentMethod: "Card", amount: 1100, category: "Toll", description: "State toll", status: "completed" },
    { id: 14, date: "14/09/2023", paymentMethod: "Cash", amount: 400, category: "Snacks", description: "Snacks for helper", status: "pending" },
    { id: 15, date: "15/09/2023", paymentMethod: "Cash", amount: 900, category: "Maintenance", description: "Brake service", status: "completed" },
    { id: 16, date: "16/09/2023", paymentMethod: "Card", amount: 2000, category: "Fuel", description: "Full tank", status: "completed" },
    { id: 17, date: "17/09/2023", paymentMethod: "Cash", amount: 250, category: "Parking", description: "Parking charge", status: "pending" },
    { id: 18, date: "18/09/2023", paymentMethod: "UPI", amount: 1300, category: "Toll", description: "Highway toll", status: "completed" },
    { id: 19, date: "19/09/2023", paymentMethod: "Cash", amount: 300, category: "Snacks", description: "Snacks and water", status: "completed" },
    { id: 20, date: "20/09/2023", paymentMethod: "Card", amount: 1500, category: "Maintenance", description: "AC repair", status: "pending" },
    { id: 21, date: "21/09/2023", paymentMethod: "Cash", amount: 1000, category: "Fuel", description: "Fueling on route", status: "completed" },
    { id: 22, date: "22/09/2023", paymentMethod: "UPI", amount: 750, category: "Toll", description: "City toll", status: "pending" },
    { id: 23, date: "23/09/2023", paymentMethod: "Card", amount: 600, category: "Parking", description: "Night parking", status: "completed" },
    { id: 24, date: "24/09/2023", paymentMethod: "Cash", amount: 1350, category: "Fuel", description: "Highway diesel", status: "completed" },
    { id: 25, date: "25/09/2023", paymentMethod: "Card", amount: 950, category: "Snacks", description: "Snacks + lunch", status: "pending" },
    { id: 26, date: "26/09/2023", paymentMethod: "Cash", amount: 400, category: "Toll", description: "Bridge toll", status: "completed" },
    { id: 27, date: "27/09/2023", paymentMethod: "UPI", amount: 1600, category: "Maintenance", description: "Wheel alignment", status: "completed" },
    { id: 28, date: "28/09/2023", paymentMethod: "Cash", amount: 1200, category: "Fuel", description: "Diesel refuel", status: "pending" },
    { id: 29, date: "29/09/2023", paymentMethod: "Card", amount: 500, category: "Snacks", description: "Snacks for driver & helper", status: "completed" },
    { id: 30, date: "30/09/2023", paymentMethod: "Cash", amount: 1400, category: "Fuel", description: "Full tank top-up", status: "completed" },
    { id: 31, date: "01/10/2023", paymentMethod: "UPI", amount: 800, category: "Parking", description: "Market parking", status: "pending" },
    { id: 32, date: "02/10/2023", paymentMethod: "Card", amount: 900, category: "Maintenance", description: "Filter change", status: "completed" },
    { id: 33, date: "03/10/2023", paymentMethod: "Cash", amount: 1050, category: "Fuel", description: "Diesel pump", status: "pending" },
    { id: 34, date: "04/10/2023", paymentMethod: "Card", amount: 350, category: "Toll", description: "Toll gate", status: "completed" },
    { id: 35, date: "05/10/2023", paymentMethod: "UPI", amount: 700, category: "Snacks", description: "Food stop", status: "completed" },
    { id: 36, date: "06/10/2023", paymentMethod: "Cash", amount: 1000, category: "Fuel", description: "Top-up", status: "pending" },
    { id: 37, date: "07/10/2023", paymentMethod: "Card", amount: 1600, category: "Maintenance", description: "General checkup", status: "completed" },
    { id: 38, date: "08/10/2023", paymentMethod: "Cash", amount: 250, category: "Parking", description: "Quick stop", status: "pending" },
    { id: 39, date: "09/10/2023", paymentMethod: "UPI", amount: 1100, category: "Fuel", description: "Diesel for return trip", status: "completed" },
    { id: 40, date: "10/10/2023", paymentMethod: "Card", amount: 450, category: "Snacks", description: "Snacks & drinks", status: "completed" }
  ];

  const filteredExpenses = activeTab === "all" ? expenses : expenses.filter((e) => e.status === activeTab);

  return (
    <Layout pageTitle="Expense List">
      <main className="flex-1">
        <div className="overflow-y-hidden h-[calc(100vh-103px)]">
          {/* Tabs */}
          <div className="flex justify-between items-center bg-white px-1.5 mt-[5px] ml-2 whitespace-nowrap">
            <ul className="flex flex-nowrap text-sm font-medium text-center">
              {tabs.map(({ key, label }) => (
                <li key={key}>
                  <button
                    onClick={() => setActiveTab(key as TabKey)}
                    className={`tab inline-block p-[8px] rounded-t-[0.375rem] text-[#576c7d] cursor-pointer ${activeTab === key
                      ? "bg-[#ebeff3] text-[#384551]"
                      : "hover:text-[#6689b8] hover:bg-[#f5f7f9]"
                      }`}
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      {activeTab === key && (
                        <>
                          <span className="ml-2 counter-badge">{counts[key]}</span>
                          <i
                            className="ri-close-fill font-bold px-1 rounded hover:bg-[#dce0e5]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab("all");
                            }}
                          ></i>
                        </>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center flex-shrink-0 ml-auto">
              <button id="openSidebarCustomize" className="btn-sm !border-transparent !text-[#384551] hover:bg-[#eceff1] hover:border-[#eceff1] text-sm">
                <i className="ri-equalizer-line mr-1"></i>
                <span className="text-sm">Customize Table</span>
              </button>

              <div className="inline-flex border border-[#cfd7df] text-[#12375d] rounded overflow-hidden bg-white text-sm ml-2">
                <button className="flex items-center py-1 px-2 hover:bg-[#ebeff3] cursor-pointer">
                  <i className="ri-download-line mr-1"></i>
                  Import Expenses
                </button>
                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                  <i className="ri-arrow-down-s-line"></i>
                </button>
              </div>

              <button className="btn-sm btn-primary ml-2 text-sm" onClick={() => router.push('/modules/expense/new')}>
                <i className="ri-add-fill mr-1"></i>
                <span className="text-sm">Add Expense</span>
              </button>
            </div>
          </div>

          {/* View Mode / Bulk Actions / Search */}
          <div className="flex justify-between items-center px-1.5 py-1.5 bg-[#ebeff3]">
            <div className="flex items-center space-x-2 ml-2">
              <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm">
                <i className="ri-table-fill mr-1"></i>
                <span className="text-sm">Table</span>
                <i className="ri-arrow-down-s-line ml-1"></i>
              </button>

              <div className="relative inline-block">
                <button id="viewModeBtn" className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm">
                  <i className="ri-layout-5-line"></i>
                </button>
              </div>

              <button className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm" id="bulkActionsBtn">
                <i className="ri-stack-fill mr-1"></i>
                Bulk Actions
              </button>

              <div id="bulkActionButtons" className="bulk-actions flex items-center space-x-2">
                <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebf3] text-sm" id="cancelSelectionBtn" style={{ display: "none" }}>
                  <i className="ri-close-line"></i>
                  Cancel
                </button>
                <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm" id="deleteBtn" style={{ display: "none" }}>
                  <i className="ri-delete-bin-6-line"></i>
                  Delete
                </button>
                <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm" id="downloadBtn" style={{ display: "none" }}>
                  <i className="ri-arrow-down-line"></i>
                  Download
                </button>
                <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm" id="printBtn" style={{ display: "none" }}>
                  <i className="ri-printer-line"></i>
                  Print
                </button>
                <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm" id="summaryBtn" style={{ display: "none" }}>
                  <i className="ri-sticky-note-line"></i>
                  Summary
                </button>
              </div>
            </div>

            <div className="flex items-center relative space-x-2">
              <input className="form-control !h-[31px]" type="text" placeholder="Enter Expense Details" />
              <button className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm" onClick={() => setIsSidebarOpen(true)}>
                <i className="ri-sort-desc"></i>
              </button>
            </div>
          </div>

          {/* Offcanvas Sidebar */}
          <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]" onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar Content */}
            <div className={`relative w-80 mt-[5.4rem] mb-[0.15rem] rounded-tl-[0.375rem] rounded-bl-[0.375rem] bg-white shadow-[0_4px_16px_#27313a66] transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

              {/* Header */}
              <div className="py-[0.5rem] px-[0.75rem] border-b border-[#dee2e6] flex justify-between items-center">
                <h5 className="text-sm text-[#12344d]">Add Filters</h5>
                <button onClick={() => setIsSidebarOpen(false)} className="text-[#12344d] cursor-pointer">
                  <i className="ri-close-line"></i>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 overflow-y-auto flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#000000] mb-1.5">Date</label>
                  <input type="date" placeholder="Enter date" className="form-control" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#000000] mb-1.5">Payment Method</label>
                  <select className="form-control">
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#000000] mb-1.5">Category</label>
                  <select className="form-control">
                    <option value="">Select category</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Toll">Toll</option>
                    <option value="Parking">Parking</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#000000] mb-1.5">Status</label>
                  <select className="form-control">
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Add more filters as needed */}
              </div>

              <div className="p-2 border-t border-[#dee2e6] flex justify-end gap-2">
                <button className="btn-sm btn-light" onClick={() => { setIsSidebarOpen(false); }}>
                  Reset All
                </button>
                <button className="btn-sm btn-primary" onClick={() => { setIsSidebarOpen(false); }}>
                  Apply
                </button>
              </div>
            </div>

          </div>

          {/* Table */}
          <div className="bg-[#ebeff3]">
            <div className="mx-2 h-[calc(100vh-187px)] overflow-hidden rounded-lg bg-white">
              <div className="h-full overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky-table-header">
                    <tr>
                      <th className="th-cell" id="checkboxColumn">
                        <input type="checkbox" id="selectAll" className="form-check" />
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>S.No.</span>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Date</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Payment Method</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Amount</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Category</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="last-th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Description</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense, index) => (
                      <tr key={expense.id} className="group hover:bg-[#f5f7f9] text-sm cursor-pointer">
                        <td className="td-cell">
                          <input type="checkbox" className="form-check" />
                        </td>
                        <td className="td-cell">
                          <span className="float-left">{index + 1}</span>
                          <span className="float-right cursor-pointer">
                            <i className="p-1 rounded border border-[#cfd7df] text-[#4d5e6c] ri-pencil-fill opacity-0 group-hover:opacity-100"></i>
                          </span>
                        </td>
                        <td className="td-cell">{expense.date}</td>
                        <td className="td-cell">{expense.paymentMethod}</td>
                        <td className="td-cell">{expense.amount}</td>
                        <td className="td-cell">{expense.category}</td>
                        <td className="last-td-cell">{expense.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex items-center justify-start">
        <span className="text-sm">
          Showing <span className="text-red-600">20</span> of <span className="text-blue-600">400</span>
        </span>
      </footer>
    </Layout>
  );
};

export default ExpenseList;