"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import { apiCall } from "../../../utils/api";
import ToastContainer, { showToast } from "@/app/utils/toaster";
import { useLoading } from "@/app/utils/pageLoader";
import { useDebounce } from "@/app/utils/useDebounce";
import FilterSidebar from "@/app/utils/filterSIdebar";
import SweetAlert, { SweetAlertHandler } from "@/app/utils/sweetAlert";
import { useSelector, useDispatch } from "react-redux";
import {
  setVehicles,
  appendVehicles,
  removeVehicle,
  setPage,
  setHasMore,
  setScrollPosition,
  setFilters,
  setSearchTerm,
} from "@/store/vehicle/vehicleSlice";
import { AppDispatch, RootState } from "@/store/store";

type TabKey = "all" | "new" | "existing";
const tabs: TabKey[] = ["all", "new", "existing"];
interface Vehicle {
  id: number;
  registrationNumber: string;
  ownerName: string;
  modelYear: string;
  chasisNumber: string;
  status: string;
  truckType: string;
  npExpiryDate: string;
  truckStatus: string;
}

const VehicleList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  const router = useRouter();
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const alertRef = useRef<SweetAlertHandler>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const vehicles = useSelector((state: RootState) => state.vehicle.vehicles);
  const page = useSelector((state: RootState) => state.vehicle.page);
  const hasMore = useSelector((state: RootState) => state.vehicle.hasMore);
  const scrollPosition = useSelector(
    (state: RootState) => state.vehicle.scrollPosition
  );
  const filters = useSelector((state: RootState) => state.vehicle.filters);
  const searchTerm = useSelector(
    (state: RootState) => state.vehicle.searchTerm
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

const scrollTimeout = useRef<any>(null);

const handleScroll = useCallback(() => {
  if (listRef.current && !loading) {
    const currentScrollTop = listRef.current.scrollTop;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      dispatch(setScrollPosition(currentScrollTop));
    }, 200);  
  }
}, [dispatch, loading]);

