"use client";

import React from "react";
import Layout from "../../../components/Layout";

const VehicleList = () => {
  return (
    <Layout pageTitle="Vehicle List">
      <div className="bg-gray-50 flex-1">
        <main className="flex-1 overflow-y-auto">
          
       
            <div className="flex justify-between items-center bg-white px-1.5 mt-[5px]">
              <ul className="flex flex-wrap text-sm font-medium text-center bg-white text-[#576c7d] ml-2">
                <li className="me-2 rounded-lg">
                  <a
                    href="#"
                    className="tab inline-block p-2 text-[#384551] bg-[#ebeff3] !rounded-t-[4px]"
                  >
                    All List
                    <i className="ri-close-fill font-bold px-2"></i>
                  </a>
                </li>
                <li className="me-2">
                  <a href="#" className="tab inline-block p-2 text-[#384551]">
                    Active
                    <i className="ri-close-fill font-bold px-2 hidden"></i>
                  </a>
                </li>
                <li className="me-2">
                  <a href="#" className="tab inline-block p-2 text-[#384551]">
                    In-Active
                    <i className="ri-close-fill font-bold px-2 hidden"></i>
                  </a>
                </li>
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

            
            <div className="flex justify-between items-center px-1.5 py-1.5 bg-[#ebeff3] mt-2">
              <div className="flex items-center space-x-2 mt-1">
                <button className="btn-bordered">
                  <i className="ri-table-2"></i>
                  <span className="text-sm">Table</span>
                </button>

                <div className="relative inline-block">
                  <button id="viewModeBtn" className="btn-clean-xtra">
                    <i className="ri-book-open-line"></i>
                  </button>
                  <div
                    id="viewModeDropdown"
                    className="absolute top-full left-0 mt-2 w-40 bg-white rounded shadow-lg hidden z-50"
                  >
                    <ul className="text-sm text-black">
                      <li>
                        <button
                          className="w-full text-left px-4 py-1 hover:bg-[#009333] hover:text-white"
                          id="comfortBtn"
                        >
                          <i className="ri-book-open-line"></i> Comfortable
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-1 hover:bg-[#009333] hover:text-white"
                          id="compactBtn"
                        >
                          <i className="ri-book-open-line"></i> Compact
                        </button>
                      </li>
                    </ul>
                  </div>
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
                    <tr className="table-row">
                      <td className="table-td checkbox-column text-center">
                        <input
                          type="checkbox"
                          className="row-checkbox form-check"
                        /> 
                      </td>
                      <td className="table-td">
                        <span className="float-left">1</span>
                        <span className="table-edit-icon float-right cursor-pointer text-[#009333] hover:text-[#007a2a]">
                          <i className="ri-pencil-fill"></i>
                        </span>
                      </td>
                      <td className="table-td">TN29N1212</td>
                      <td className="table-td">Arumugam</td>
                      <td className="table-td">AD33323C3212</td>
                      <td className="table-td">12/02/2023</td>
                      <td className="table-td">Active</td>
                      <td className="table-td">22/08/2025</td>
                      <td className="table-td">2017</td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-td checkbox-column text-center">
                        <input
                          type="checkbox"
                          className="row-checkbox form-check"
                        />
                      </td>
                      <td className="table-td">
                        <span className="float-left">1</span>
                        <span className="table-edit-icon float-right cursor-pointer text-[#009333] hover:text-[#007a2a]">
                          <i className="ri-pencil-fill"></i>
                        </span>
                      </td>
                      <td className="table-td">TN29N1212</td>
                      <td className="table-td">Arumugam</td>
                      <td className="table-td">AD33323C3212</td>
                      <td className="table-td">12/02/2023</td>
                      <td className="table-td">Active</td>
                      <td className="table-td">22/08/2025</td>
                      <td className="table-td">2017</td>
                    </tr>
                   
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
