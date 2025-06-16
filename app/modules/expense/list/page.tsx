"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import { apiCall } from "../../../utils/api";
import ToastContainer, { showToast } from "@/app/utils/toaster";
import { useLoading } from "@/app/utils/pageLoader";
import { useDebounce } from "@/app/utils/useDebounce";
import FilterSidebar from "@/app/utils/filterSIdebar";

type TabKey = "all" | "Pending" | "Completed";
const tabs: TabKey[] = ["all", "Pending", "Completed"];
interface Expense {
  id: number;
  tripSheetId: string;
  expenseCategory: string;
  amount: string;
  remarks: string;
  expenseDate: string;

  expenseStatus: string;
}
const ExpenseList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenseDate, setExpenseDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");


  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expense, setExpense] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchExpense = async (pageToLoad = 0, searchQuery = "") => {
    try {
      if (pageToLoad === 0) setLoading(true);
      else setIsFetchingMore(true);

      setError(null);
      setNoData(false);

      const payload = {
        token: "getTripsheetExpense",
        data: {
          columns: [
            "id",
            "tripSheetId",
            "expenseCategory",
            "amount",
            "remarks",
            "expenseDate",
          ],
          page: pageToLoad,
          pageCount: 25,
          conditions: {
            searchQuery: searchQuery,
          },
          filters: {
            date:expenseDate,
            category:category,
            status:status,
            method:paymentMethod
          },
        },
      };

      const response = await apiCall(payload);
      const fetchedData = response?.tripSheetExpense ?? [];

      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        if (pageToLoad === 0) {
          setExpense(fetchedData);
        } else {
          setExpense((prev) => [...prev, ...fetchedData]);
        }
        setHasMore(fetchedData.length === 25);
      } else {
        if (pageToLoad === 0) {
          setNoData(true);
          setExpense([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      // console.error("Error fetching expense:", err);
      setError("Failed to fetch expense");
      setExpense([]);
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
          fetchExpense(nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isFetchingMore, hasMore, page]
  );

  useEffect(() => {
    setPage(0);
    fetchExpense(0, debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(filteredExpense.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };
  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const filteredExpense =
    activeTab === "all"
      ? expense
      : expense.filter(
          (v) => (v.expenseStatus || "").toLowerCase() === activeTab.toLowerCase()
        );
  const counts: Record<TabKey, number> = {
    all: expense.length,
    Pending: expense.filter((v) => (v.expenseStatus || "").toLowerCase() === "new")
      .length,
    Completed: expense.filter(
      (v) => (v.expenseStatus || "").toLowerCase() === "existing"
    ).length,
  };
  useEffect(() => {
    setSelectAll(
      filteredExpense.length > 0 &&
        selectedIds.length === filteredExpense.length
    );
  }, [selectedIds, filteredExpense]);

  const handleRefresh = () => {
    fetchExpense();
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one expense to delete.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} expense(s)?`
      )
    ) {
      try {
        setLoading(true);
        setError(null);
        const payload = {
          token: "deleteTripsheetExpenses",
          data: {
            ids: selectedIds,
          },
        };
        const response = await apiCall(payload);
        if (response && response.status === 200) {
          setSelectedIds([]);
          fetchExpense();
          showToast.success("Expense Deleted successfully!");
        } else {
          showToast.error("Error in deleting !");
        }
      } catch (err) {
        console.error("Error deleting expense:", err);
        setError("An error occurred while deleting expense.");
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
    fetchExpense();
    setIsSidebarOpen(false);
  };

  const handleReset = () => {
    setExpenseDate('')
    setPaymentMethod('')
    setCategory('')
    setStatus('')
  };

  return (
    <Layout pageTitle="Expense List">
      <main className="flex-1">
        <div className="overflow-y-hidden h-[calc(100vh-103px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading expense...</div>
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
                      Import Expense
                    </button>
                    <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                      <i className="ri-arrow-down-s-line"></i>
                    </button>
                  </div>
                  <button
                    className="btn-sm btn-primary ml-2 text-sm"
                    onClick={() => router.push("/modules/expense/new")}
                  >
                    <i className="ri-add-fill mr-1"></i>
                    <span className="text-sm">Add Expense</span>
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
                          setSelectedIds(filteredExpense.map((v) => v.id));
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
                    placeholder="Enter Expense Category"
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
                title="Expense Filters"
              >
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      placeholder="Enter date"
                      className="form-control"
                      onChange={(e) => setExpenseDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">
                      Payment Method
                    </label>
                    <select className="form-control"  onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="">Select payment method</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">
                      Category
                    </label>
                    <select className="form-control" onChange={(e) => setCategory(e.target.value)}>
                      <option value="">Select category</option>
                      <option value="Fuel">Fuel</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Toll">Toll</option>
                      <option value="Parking">Parking</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">
                      Status
                    </label>
                    <select className="form-control" onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Select status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Add more filters as needed */}
              </FilterSidebar>
              {/* Table */}
              <div className="bg-[#ebeff3]">
                {selectedIds.length > 1 && (
                  <div className=" fixed top-42 left-1/2 transform -translate-x-1/2 z-50  badge-selected">
                    {selectedIds.length} Expense selected
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
                              <span>TripSheetId</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>ExpenseCategory</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Amount</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>Remarks</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                          <th className="th-cell">
                            <div className="flex justify-between items-center gap-1">
                              <span>ExpenseDate</span>
                              <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpense.map((expense, index) => {
                          const isLastRow =
                            index === filteredExpense.length - 1;
                          return (
                            <tr
                              key={expense.id}
                              ref={isLastRow ? lastRowRef : null}
                              className={`tr-hover group ${
                                selectedIds.includes(expense.id)
                                  ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]"
                                  : ""
                              }`}
                            >
                              <td className="td-cell">
                                <input
                                  type="checkbox"
                                  className="form-check"
                                  checked={selectedIds.includes(expense.id)}
                                  onChange={() =>
                                    handleCheckboxChange(expense.id)
                                  }
                                />
                              </td>
                              <td className="td-cell">
                                <span className="float-left">{index + 1}</span>
                                <span className="float-right">
                                  <i
                                    onClick={() =>
                                      router.push(
                                        `/modules/expense/new?id=${expense.id}`
                                      )
                                    }
                                    className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"
                                  />
                                </span>
                              </td>
                              <td className="td-cell">
                                {expense.tripSheetId}
                              </td>
                              <td className="td-cell">{expense.expenseCategory}</td>
                              <td className="td-cell">{expense.amount}</td>
                              <td className="td-cell">
                                {expense.remarks}
                              </td>
                              <td className="td-cell">{expense.expenseDate}</td>
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
          Showing <span className="text-red-600">{filteredExpense.length}</span>{" "}
          of <span className="text-blue-600">{expense.length}</span>
        </span>
      </footer>

      <ToastContainer />
    </Layout>
  );
};
export default ExpenseList;