useEffect(() => {
  const scrollContainer = listRef.current;
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }
}, [handleScroll]);


  const fetchVehicles = async (pageToLoad = 0) => {
    try {
      if (pageToLoad === 0) setLoading(true);
      else setIsFetchingMore(true);
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
            "modelYear",
            "chasisNumber",
            "truckStatus",
            "truckType",
            "npExpiryDate",
          ],
          page: pageToLoad,
          pageCount: 25,
          conditions: {
            searchQuery: searchTerm,
          },
          filters: filters,
        },
      };

      const response = await apiCall(payload);
      if (response.status === 200) {
        const fetchedData = response?.data ?? [];

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          if (pageToLoad === 0) {
            dispatch(setVehicles(fetchedData));
          } else {
            dispatch(appendVehicles(fetchedData));
          }
          dispatch(setHasMore(fetchedData.length === 25));
          setIsFetchingMore(fetchedData.length === 25);
        } else {
          if (pageToLoad === 0) {
            setNoData(true);
            dispatch(setVehicles([]));
          }
          dispatch(setHasMore(false));
          setIsFetchingMore(false);
        }
      } else {
        if (searchTerm || isFiltersApplied()) {
          dispatch(setVehicles([]));
        }
        setNoData(true);
        dispatch(setHasMore(false));
        setIsFetchingMore(false);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      dispatch(setVehicles([]));
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
          dispatch(setPage(nextPage));
          fetchVehicles(nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isFetchingMore, hasMore, page]
  );

  // Restore scroll position after data loads
  const restoreScrollPosition = useCallback(() => {
    if (listRef.current) {
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop = scrollPosition;
          
        }
      });
    }
  }, [scrollPosition]);

  // Call restore scroll position when conditions are met
  useEffect(() => {
    restoreScrollPosition();
  }, [restoreScrollPosition]);

  // Initial data fetch
  useEffect(() => {
    // Only reset scroll restoration flag when search/filter changes
    
    dispatch(setPage(0));
    fetchVehicles();
  }, [debouncedSearchTerm]);



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
    dispatch(setScrollPosition(0)); // Reset scroll position on manual refresh
    fetchVehicles();
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one vehicle to delete.");
      return;
    }
    showWarning();
  };

  const showWarning = () => {
    alertRef.current?.showAlert(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      async () => {
        alertRef.current?.hideAlert();
        try {
          const payload = {
            token: "deleteVehicles",
            data: {
              ids: selectedIds,
            },
          };
          const response = await apiCall(payload);
          if (response && response.status === 200) {
            setDeletedIds(selectedIds);
            setTimeout(() => {
              setDeletedIds([]);
              setSelectedIds([]);
              dispatch(removeVehicle(selectedIds));
              showToast.success("Vehicle Deleted successfully!");
            }, 500);
          } else {
            alertRef.current?.showAlert(
              "error",
              "Oops!",
              "Something went wrong. Try again.",
              () => {
                alertRef.current?.hideAlert();
                showToast.error("Error in deleting !");
              }
            );
          }
        } catch (err) {
          alertRef.current?.showAlert(
            "error",
            "Error!",
            "Failed to delete file.",
            () => {
              alertRef.current?.hideAlert();
              setError("An error occurred while deleting vehicles.");
            }
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

  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleApply = async () => {
    dispatch(setPage(0));
    fetchVehicles();
    setIsSidebarOpen(false);
  };

  const handleReset = () => {
    dispatch(
      setFilters({
        registrationNumber: "",
        ownerName: "",
        chasisNumber: "",
      })
    );
  };

  const handleEdit = (vehicleId: number) => {
    // Save current scroll position before navigating
    if (listRef.current) {
      dispatch(setScrollPosition(listRef.current.scrollTop));
    }
    router.push(`/modules/vehicle/new?id=${vehicleId}`);
  };

  const isFiltersApplied = () => {
    return Object.values(filters).some((value) => value);
  };

  return (
    <Layout pageTitle="Vehicle List">
      <main className="flex-1">
        <div className="overflow-y-hidden h-[calc(100vh-83px)]">
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
              <button id="openSidebarCustomize" className="btn-sm btn-hover-ct">
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
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
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
            title="Vehicle Filters"
          >
            <div className="mb-4">
              <label className="block mb-1 font-medium">Vehicle No</label>
              <input
                className="form-control"
                value={filters.registrationNumber}
                onChange={(e) =>
                  dispatch(
                    setFilters({
                      ...filters,
                      registrationNumber: e.target.value,
                    })
                  )
                }
                placeholder="Enter Vehicle No"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Owner Name</label>
              <input
                className="form-control"
                value={filters.ownerName}
                onChange={(e) =>
                  dispatch(
                    setFilters({
                      ...filters,
                      ownerName: e.target.value,
                    })
                  )
                }
                placeholder="Enter Owner Name"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Chassis No</label>
              <input
                className="form-control"
                value={filters.chasisNumber}
                onChange={(e) =>
                  dispatch(
                    setFilters({
                      ...filters,
                      chasisNumber: e.target.value,
                    })
                  )
                }
                placeholder="Enter Chassis No"
              />
            </div>
          </FilterSidebar>

          {/* Table */}
          <div className="bg-[#ebeff3]">
            {selectedIds.length > 1 && (
              <div className="fixed top-42 left-1/2 transform -translate-x-1/2 z-50 badge-selected">
                {selectedIds.length} Vehicles selected
              </div>
            )}

            <div className="mx-2 h-[calc(100vh-167px)] overflow-hidden rounded-lg bg-white">
              <div ref={listRef} className="h-full overflow-y-auto">
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
                          <span>Model Year</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Chasis Number</span>
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
                          <span>Truck Type</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="last-th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>NP Expiry</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!debouncedSearchTerm ||
                      isFiltersApplied() ||
                      (!loading && debouncedSearchTerm)) &&
                      filteredVehicles.map((vehicle, index) => {
                        const isLastRow = index === filteredVehicles.length - 1;
                        return (
                          <tr
                            key={vehicle.id}
                            ref={isLastRow ? lastRowRef : null}
                            className={`tr-hover group transition-all duration-500 ease-in-out transform
                              ${
                                selectedIds.includes(vehicle.id)
                                  ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]"
                                  : ""
                              }
                              ${
                                deletedIds.includes(vehicle.id)
                                  ? "opacity-0 scale-95"
                                  : ""
                              }
                            `}
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
                                  onClick={() => handleEdit(vehicle.id)}
                                  className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"
                                />
                              </span>
                            </td>
                            <td className="td-cell">
                              {vehicle.registrationNumber}
                            </td>
                            <td className="td-cell">{vehicle.ownerName}</td>
                            <td className="td-cell">{vehicle.modelYear}</td>
                            <td className="td-cell">{vehicle.chasisNumber}</td>
                            <td className="td-cell">{vehicle.truckStatus}</td>
                            <td className="td-cell">{vehicle.truckType}</td>
                            <td className="last-td-cell">
                              {vehicle.npExpiryDate}
                            </td>
                          </tr>
                        );
                      })}
                    {(isFetchingMore || loading) &&
                      Array.from({ length: loading ? 25 : 10 }).map(
                        (_, index) => (
                          <tr
                            key={`shimmer-${index}`}
                            className="animate-pulse"
                          >
                            {Array.from({ length: 9 }).map((_, tdIndex) => (
                              <td key={tdIndex} className="td-cell">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    {noData && (
                      <tr>
                        <td colSpan={9} className="td-cell text-center py-16">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                              <i className="ri-error-warning-line text-5xl text-gray-500"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              No data
                            </h3>
                            <p className="text-gray-500 text-sm max-w-md">
                              No users have been created yet. Click on add
                              button to create a new user
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <SweetAlert ref={alertRef} />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-[#ebeff3] py-3 h-[36.9px] px-4 flex items-center justify-start">
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
