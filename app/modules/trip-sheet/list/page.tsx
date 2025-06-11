"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";

// Define tab key types
type TabKey = "all" | "on-transit" | "completed" | "cancelled";

const TripSheetList = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const tabs = [
        { key: "all", label: "All Lists" },
        { key: "on-transit", label: "On Transit" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
    ];

    const counts: Record<TabKey, number> = {
        all: 100,
        "on-transit": 30,
        completed: 50,
        cancelled: 20,
    };

    const router = useRouter();

    const tripSheets = [
        { id: 1, tripDate: "01/09/2023", vehicleNumber: "DL83DC8480", driverName: "Sarika Prasad", agentBrokerName: "ABC Logistics", tripType: "Inbound", placeFrom: "Delhi", placeTo: "Mumbai", status: "on-transit" },
        { id: 2, tripDate: "02/09/2023", vehicleNumber: "MH25PR1234", driverName: "Manikanta Dutta", agentBrokerName: "XYZ Transport", tripType: "Outbound", placeFrom: "Mumbai", placeTo: "Delhi", status: "completed" },
        { id: 3, tripDate: "03/09/2023", vehicleNumber: "KA81RY8770", driverName: "Rahul Bhat", agentBrokerName: "PQR Logistics", tripType: "Inbound", placeFrom: "Bangalore", placeTo: "Chennai", status: "cancelled" },
        { id: 4, tripDate: "04/09/2023", vehicleNumber: "TN22HT4567", driverName: "Sundar Raj", agentBrokerName: "Fast Freight", tripType: "Outbound", placeFrom: "Chennai", placeTo: "Hyderabad", status: "on-transit" },
        { id: 5, tripDate: "05/09/2023", vehicleNumber: "RJ14KL7788", driverName: "Nitin Goyal", agentBrokerName: "Global Movers", tripType: "Inbound", placeFrom: "Jaipur", placeTo: "Ahmedabad", status: "completed" },
        { id: 6, tripDate: "06/09/2023", vehicleNumber: "GJ01MN9876", driverName: "Alok Yadav", agentBrokerName: "ABC Logistics", tripType: "Inbound", placeFrom: "Ahmedabad", placeTo: "Surat", status: "cancelled" },
        { id: 7, tripDate: "07/09/2023", vehicleNumber: "UP32ZX1122", driverName: "Deepak Kumar", agentBrokerName: "Quick Move", tripType: "Outbound", placeFrom: "Lucknow", placeTo: "Kanpur", status: "on-transit" },
        { id: 8, tripDate: "08/09/2023", vehicleNumber: "MP09BC3344", driverName: "Raj Malhotra", agentBrokerName: "SpeedX", tripType: "Inbound", placeFrom: "Indore", placeTo: "Bhopal", status: "completed" },
        { id: 9, tripDate: "09/09/2023", vehicleNumber: "HR26DK5566", driverName: "Suresh Rana", agentBrokerName: "Fast Freight", tripType: "Outbound", placeFrom: "Gurgaon", placeTo: "Noida", status: "on-transit" },
        { id: 10, tripDate: "10/09/2023", vehicleNumber: "CH01AA7788", driverName: "Harpreet Singh", agentBrokerName: "Reliable Transport", tripType: "Inbound", placeFrom: "Chandigarh", placeTo: "Shimla", status: "cancelled" },
        { id: 11, tripDate: "11/09/2023", vehicleNumber: "WB20DF8899", driverName: "Anup Saha", agentBrokerName: "East Cargo", tripType: "Outbound", placeFrom: "Kolkata", placeTo: "Siliguri", status: "completed" },
        { id: 12, tripDate: "12/09/2023", vehicleNumber: "AS01GH9900", driverName: "Bijoy Das", agentBrokerName: "Assam Freight", tripType: "Inbound", placeFrom: "Guwahati", placeTo: "Shillong", status: "on-transit" },
        { id: 13, tripDate: "13/09/2023", vehicleNumber: "OR02JK1010", driverName: "Ramesh Patra", agentBrokerName: "Eastern Movers", tripType: "Outbound", placeFrom: "Bhubaneswar", placeTo: "Cuttack", status: "completed" },
        { id: 14, tripDate: "14/09/2023", vehicleNumber: "JK10LM1112", driverName: "Amit Kaul", agentBrokerName: "North Freight", tripType: "Inbound", placeFrom: "Jammu", placeTo: "Srinagar", status: "on-transit" },
        { id: 15, tripDate: "15/09/2023", vehicleNumber: "PB65NO1234", driverName: "Gurpreet Kaur", agentBrokerName: "Punjab Haul", tripType: "Outbound", placeFrom: "Ludhiana", placeTo: "Amritsar", status: "cancelled" },
        { id: 16, tripDate: "16/09/2023", vehicleNumber: "BR11PQ5678", driverName: "Vikash Kumar", agentBrokerName: "Bihar Express", tripType: "Inbound", placeFrom: "Patna", placeTo: "Gaya", status: "completed" },
        { id: 17, tripDate: "17/09/2023", vehicleNumber: "TN09RS9101", driverName: "Karthik S", agentBrokerName: "South Haul", tripType: "Outbound", placeFrom: "Madurai", placeTo: "Tirunelveli", status: "on-transit" },
        { id: 18, tripDate: "18/09/2023", vehicleNumber: "AP03TU2345", driverName: "Vamsi Krishna", agentBrokerName: "Andhra Cargo", tripType: "Inbound", placeFrom: "Vijayawada", placeTo: "Visakhapatnam", status: "completed" },
        { id: 19, tripDate: "19/09/2023", vehicleNumber: "TS08UV3456", driverName: "Sai Kumar", agentBrokerName: "Hyderabad Movers", tripType: "Outbound", placeFrom: "Hyderabad", placeTo: "Warangal", status: "cancelled" },
        { id: 20, tripDate: "20/09/2023", vehicleNumber: "KL07WX4567", driverName: "Arun Babu", agentBrokerName: "Kerala Freight", tripType: "Inbound", placeFrom: "Kochi", placeTo: "Trivandrum", status: "on-transit" },
        { id: 21, tripDate: "21/09/2023", vehicleNumber: "GA06YZ5678", driverName: "Savio D", agentBrokerName: "Goa Logistics", tripType: "Outbound", placeFrom: "Panaji", placeTo: "Margao", status: "completed" },
        { id: 22, tripDate: "22/09/2023", vehicleNumber: "AN01AB6789", driverName: "Ravi Kumar", agentBrokerName: "Island Haul", tripType: "Inbound", placeFrom: "Port Blair", placeTo: "Havelock", status: "on-transit" },
        { id: 23, tripDate: "23/09/2023", vehicleNumber: "MH12CD7890", driverName: "Sandeep Joshi", agentBrokerName: "XYZ Transport", tripType: "Outbound", placeFrom: "Pune", placeTo: "Nagpur", status: "cancelled" },
        { id: 24, tripDate: "24/09/2023", vehicleNumber: "DL01EF8901", driverName: "Ritika Singh", agentBrokerName: "Capital Movers", tripType: "Inbound", placeFrom: "Delhi", placeTo: "Agra", status: "completed" },
        { id: 25, tripDate: "25/09/2023", vehicleNumber: "GJ05GH9012", driverName: "Hemant Patel", agentBrokerName: "Gujarat Movers", tripType: "Outbound", placeFrom: "Surat", placeTo: "Rajkot", status: "on-transit" },
        { id: 26, tripDate: "26/09/2023", vehicleNumber: "UP80IJ0123", driverName: "Mohit Verma", agentBrokerName: "UP Logistics", tripType: "Inbound", placeFrom: "Agra", placeTo: "Varanasi", status: "completed" },
        { id: 27, tripDate: "27/09/2023", vehicleNumber: "MP04KL1234", driverName: "Arvind Meena", agentBrokerName: "Madhya Cargo", tripType: "Outbound", placeFrom: "Jabalpur", placeTo: "Gwalior", status: "cancelled" },
        { id: 28, tripDate: "28/09/2023", vehicleNumber: "RJ21MN2345", driverName: "Pooja Sharma", agentBrokerName: "Desert Express", tripType: "Inbound", placeFrom: "Udaipur", placeTo: "Jodhpur", status: "on-transit" },
        { id: 29, tripDate: "29/09/2023", vehicleNumber: "TN15OP3456", driverName: "Vetri Selvan", agentBrokerName: "Chola Haul", tripType: "Outbound", placeFrom: "Salem", placeTo: "Erode", status: "completed" },
        { id: 30, tripDate: "30/09/2023", vehicleNumber: "KA05QR4567", driverName: "Sanjay Hegde", agentBrokerName: "Southern Freight", tripType: "Inbound", placeFrom: "Mysore", placeTo: "Mangalore", status: "cancelled" },
        { id: 31, tripDate: "01/10/2023", vehicleNumber: "HR55ST5678", driverName: "Tarun Malik", agentBrokerName: "Reliable Transport", tripType: "Outbound", placeFrom: "Rohtak", placeTo: "Hisar", status: "on-transit" },
        { id: 32, tripDate: "02/10/2023", vehicleNumber: "WB44UV6789", driverName: "Tapas Ghosh", agentBrokerName: "East Bengal Freight", tripType: "Inbound", placeFrom: "Durgapur", placeTo: "Asansol", status: "completed" },
        { id: 33, tripDate: "03/10/2023", vehicleNumber: "JK11WX7890", driverName: "Iqbal Lone", agentBrokerName: "Himalaya Haul", tripType: "Outbound", placeFrom: "Leh", placeTo: "Kargil", status: "on-transit" },
        { id: 34, tripDate: "04/10/2023", vehicleNumber: "CH04YZ8901", driverName: "Amandeep Singh", agentBrokerName: "Punjab Haul", tripType: "Inbound", placeFrom: "Mohali", placeTo: "Zirakpur", status: "cancelled" },
        { id: 35, tripDate: "05/10/2023", vehicleNumber: "AP10AB9012", driverName: "Teja Reddy", agentBrokerName: "Andhra Cargo", tripType: "Outbound", placeFrom: "Guntur", placeTo: "Nellore", status: "completed" },
        { id: 36, tripDate: "06/10/2023", vehicleNumber: "TS11CD0123", driverName: "Naveen Rao", agentBrokerName: "Telangana Freight", tripType: "Inbound", placeFrom: "Karimnagar", placeTo: "Khammam", status: "on-transit" },
        { id: 37, tripDate: "07/10/2023", vehicleNumber: "KL11EF1234", driverName: "Jithin Joseph", agentBrokerName: "Kerala Freight", tripType: "Outbound", placeFrom: "Kozhikode", placeTo: "Kannur", status: "cancelled" },
        { id: 38, tripDate: "08/10/2023", vehicleNumber: "GJ08GH2345", driverName: "Rakesh Solanki", agentBrokerName: "Gujarat Movers", tripType: "Inbound", placeFrom: "Bhuj", placeTo: "Gandhidham", status: "completed" },
        { id: 39, tripDate: "09/10/2023", vehicleNumber: "DL07IJ3456", driverName: "Simran Kaur", agentBrokerName: "Capital Movers", tripType: "Outbound", placeFrom: "New Delhi", placeTo: "Faridabad", status: "on-transit" },
        { id: 40, tripDate: "10/10/2023", vehicleNumber: "MH14KL4567", driverName: "Nikhil Pawar", agentBrokerName: "Maharashtra Cargo", tripType: "Inbound", placeFrom: "Thane", placeTo: "Pune", status: "completed" }
    ];

    const filteredTripSheets = activeTab === "all" ? tripSheets : tripSheets.filter((t) => t.status === activeTab);

    return (
        <Layout pageTitle="Trip Sheet List">
            <main className="flex-1">
                <div className="overflow-y-hidden h-[calc(100vh-103px)]">
                    {/* Tabs */}
                    <div className="flex justify-between items-center bg-white px-1.5 mt-[5px] ml-2 whitespace-nowrap">
                        <ul className="flex flex-nowrap text-sm font-medium text-center">
                            {tabs.map(({ key, label: label }) => (
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
                                    Import Trip Sheets
                                </button>
                                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                                    <i className="ri-arrow-down-s-line"></i>
                                </button>
                            </div>

                            <button className="btn-sm btn-primary ml-2 text-sm" onClick={() => router.push('/modules/trip-sheet/new')}>
                                <i className="ri-add-fill mr-1"></i>
                                <span className="text-sm">Add Trip Sheet</span>
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
                            <input className="form-control !h-[31px]" type="text" placeholder="Enter Trip Sheet Details" />
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
                                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">Trip Date</label>
                                    <input type="date" placeholder="Enter trip date" className="form-control" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">Vehicle Number</label>
                                    <input type="text" placeholder="Enter vehicle number" className="form-control" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">Driver Name</label>
                                    <input type="text" placeholder="Enter driver name" className="form-control" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">Agent / Broker Name</label>
                                    <input type="text" placeholder="Enter agent / broker name" className="form-control" />
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
                                                    <span>Trip Date</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
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
                                                    <span>Driver Name</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Agent / Broker Name</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Trip Type</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Place From</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="last-th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Place To</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTripSheets.map((tripSheet, index) => (
                                            <tr key={tripSheet.id} className="group hover:bg-[#f5f7f9] text-sm cursor-pointer">
                                                <td className="td-cell">
                                                    <input type="checkbox" className="form-check" />
                                                </td>
                                                <td className="td-cell">
                                                    <span className="float-left">{index + 1}</span>
                                                    <span className="float-right cursor-pointer">
                                                        <i className="p-1 rounded border border-[#cfd7df] text-[#4d5e6c] ri-pencil-fill opacity-0 group-hover:opacity-100"></i>
                                                    </span>
                                                </td>
                                                <td className="td-cell">{tripSheet.tripDate}</td>
                                                <td className="td-cell">{tripSheet.vehicleNumber}</td>
                                                <td className="td-cell">{tripSheet.driverName}</td>
                                                <td className="td-cell">{tripSheet.agentBrokerName}</td>
                                                <td className="td-cell">{tripSheet.tripType}</td>
                                                <td className="td-cell">{tripSheet.placeFrom}</td>
                                                <td className="last-td-cell">{tripSheet.placeTo}</td>
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

export default TripSheetList;