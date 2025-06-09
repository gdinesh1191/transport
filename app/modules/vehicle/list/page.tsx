"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";

// Define tab key types
type TabKey = "all" | "active" | "in-active";

const VehicleList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const tabs: TabKey[] = ["all", "active", "in-active"];

  const counts: Record<TabKey, number> = {
    all: 10,
    active: 4,
    "in-active": 6,
  };

  const vehicles = [
    {
      id: 1,
      number: "TN29N1212",
      owner: "Arumugam",
      chassis: "AD33323C3212",
      fcExpiry: "12/02/2023",
      status: "Active",
      nextDue: "22/08/2025",
      year: 2017,
    },
    {
      id: 2,
      number: "TN45Z2321",
      owner: "Kumar",
      chassis: "ZX92133QWER",
      fcExpiry: "01/05/2024",
      status: "In-Active",
      nextDue: "15/09/2025",
      year: 2015,
    },
    {
      id: 3,
      number: "TN37A5678",
      owner: "Ravi",
      chassis: "CH45321ZX",
      fcExpiry: "30/11/2022",
      status: "Active",
      nextDue: "10/10/2025",
      year: 2019,
    },
  ];

  const filteredVehicles =
    activeTab === "all"
      ? vehicles
      : vehicles.filter((v) => v.status.toLowerCase() === activeTab);

  return (
    <Layout pageTitle="Vehicle List">
      <div className="flex-1">
        <main className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex justify-between items-center bg-white px-1.5 mt-[5px]">
            <ul className="flex flex-wrap text-sm font-medium text-center bg-red">
             {tabs.map((tab) => (
  <li key={tab}>
    <button
      onClick={() => setActiveTab(tab)}
      className={`tab inline-block p-[8px] rounded-t-[0.375rem] text-[#576c7d] cursor-pointer ${
        activeTab === tab
          ? "bg-[#ebeff3] text-[#384551]"
          : "hover:text-[#6689b8] hover:bg-[#f5f7f9]"
      }`}
    >
      <span className="flex items-center gap-1">
        {tab === "all"
          ? "All List"
          : tab.charAt(0).toUpperCase() + tab.slice(1)}

        {/* Always render badge and close icon but hide when inactive */}
        <span
          className={`ml-2 inline-block min-w-[20px] h-[20px] px-[6px] text-xs leading-[20px] rounded-full text-center ${
            activeTab === tab
              ? "bg-[#009333] text-white"
              : "invisible"
          }`}
        >
          {counts[tab]}
        </span>
        <i
          className={`ri-close-fill font-bold px-2 ${
            activeTab === tab ? "" : "invisible"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("all");
          }}
        ></i>
      </span>
    </button>
  </li>
))}

            </ul>

            <div className="flex items-center">
              <button id="openSidebarCustomize" className="btn-clean">
                <i className="ri-equalizer-line"></i>
                <span className="text-sm">Customize Table</span>
              </button>
              <button className="btn-bordered ml-2">
                <i className="ri-arrow-down-circle-fill"></i>
                Import Vehicles
              </button>
              <button className="btn-primary ml-2">
                <i className="ri-add-circle-line"></i>
                Add Vehicle
              </button>
            </div>
          </div>

          {/* View Mode / Bulk Actions / Search */}
          <div className="flex justify-between items-center px-1.5 py-1.5 bg-[#ebeff3]">
            <div className="flex items-center space-x-2 mt-1">
              <button className="btn-bordered">
                <i className="ri-table-2"></i>
                <span className="text-sm">Table</span>
              </button>

              <div className="relative inline-block">
                <button id="viewModeBtn" className="btn-clean-xtra">
                  <i className="ri-book-open-line"></i>
                </button>
              </div>

              <button className="btn-clean-xtra" id="bulkActionsBtn">
                <i className="ri-database-2-line"></i>
                Bulk Actions
              </button>

              <div
                id="bulkActionButtons"
                className="bulk-actions flex items-center space-x-2"
              >
                <button
                  className="btn-bordered"
                  id="cancelSelectionBtn"
                  style={{ display: "none" }}
                >
                  <i className="ri-close-line"></i>
                  Cancel
                </button>
                <button
                  className="btn-bordered"
                  id="deleteBtn"
                  style={{ display: "none" }}
                >
                  <i className="ri-delete-bin-6-line"></i>
                  Delete
                </button>
                <button
                  className="btn-bordered"
                  id="downloadBtn"
                  style={{ display: "none" }}
                >
                  <i className="ri-arrow-down-line"></i>
                  Download
                </button>
                <button
                  className="btn-bordered"
                  id="printBtn"
                  style={{ display: "none" }}
                >
                  <i className="ri-printer-line"></i>
                  Print
                </button>
                <button
                  className="btn-bordered"
                  id="summaryBtn"
                  style={{ display: "none" }}
                >
                  <i className="ri-sticky-note-line"></i>
                  Summary
                </button>
              </div>
            </div>

            <div className="flex items-center relative">
              <input
                className="form-control"
                type="text"
                placeholder="Enter Vehicle Number"
              />
              <i
                className="ri-sort-desc cursor-pointer ml-2"
                id="openSidebar"
              ></i>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#ebeff3]">
            <div className="mx-1 max-h-[calc(100vh-190px)] overflow-y-auto rounded-lg bg-white">
              <table className="table w-full">
                <thead className="table-head">
                  <tr className="bg-white shadow-[inset_0_1px_0_#ebeff3,inset_0_-1px_0_#ebeff3]">
                    <th className="checkbox-column" id="checkboxColumn">
                      <input
                        type="checkbox"
                        id="selectAll"
                        className="form-check"
                      />
                    </th>
                    <th className="table-th">S.No.</th>
                    <th className="table-th">Vehicle Number</th>
                    <th className="table-th">Owner Name</th>
                    <th className="table-th">Chassis Number</th>
                    <th className="table-th">FC Expiry Date</th>
                    <th className="table-th">Status</th>
                    <th className="table-th">Next Due</th>
                    <th className="table-th">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id} className="table-row">
                      <td className="table-td checkbox-column text-center">
                        <input
                          type="checkbox"
                          className="row-checkbox form-check"
                        />
                      </td>
                      <td className="table-td">
                        <span className="float-left">{index + 1}</span>
                        <span className="table-edit-icon float-right cursor-pointer text-[#009333] hover:text-[#007a2a]">
                          <i className="ri-pencil-fill"></i>
                        </span>
                      </td>
                      <td className="table-td">{vehicle.number}</td>
                      <td className="table-td">{vehicle.owner}</td>
                      <td className="table-td">{vehicle.chassis}</td>
                      <td className="table-td">{vehicle.fcExpiry}</td>
                      <td className="table-td">{vehicle.status}</td>
                      <td className="table-td">{vehicle.nextDue}</td>
                      <td className="table-td">{vehicle.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default VehicleList;
