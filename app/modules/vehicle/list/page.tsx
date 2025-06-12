"use client";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import { apiCall } from "../../../utils/api";
import ToastContainer, { showToast } from "@/app/utils/toaster";
type TabKey = "all" | "new" | "existing";
const tabs: TabKey[] = ["all", "new", "existing"];
interface Vehicle {
  id: number;
  registrationNumber: string;
  owner: string;
  chassis: string;
  fcExpiry: string;
  status: string;
  nextDue: string;
  year: number;
  truckStatus: string;
}
const VehicleList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  const router = useRouter();
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoData(false);
      const payload = {
        token: "getVehicle",
        data: {
          columns: [
            "id",
            "registrationNumber",
            "owner",
            "ownerName",
            "chassis",
            "fcExpiry",
            "truckStatus",
            "nextDue",
            "year",
          ],
        },
      };
      const response = await apiCall(payload);
      if (
        response &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setVehicles(response.data);
      } else {
        setNoData(true);
        setVehicles([]);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to fetch vehicles");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVehicles();
  }, []);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(filteredVehicles.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const filteredVehicles =
    activeTab === "all"
      ? vehicles
      : vehicles.filter(
          (v) => (v.truckStatus || "").toLowerCase() === activeTab.toLowerCase()
        );
  const counts: Record<TabKey, number> = {
    all: vehicles.length,
    new: vehicles.filter((v) => (v.truckStatus || "").toLowerCase() === "new")
      .length,
    existing: vehicles.filter(
      (v) => (v.truckStatus || "").toLowerCase() === "existing"
    ).length,
  };
  useEffect(() => {
    setSelectAll(
      filteredVehicles.length > 0 &&
        selectedIds.length === filteredVehicles.length
    );
  }, [selectedIds, filteredVehicles]);

  const handleRefresh = () => {
    fetchVehicles();
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one vehicle to delete.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} vehicle(s)?`
      )
    ) {
      try {
        setLoading(true);
        setError(null);
        const payload = {
          token: "deleteVehicles",
          data: {
            ids: selectedIds,
          },
        };
        const response = await apiCall(payload);
        if (response && response.status === 200) {
          setSelectedIds([]);
          fetchVehicles();
          showToast.success("Vehicle Deleted successfully!");
        } else {
          showToast.error("Error in deleting !");
        }
      } catch (err) {
        console.error("Error deleting vehicles:", err);
        setError("An error occurred while deleting vehicles.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout pageTitle="Vehicle List">
      <main className="flex-1">
        <div className="overflow-y-hidden h-[calc(100vh-103px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading vehicles...</div>
            </div>
          )}
          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-64 flex-col">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-2 mb-2">
                <span className="block sm:inline">{error}</span>
                <button
                  onClick={handleRefresh}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {/* No Data State */}
          {noData && !loading && !error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">
                Data are not available
              </div>
            </div>
          )}
          {/* Main Content - Only show if we have data and not loading */}
          {!loading && !error && !noData && (
            <>
              {/* Tabs */}
              <div className="flex justify-between items-center bg-white px-1.5 mt-[5px] ml-2 whitespace-nowrap">
                <ul className="flex flex-nowrap text-sm font-medium text-center">
                  {tabs.map((tab) => (
                    <li key={tab}>
                      <button
                        onClick={() => setActiveTab(tab)}
                        className={`tab ${
                          activeTab === tab
                            ? "bg-[#ebeff3] text-[#384551]"
                            : "hover:text-[#6689b8] hover:bg-[#f5f7f9]"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {tab === "all"
                            ? "All List"
                            : tab.charAt(0).toUpperCase() + tab.slice(1)}
                          {activeTab === tab && (
                            <>
                              <span className="ml-2 counter-badge">
                                {counts[tab]}
                              </span>
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
                  <button
                    onClick={handleRefresh}
                    className="btn-sm btn-hover-ct mr-2"
                    disabled={loading}
                  >
                    <i className="ri-refresh-line mr-1"></i>
                    <span className="text-sm">Refresh</span>
                  </button>
                  <button
                    id="openSidebarCustomize"
                    className="btn-sm btn-hover-ct"
                  >
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
                  <button
                    className="btn-sm btn-primary ml-2 text-sm"
                    onClick={() => router.push("/modules/vehicle/new")}
                  >
                    <i className="ri-add-fill mr-1"></i>
                    <span className="text-sm">Add Vehicle</span>
                  </button>
                </div>
              </div>
              {/* View Mode / Bulk Actions / Search */}
              <div className="flex justify-between items-center px-1.5 py-1.5 bg-[#ebeff3]">
                <div className="flex items-center space-x-2 ml-2">
                  {/* First 3 buttons (shown when no checkbox is selected) */}
                  {!selectedIds.length && (
                    <>
                      <button className="btn-sm btn-hover">
                        <i className="ri-table-fill mr-1"></i>
                        <span className="text-sm">Table</span>
                        <i className="ri-arrow-down-s-line ml-1"></i>
                      </button>
                      <div className="relative inline-block">
                        <button
                          id="viewModeBtn"
                          className="btn-sm btn-visible-hover"
                        >
                          <i className="ri-layout-5-line"></i>
                        </button>
                      </div>
                      <button
                        className="btn-sm btn-visible-hover"
                        id="bulkActionsBtn"
                        onClick={() => {
                          setSelectAll(true);
                          setSelectedIds(filteredVehicles.map((v) => v.id));
                        }}
                      >
                        <i className="ri-stack-fill mr-1"></i>
                        Bulk Actions
                      </button>
                    </>
                  )}
                  {/* Bulk action buttons (shown when at least 1 is selected) */}
                  {selectedIds.length > 0 && (
                    <div className="bulk-actions flex items-center space-x-2">
                      <button className="btn-sm btn-hover" id="printBtn">
                        <i className="ri-printer-line mr-1"></i>
                        Print
                      </button>
                      <button className="btn-sm btn-hover" id="summaryBtn">
                        <i className="ri-sticky-note-line mr-1"></i>
                        Summary
                      </button>
                      <button className="btn-sm btn-hover" id="downloadBtn">
                        <i className="ri-arrow-down-line mr-1"></i>
                        Download
                      </button>
                      <button
                        className="btn-sm btn-hover"
                        id="deleteBtn"
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        <i className="ri-delete-bin-6-line mr-1"></i>
                        Delete
                      </button>
                      <button
                        className="btn-sm btn-visible-hover"
                        id="cancelSelectionBtn"
                        onClick={() => setSelectedIds([])}
                      >
                        <i className="ri-close-line mr-1"></i>
                        Cancel Bulk Actions
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center relative space-x-2">
                  <input
                    className="form-control !h-[31px]"
                    type="text"
                    placeholder="Enter Vehicle Number"
                  />
                  <button
                    className="btn-sm btn-visible-hover"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <i className="ri-sort-desc"></i>
                  </button>
                </div>
              </div>
              {/* Offcanvas Sidebar */}
              <div
                className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
                  isSidebarOpen
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-[rgba(0,0,0,0.5)]"
                  onClick={() => setIsSidebarOpen(false)}
                ></div>
                {/* Sidebar Content */}
                <div
                  className={`offcanvas-sidebar flex flex-col  ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                  } `}
                >
                  {/* Header */}
                  <div className="filter-header">
                    <h5 className="">Add Filters</h5>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="cursor-pointer"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  {/* Scrollable Content */}
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="mb-4">
                      <label className="filter-label">Vehicle Number</label>
                      <input
                        type="text"
                        placeholder="Enter vehicle number"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="filter-label">Owner Name</label>
                      <input
                        type="text"
                        placeholder="Enter owner name"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="filter-label">Chassis Number</label>
                      <input
                        type="text"
                        placeholder="Enter chassis number"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="p-2 border-t border-[#dee2e6] flex justify-end gap-2">
                    <button
                      className="btn-sm btn-light"
                      onClick={() => {
                        setIsSidebarOpen(false);
                      }}
                    >
                      Reset All
                    </button>
                    <button
                      className="btn-sm btn-primary"
                      onClick={() => {
                        setIsSidebarOpen(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              {/* Table */}
              <div className="bg-[#ebeff3]">
                {selectedIds.length > 1 && (
                  <div className=" fixed top-42 left-1/2 transform -translate-x-1/2 z-50  badge-selected">
                    {selectedIds.length} Vehicles selected
                  </div>
                )}
                <div className="mx-2 h-[calc(100vh-187px)] overflow-hidden rounded-lg bg-white">
                  <div className="h-full overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky-table-header">
                        <tr>
                          <th className="th-cell" id="checkboxColumn">
                            <input
                              type="checkbox"
                              id="selectAll"
                              className="form-check"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>S.No.</span>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Vehicle Number</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Owner Name</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Chassis Number</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>FC Expiry Date</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Status</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Next Due</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="last-th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Year</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVehicles.map((vehicle, index) => (
                          <tr
                            key={vehicle.id}
                            className={`tr-hover group ${
                              selectedIds.includes(vehicle.id)
                                ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]"
                                : ""
                            }`}
                          >
                            <td className="td-cell">
                              <input
                                type="checkbox"
                                className="form-check"
                                checked={selectedIds.includes(vehicle.id)}
                                onChange={() =>
                                  handleCheckboxChange(vehicle.id)
                                }
                              />
                            </td>
                            <td className="td-cell">
                              <span className="float-left">{index + 1}</span>
                              <span className="float-right">
                                <i
                                  onClick={() =>
                                    router.push(
                                      `/modules/vehicle/new?id=${vehicle.id}`
                                    )
                                  }
                                  className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"
                                />
                              </span>
                            </td>
                            <td className="td-cell">
                              {vehicle.registrationNumber}
                            </td>
                            <td className="td-cell">{vehicle.owner}</td>
                            <td className="td-cell">{vehicle.chassis}</td>
                            <td className="td-cell">{vehicle.fcExpiry}</td>
                            <td className="td-cell">{vehicle.truckStatus}</td>
                            <td className="td-cell">{vehicle.nextDue}</td>
                            <td className="last-td-cell">{vehicle.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex items-center justify-start">
        <span className="text-sm">
          Showing{" "}
          <span className="text-red-600">{filteredVehicles.length}</span> of{" "}
          <span className="text-blue-600">{vehicles.length}</span>
        </span>
      </footer>

      <ToastContainer />
    </Layout>
  );
};
export default VehicleList;
