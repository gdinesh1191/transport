"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";
 

import { useRouter } from "next/navigation";  

// Define tab key types
type TabKey = "all" | "active" | "in-active";

const VehicleList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs: TabKey[] = ["all", "active", "in-active"];

  const counts: Record<TabKey, number> = {
    all: 10,
    active: 4,
    "in-active": 6,
  };
  
  const router = useRouter();


  const vehicles = [
    { id: 1, number: "TN29N1212", owner: "Arumugam", chassis: "AD33323C3212", fcExpiry: "12/02/2023", status: "Active", nextDue: "22/08/2025", year: 2017 },
    { id: 2, number: "TN45Z2321", owner: "Kumar", chassis: "ZX92133QWER", fcExpiry: "01/05/2024", status: "In-Active", nextDue: "15/09/2025", year: 2015 },
    { id: 3, number: "TN37A5678", owner: "Ravi", chassis: "CH45321ZX", fcExpiry: "30/11/2022", status: "Active", nextDue: "10/10/2025", year: 2019 },
    { id: 4, number: "TN10B1234", owner: "Suresh", chassis: "GH12345JKL", fcExpiry: "05/04/2023", status: "Active", nextDue: "01/12/2025", year: 2016 },
    { id: 5, number: "TN11C5678", owner: "Venkatesh", chassis: "KL98765YTR", fcExpiry: "10/06/2024", status: "In-Active", nextDue: "25/01/2026", year: 2014 },
    { id: 6, number: "TN12D9101", owner: "Mohan", chassis: "MN56789ASD", fcExpiry: "20/03/2023", status: "Active", nextDue: "15/05/2026", year: 2018 },
    { id: 7, number: "TN13E1213", owner: "Rajesh", chassis: "PO34567FGH", fcExpiry: "01/12/2022", status: "In-Active", nextDue: "10/04/2026", year: 2013 },
    { id: 8, number: "TN14F1415", owner: "Balaji", chassis: "QR56789LKJ", fcExpiry: "25/10/2023", status: "Active", nextDue: "05/02/2026", year: 2020 },
    { id: 9, number: "TN15G1617", owner: "Saravanan", chassis: "ST45678MNB", fcExpiry: "30/08/2022", status: "In-Active", nextDue: "20/06/2026", year: 2012 },
    { id: 10, number: "TN16H1819", owner: "Prakash", chassis: "UV12345XCV", fcExpiry: "15/09/2024", status: "Active", nextDue: "30/07/2026", year: 2015 },
    { id: 11, number: "TN17J2021", owner: "Naveen", chassis: "WX56789ZXC", fcExpiry: "18/01/2023", status: "Active", nextDue: "12/03/2026", year: 2011 },
    { id: 12, number: "TN18K2223", owner: "Dinesh", chassis: "YU34567BNM", fcExpiry: "12/07/2023", status: "In-Active", nextDue: "22/08/2026", year: 2016 },
    { id: 13, number: "TN19L2425", owner: "Sathish", chassis: "IO78945VFR", fcExpiry: "11/02/2024", status: "Active", nextDue: "18/10/2026", year: 2013 },
    { id: 14, number: "TN20M2627", owner: "Karthik", chassis: "PL90876TRE", fcExpiry: "29/05/2022", status: "In-Active", nextDue: "09/09/2026", year: 2014 },
    { id: 15, number: "TN21N2829", owner: "Vijay", chassis: "MJ12346UYT", fcExpiry: "06/11/2024", status: "Active", nextDue: "30/11/2026", year: 2017 },
    { id: 16, number: "TN22P3031", owner: "Manoj", chassis: "NH54321REW", fcExpiry: "03/08/2023", status: "In-Active", nextDue: "01/03/2026", year: 2010 },
    { id: 17, number: "TN23Q3233", owner: "Ramesh", chassis: "BT65432PLK", fcExpiry: "12/04/2023", status: "Active", nextDue: "04/06/2026", year: 2019 },
    { id: 18, number: "TN24R3435", owner: "Selvam", chassis: "CW87654QAZ", fcExpiry: "09/10/2024", status: "Active", nextDue: "15/08/2026", year: 2018 },
    { id: 19, number: "TN25S3637", owner: "Ganesh", chassis: "XZ12345WSX", fcExpiry: "22/09/2023", status: "In-Active", nextDue: "19/12/2026", year: 2012 },
    { id: 20, number: "TN26T3839", owner: "Harish", chassis: "CV09876EDC", fcExpiry: "17/06/2022", status: "Active", nextDue: "07/07/2026", year: 2016 },
    { id: 21, number: "TN27U4041", owner: "Yogesh", chassis: "VB123456LKJ", fcExpiry: "05/03/2022", status: "In-Active", nextDue: "10/10/2026", year: 2011 },
    { id: 22, number: "TN28V4243", owner: "Lokesh", chassis: "ZXCVB12345", fcExpiry: "12/08/2023", status: "Active", nextDue: "01/02/2026", year: 2020 },
    { id: 23, number: "TN29W4445", owner: "Anand", chassis: "QAZWSX0987", fcExpiry: "15/09/2022", status: "Active", nextDue: "25/03/2026", year: 2015 },
    { id: 24, number: "TN30X4647", owner: "Deepak", chassis: "LKJHGF5678", fcExpiry: "21/12/2023", status: "In-Active", nextDue: "12/12/2026", year: 2013 },
    { id: 25, number: "TN31Y4849", owner: "Ashok", chassis: "MNBVCX4321", fcExpiry: "30/11/2024", status: "Active", nextDue: "03/01/2027", year: 2017 },
    { id: 26, number: "TN32Z5051", owner: "Jagan", chassis: "POIUYT7890", fcExpiry: "11/05/2022", status: "In-Active", nextDue: "14/02/2026", year: 2012 },
    { id: 27, number: "TN33A5253", owner: "Ragul", chassis: "ASDFGH3210", fcExpiry: "16/07/2024", status: "Active", nextDue: "17/05/2026", year: 2019 },
    { id: 28, number: "TN34B5455", owner: "Naresh", chassis: "ZXCVBN5643", fcExpiry: "08/01/2023", status: "Active", nextDue: "20/06/2026", year: 2014 },
    { id: 29, number: "TN35C5657", owner: "Surya", chassis: "PLMKJN9087", fcExpiry: "19/02/2023", status: "In-Active", nextDue: "10/04/2026", year: 2016 },
    { id: 30, number: "TN36D5859", owner: "Jeeva", chassis: "XSWQAZ2345", fcExpiry: "07/10/2023", status: "Active", nextDue: "15/05/2026", year: 2018 },
    { id: 31, number: "TN37E6061", owner: "Shankar", chassis: "EDCRFV0987", fcExpiry: "25/03/2022", status: "In-Active", nextDue: "06/06/2026", year: 2010 },
    { id: 32, number: "TN38F6263", owner: "Bhaskar", chassis: "UJMNBV6543", fcExpiry: "18/08/2023", status: "Active", nextDue: "09/07/2026", year: 2015 },
    { id: 33, number: "TN39G6465", owner: "Siva", chassis: "RFVTGB1234", fcExpiry: "23/06/2024", status: "Active", nextDue: "13/09/2026", year: 2019 },
    { id: 34, number: "TN40H6667", owner: "Parthiban", chassis: "YHNMLK4321", fcExpiry: "02/05/2022", status: "In-Active", nextDue: "11/08/2026", year: 2011 },
    { id: 35, number: "TN41I6869", owner: "Kishore", chassis: "BGTRFD6789", fcExpiry: "01/09/2023", status: "Active", nextDue: "16/12/2026", year: 2016 },
    { id: 36, number: "TN42J7071", owner: "Abdul", chassis: "NJMKIU7890", fcExpiry: "28/02/2024", status: "In-Active", nextDue: "22/10/2026", year: 2013 },
    { id: 37, number: "TN43K7273", owner: "Siddharth", chassis: "VCXZAS1234", fcExpiry: "17/12/2022", status: "Active", nextDue: "03/11/2026", year: 2017 },
    { id: 38, number: "TN44L7475", owner: "Ilayaraja", chassis: "REWQAZ7654", fcExpiry: "04/06/2023", status: "In-Active", nextDue: "28/12/2026", year: 2012 },
    { id: 39, number: "TN45M7677", owner: "Vimal", chassis: "MLKJNH5432", fcExpiry: "20/10/2023", status: "Active", nextDue: "18/01/2027", year: 2014 },
    { id: 40, number: "TN46N7879", owner: "Natarajan", chassis: "POIUYT8765", fcExpiry: "06/11/2024", status: "Active", nextDue: "08/03/2027", year: 2018 },
  ];

  const filteredVehicles = activeTab === "all" ? vehicles : vehicles.filter((v) => v.status.toLowerCase() === activeTab);

  return (
    <Layout pageTitle="Vehicle List">
 
      <main className="flex-1">
        <div className="overflow-y-hidden h-[calc(100vh-103px)]">
          {/* Tabs */}
          <div className="flex justify-between items-center bg-white px-1.5 mt-[5px] ml-2 whitespace-nowrap">
            <ul className="flex flex-nowrap text-sm font-medium text-center">
              {tabs.map((tab) => (
                <li key={tab}>
                  <button onClick={() => setActiveTab(tab)} className={`tab inline-block p-[8px] rounded-t-[0.375rem] text-[#576c7d] cursor-pointer ${activeTab === tab ? "bg-[#ebeff3] text-[#384551]" : "hover:text-[#6689b8] hover:bg-[#f5f7f9]"}`}>
                    <span className="flex items-center gap-1">
                      {tab === "all" ? "All List" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <>
                          <span className="ml-2 counter-badge">{counts[tab]}</span>
                          <i className="ri-close-fill font-bold px-1 rounded hover:bg-[#dce0e5]" onClick={(e) => { e.stopPropagation(); setActiveTab("all"); }}></i>
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
                  Import Vehicles
                </button>
                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                  <i className="ri-arrow-down-s-line"></i>
                </button>
              </div>

              <button className="btn-sm btn-primary ml-2 text-sm"  onClick={() => router.push('/modules/vehicle/new')} >
                <i className="ri-add-fill mr-1"></i>
                <span className="text-sm">Add Vehicle</span>
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
                <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm" id="cancelSelectionBtn" style={{ display: "none" }}>
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
              <input className="form-control !h-[31px]" type="text" placeholder="Enter Vehicle Number" />
              <button className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm" onClick={() => setIsSidebarOpen(true)}>
                <i className="ri-sort-desc" ></i>
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
                  <label className="block text-sm font-semibold text-[#000000] mb-1.5">Vehicle Number</label>
                  <input type="text" placeholder="Enter vehicle number" className="form-control" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#000000] mb-1.5">Owner Name</label>
                  <input type="text" placeholder="Enter owner name" className="form-control" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#000000] mb-1.5">Chassis Number</label>
                  <input type="text" placeholder="Enter chassis number" className="form-control" />
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
                          <span>Vehicle Number</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Owner Name</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Chassis Number</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>FC Expiry Date</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Status</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Next Due</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                      <th className="last-th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Year</span>
                          <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((vehicle, index) => (
                      <tr key={vehicle.id} className="group hover:bg-[#f5f7f9] text-sm cursor-pointer">
                        <td className="td-cell">
                          <input type="checkbox" className="form-check" />
                        </td>
                        <td className="td-cell">
                          <span className="float-left">{index + 1}</span>
                          <span className="float-right cursor-pointer">
                            <i className="p-1 rounded border border-[#cfd7df] text-[#4d5e6c] ri-pencil-fill opacity-0 group-hover:opacity-100"></i>
                          </span>
                        </td>
                        <td className="td-cell">{vehicle.number}</td>
                        <td className="td-cell">{vehicle.owner}</td>
                        <td className="td-cell">{vehicle.chassis}</td>
                        <td className="td-cell">{vehicle.fcExpiry}</td>
                        <td className="td-cell">{vehicle.status}</td>
                        <td className="td-cell">{vehicle.nextDue}</td>
                        <td className="last-td-cell">{vehicle.year}</td>
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

export default VehicleList;