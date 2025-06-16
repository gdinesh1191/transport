"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import { apiCall } from "../../../utils/api";
import ToastContainer, { showToast } from "@/app/utils/toaster";
import { useLoading } from "@/app/utils/pageLoader";
import { useDebounce } from "@/app/utils/useDebounce";
import FilterSidebar from "@/app/utils/filterSIdebar";

type TabKey = "all" | "Staffs" | "Drivers";
const tabs: TabKey[] = ["all", "Staffs", "Drivers"];
interface Employee {
  id: number;
  employeeName: string;
  phoneNumber: string;
  remarks: string;
  aadharNumber: string;
  panNumber: string;
  employeeStatus: string;
}
const EmployeeList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchEmployee = async (pageToLoad = 0, searchQuery = "") => {
    try {
      if (pageToLoad === 0) setLoading(true);
      else setIsFetchingMore(true);

      setError(null);
      setNoData(false);

      const payload = {
        token: "getEmployee",
        data: {
          columns: ["id", "employeeName", "remarks", "phoneNumber","aadharNumber","panNumber","employeeType"],
          page: pageToLoad,
          pageCount: 25,
          conditions: {
            searchQuery: searchQuery,
          },
          filters: {
            employeeName: employeeName,
            aadharNumber: aadharNumber,
            phoneNumber: phoneNumber,
          },
        },
      };

      const response = await apiCall(payload);
      const fetchedData = response?.data ?? [];

      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        if (pageToLoad === 0) {
          setEmployee(fetchedData);
        } else {
          setEmployee((prev) => [...prev, ...fetchedData]);
        }
        setHasMore(fetchedData.length === 25);
      } else {
        if (pageToLoad === 0) {
          setNoData(true);
          setEmployee([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      // console.error("Error fetching employee:", err);
      setError("Failed to fetch employee");
      setEmployee([]);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLTableRowElement) => {
      if (loading || isFetchingMore || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchEmployee(nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isFetchingMore, hasMore, page]
  );

  useEffect(() => {
    setPage(0);
    fetchEmployee(0, debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(filteredEmployee.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const filteredEmployee =
    activeTab === "all"
      ? employee
      : employee.filter(
          (v) =>
            (v.employeeStatus || "").toLowerCase() === activeTab.toLowerCase()
        );
  const counts: Record<TabKey, number> = {
    all: employee.length,
    Staffs: employee.filter(
      (v) => (v.employeeStatus || "").toLowerCase() === "new"
    ).length,
    Drivers: employee.filter(
      (v) => (v.employeeStatus || "").toLowerCase() === "existing"
    ).length,
  };
  useEffect(() => {
    setSelectAll(
      filteredEmployee.length > 0 &&
        selectedIds.length === filteredEmployee.length
    );
  }, [selectedIds, filteredEmployee]);

  const handleRefresh = () => {
    fetchEmployee();
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one employee to delete.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} employee(s)?`
      )
    ) {
      try {
        setLoading(true);
        setError(null);
        const payload = {
          token: "deleteEmployees",
          data: {
            ids: selectedIds,
          },
        };
        const response = await apiCall(payload);
        if (response && response.status === 200) {
          setSelectedIds([]);
          fetchEmployee();
          showToast.success("Employee Deleted successfully!");
        } else {
          showToast.error("Error in deleting !");
        }
      } catch (err) {
        console.error("Error deleting employee:", err);
        setError("An error occurred while deleting employee.");
      } finally {
        setLoading(false);
      }
    }
  };
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleApply = async () => {
    fetchEmployee();
    setIsSidebarOpen(false);
  };

  const handleReset = () => {
    setEmployeeName("");
    setPhoneNumber("");
    setAadharNumber("");
  };

  return (
    <Layout pageTitle="Employee List">
      <main className="flex-1">
        <div className="overflow-y-hidden h-[calc(100vh-103px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading employee...</div>
            </div>
          )}
          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-64 flex-col ">
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
          {noData && !loading && error && (
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
                      Import Employee
                    </button>
                    <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                      <i className="ri-arrow-down-s-line"></i>
                    </button>
                  </div>
                  <button
                    className="btn-sm btn-primary ml-2 text-sm"
                    onClick={() => router.push("/modules/employee/new")}
                  >
                    <i className="ri-add-fill mr-1"></i>
                    <span className="text-sm">Add Employee</span>
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
                          setSelectedIds(filteredEmployee.map((v) => v.id));
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
                    placeholder="Enter Employee Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <button
                    className="btn-sm btn-visible-hover"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <i className="ri-sort-desc mr-1"></i>
                  </button>
                </div>
              </div>
              {/* Offcanvas Sidebar */}
              <FilterSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onApply={handleApply}
                onReset={handleReset}
                title="Employee Filters"
              >
                <div className="mb-4">
                  <label className="filter-label">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter employee name"
                    className="form-control"
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="filter-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="form-control"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="filter-label">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter aadhar number"
                    className="form-control"
                    onChange={(e) => setAadharNumber(e.target.value)}
                  />
                </div>

                {/* Add more filters as needed */}
              </FilterSidebar>
              {/* Table */}
              <div className="bg-[#ebeff3]">
                {selectedIds.length > 1 && (
                  <div className=" fixed top-42 left-1/2 transform -translate-x-1/2 z-50  badge-selected">
                    {selectedIds.length} Employee selected
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
                              <span>Employee Name</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Phone Number</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Pan Number</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Aadhar Number</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>remarks</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployee.map((employee, index) => {
                          const isLastRow =
                            index === filteredEmployee.length - 1;
                          return (
                            <tr
                              key={employee.id}
                              ref={isLastRow ? lastRowRef : null}
                              className={`tr-hover group ${
                                selectedIds.includes(employee.id)
                                  ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]"
                                  : ""
                              }`}
                            >
                              <td className="td-cell">
                                <input
                                  type="checkbox"
                                  className="form-check"
                                  checked={selectedIds.includes(employee.id)}
                                  onChange={() =>
                                    handleCheckboxChange(employee.id)
                                  }
                                />
                              </td>
                              <td className="td-cell">
                                <span className="float-left">{index + 1}</span>
                                <span className="float-right">
                                  <i
                                    onClick={() =>
                                      router.push(
                                        `/modules/employee/new?id=${employee.id}`
                                      )
                                    }
                                    className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"
                                  />
                                </span>
                              </td>
                              <td className="td-cell">
                                {employee.employeeName}
                              </td>
                              <td className="td-cell">
                                {employee.phoneNumber}
                              </td>
                              <td className="td-cell">{employee.panNumber}</td>
                              <td className="td-cell">{employee.aadharNumber}</td>
                              <td className="td-cell">
                                {employee.remarks}
                              </td>
                            </tr>
                          );
                        })}
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
          Showing <span className="text-red-600">{filteredEmployee.length}</span>{" "}
          of <span className="text-blue-600">{employee.length}</span>
        </span>
      </footer>

      <ToastContainer />
    </Layout>
  );
};
export default EmployeeList;
