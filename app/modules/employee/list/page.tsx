"use client";

import { useState } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";

// Define tab key types
type TabKey = "all" | "staff" | "driver";

const EmployeeList = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const tabs = [
        { key: "all", label: "All List" },
        { key: "staff", label: "Staffs" },
        { key: "driver", label: "Drivers" },
    ];

    const counts: Record<TabKey, number> = {
        all: 40,
        staff: 22,
        driver: 18,
    };

    const router = useRouter();

    const employees = [
        { id: 1, name: "Sarika Prasad", phoneNumber: "7010781802", whatsappNumber: "7010781802", aadharNumber: "612847162315", panNumber: "MYDNK8773L", licenseNumber: "KA1498855896", truckNumber: "DL83DC8480", licenseExpiryDate: "24/08/2026", type: "staff" },
        { id: 2, name: "Manikanta Dutta", phoneNumber: "8443136942", whatsappNumber: "8443136942", aadharNumber: "938210995967", panNumber: "EESCH3778K", licenseNumber: "MH1207122905", truckNumber: "MH25PR1234", licenseExpiryDate: "28/01/2027", type: "driver" },
        { id: 3, name: "Rahul Bhat", phoneNumber: "9922951297", whatsappNumber: "9922951297", aadharNumber: "244930269666", panNumber: "CEWKL1843H", licenseNumber: "TN1611835772", truckNumber: "KA81RY8770", licenseExpiryDate: "12/09/2025", type: "staff" },
        { id: 4, name: "Preeti Shetty", phoneNumber: "9940829310", whatsappNumber: "9940829310", aadharNumber: "347088741844", panNumber: "AOQTR1653H", licenseNumber: "DL3533158535", truckNumber: "MH93MU8596", licenseExpiryDate: "27/07/2027", type: "staff" },
        { id: 5, name: "Nakul Singh", phoneNumber: "9472666746", whatsappNumber: "9472666746", aadharNumber: "881798949356", panNumber: "ENZBN1124J", licenseNumber: "TN2612786147", truckNumber: "KA36BC5677", licenseExpiryDate: "02/01/2027", type: "driver" },
        { id: 6, name: "Jyotsna Deshmukh", phoneNumber: "8247365201", whatsappNumber: "8247365201", aadharNumber: "818334050340", panNumber: "SHOHB1375W", licenseNumber: "KL3636942733", truckNumber: "MH36ZD7478", licenseExpiryDate: "09/07/2027", type: "staff" },
        { id: 7, name: "Rishabh Yadav", phoneNumber: "8743815309", whatsappNumber: "8743815309", aadharNumber: "662540239645", panNumber: "OZQGU7773V", licenseNumber: "DL7421293765", truckNumber: "TN12KV7696", licenseExpiryDate: "22/06/2027", type: "driver" },
        { id: 8, name: "Priya Krishnan", phoneNumber: "9839866235", whatsappNumber: "9839866235", aadharNumber: "326405600973", panNumber: "HINRF7929R", licenseNumber: "KA8945580670", truckNumber: "MH40YX1555", licenseExpiryDate: "11/11/2025", type: "staff" },
        { id: 9, name: "Yogendra Tiwari", phoneNumber: "7027209524", whatsappNumber: "7027209524", aadharNumber: "709552912063", panNumber: "TGKKY2029S", licenseNumber: "MH5362969873", truckNumber: "TN58OV4175", licenseExpiryDate: "23/07/2025", type: "staff" },
        { id: 10, name: "Divya Menon", phoneNumber: "8756432109", whatsappNumber: "8756432109", aadharNumber: "223344556677", panNumber: "HJKLM2345I", licenseNumber: "KL5566778899", truckNumber: "KL11OP4567", licenseExpiryDate: "07/07/2025", type: "staff" },
        { id: 11, name: "Shravan Das", phoneNumber: "9473632087", whatsappNumber: "9473632087", aadharNumber: "833424460305", panNumber: "NCSRR4162I", licenseNumber: "MH7602647138", truckNumber: "MH33ZL1130", licenseExpiryDate: "13/05/2026", type: "driver" },
        { id: 12, name: "Varsha Iyer", phoneNumber: "9812342673", whatsappNumber: "9812342673", aadharNumber: "655640582305", panNumber: "EQPZY1174Z", licenseNumber: "DL7445472851", truckNumber: "DL40AJ1582", licenseExpiryDate: "27/12/2027", type: "staff" },
        { id: 13, name: "Ganesh Nair", phoneNumber: "9042938110", whatsappNumber: "9042938110", aadharNumber: "206017441752", panNumber: "LRFZQ6729S", licenseNumber: "KA5207650289", truckNumber: "KL58DF4289", licenseExpiryDate: "19/02/2026", type: "driver" },
        { id: 14, name: "Meenal Rathi", phoneNumber: "7654382941", whatsappNumber: "7654382941", aadharNumber: "483489498952", panNumber: "HCTUZ1631Z", licenseNumber: "TN1224238229", truckNumber: "KA69GI9622", licenseExpiryDate: "13/08/2026", type: "staff" },
        { id: 15, name: "Ramesh Kumar", phoneNumber: "8734963834", whatsappNumber: "8734963834", aadharNumber: "248764171151", panNumber: "QXTYJ6372F", licenseNumber: "KL4868236593", truckNumber: "DL45QP4682", licenseExpiryDate: "01/10/2026", type: "driver" },
        { id: 16, name: "Neha Dube", phoneNumber: "9762517298", whatsappNumber: "9762517298", aadharNumber: "684725611729", panNumber: "MFQZY2375A", licenseNumber: "MH9494962444", truckNumber: "MH16EB7607", licenseExpiryDate: "28/09/2027", type: "staff" },
        { id: 17, name: "Amit Sengupta", phoneNumber: "8264501923", whatsappNumber: "8264501923", aadharNumber: "421468743290", panNumber: "WEMHP6636T", licenseNumber: "DL4632434732", truckNumber: "TN59SX3282", licenseExpiryDate: "07/05/2027", type: "staff" },
        { id: 18, name: "Kavitha Balaji", phoneNumber: "8943810436", whatsappNumber: "8943810436", aadharNumber: "639981078981", panNumber: "CJQED4478B", licenseNumber: "KA4572167021", truckNumber: "KL43GA1889", licenseExpiryDate: "18/02/2026", type: "driver" },
        { id: 19, name: "Harish Reddy", phoneNumber: "8542019482", whatsappNumber: "8542019482", aadharNumber: "926752075127", panNumber: "PNKBJ6946D", licenseNumber: "TN9190772041", truckNumber: "DL96NT4116", licenseExpiryDate: "26/08/2026", type: "driver" },
        { id: 20, name: "Anjali Verma", phoneNumber: "9827102389", whatsappNumber: "9827102389", aadharNumber: "429058144519", panNumber: "XKZYA3129J", licenseNumber: "KL3869796635", truckNumber: "MH32JO7998", licenseExpiryDate: "15/01/2027", type: "staff" },
        { id: 21, name: "Deepak Chaudhary", phoneNumber: "9345178290", whatsappNumber: "9345178290", aadharNumber: "112244668899", panNumber: "QWERP1234Z", licenseNumber: "KA2233445566", truckNumber: "KA03AB1234", licenseExpiryDate: "14/09/2026", type: "driver" },
        { id: 22, name: "Sneha Kapoor", phoneNumber: "9827364550", whatsappNumber: "9827364550", aadharNumber: "334455667788", panNumber: "TYUIO5678A", licenseNumber: "DL4455667788", truckNumber: "DL09CD5678", licenseExpiryDate: "21/02/2026", type: "staff" },
        { id: 23, name: "Vikram Singh", phoneNumber: "8937261450", whatsappNumber: "8937261450", aadharNumber: "556677889900", panNumber: "PLMOK9876R", licenseNumber: "MH6677889900", truckNumber: "MH10EF6789", licenseExpiryDate: "03/04/2027", type: "driver" },
        { id: 24, name: "Anusha Rao", phoneNumber: "7890456123", whatsappNumber: "7890456123", aadharNumber: "667788990011", panNumber: "ZXCAS1234Q", licenseNumber: "TN7788990011", truckNumber: "TN20GH1234", licenseExpiryDate: "18/06/2025", type: "staff" },
        { id: 25, name: "Arjun Mehta", phoneNumber: "9081726354", whatsappNumber: "9081726354", aadharNumber: "778899001122", panNumber: "VBNML4567K", licenseNumber: "KL8899001122", truckNumber: "KL33IJ4567", licenseExpiryDate: "10/03/2026", type: "driver" },
        { id: 26, name: "Pooja Sinha", phoneNumber: "8123456790", whatsappNumber: "8123456790", aadharNumber: "889900112233", panNumber: "QAZWS9876D", licenseNumber: "KA9900112233", truckNumber: "KA05KL7890", licenseExpiryDate: "29/11/2026", type: "staff" },
        { id: 27, name: "Naveen Reddy", phoneNumber: "7894561230", whatsappNumber: "7894561230", aadharNumber: "990011223344", panNumber: "EDCRF3456V", licenseNumber: "AP1122334455", truckNumber: "AP11MN1234", licenseExpiryDate: "04/08/2025", type: "driver" },
        { id: 28, name: "Shweta Joshi", phoneNumber: "9012345678", whatsappNumber: "9012345678", aadharNumber: "101112131415", panNumber: "JHGYU2345T", licenseNumber: "HR3344556677", truckNumber: "HR26OP5678", licenseExpiryDate: "17/07/2027", type: "staff" },
        { id: 29, name: "Karan Thakur", phoneNumber: "8321456098", whatsappNumber: "8321456098", aadharNumber: "121314151617", panNumber: "RFVGT6543Y", licenseNumber: "PB5566778899", truckNumber: "PB65QR1234", licenseExpiryDate: "23/01/2026", type: "driver" },
        { id: 30, name: "Neetu Sharma", phoneNumber: "9780234561", whatsappNumber: "9780234561", aadharNumber: "131415161718", panNumber: "TGBNH4567U", licenseNumber: "RJ6677889900", truckNumber: "RJ14ST4567", licenseExpiryDate: "13/12/2026", type: "staff" },
        { id: 31, name: "Pradeep Kaur", phoneNumber: "8976543210", whatsappNumber: "8976543210", aadharNumber: "141516171819", panNumber: "YHNJU8765L", licenseNumber: "CH7788990011", truckNumber: "CH01UV1234", licenseExpiryDate: "09/09/2027", type: "staff" },
        { id: 32, name: "Ajay Dev", phoneNumber: "8887654321", whatsappNumber: "8887654321", aadharNumber: "151617181920", panNumber: "UJMKI2345N", licenseNumber: "UP8899001122", truckNumber: "UP32WX4567", licenseExpiryDate: "25/10/2026", type: "driver" },
        { id: 33, name: "Sonali Mishra", phoneNumber: "9890123456", whatsappNumber: "9890123456", aadharNumber: "161718192021", panNumber: "ZXSWE3456M", licenseNumber: "MP9900112233", truckNumber: "MP09YZ7890", licenseExpiryDate: "06/06/2026", type: "staff" },
        { id: 34, name: "Harsh Vardhan", phoneNumber: "8112233445", whatsappNumber: "8112233445", aadharNumber: "171819202122", panNumber: "BNMVC9876P", licenseNumber: "GJ1122334455", truckNumber: "GJ01AB5678", licenseExpiryDate: "01/01/2027", type: "driver" },
        { id: 35, name: "Ritika Jain", phoneNumber: "8765432190", whatsappNumber: "8765432190", aadharNumber: "181920212223", panNumber: "LKJHG5432D", licenseNumber: "OD3344556677", truckNumber: "OD33CD7890", licenseExpiryDate: "12/04/2027", type: "staff" },
        { id: 36, name: "Siddharth Chauhan", phoneNumber: "9304856721", whatsappNumber: "9304856721", aadharNumber: "192021222324", panNumber: "POLKM7654H", licenseNumber: "JK4455667788", truckNumber: "JK08EF1234", licenseExpiryDate: "07/03/2026", type: "driver" },
        { id: 37, name: "Lakshmi V", phoneNumber: "9902345611", whatsappNumber: "9902345611", aadharNumber: "202122232425", panNumber: "MKLPO3456E", licenseNumber: "TS5566778899", truckNumber: "TS09GH4567", licenseExpiryDate: "16/06/2027", type: "staff" },
        { id: 38, name: "Gaurav Meena", phoneNumber: "8723650987", whatsappNumber: "8723650987", aadharNumber: "212223242526", panNumber: "HJKLO1234W", licenseNumber: "BR6677889900", truckNumber: "BR01IJ1234", licenseExpiryDate: "05/11/2026", type: "driver" },
        { id: 39, name: "Rekha Patel", phoneNumber: "9192837465", whatsappNumber: "9192837465", aadharNumber: "222324252627", panNumber: "QWERU8765T", licenseNumber: "CG7788990011", truckNumber: "CG04KL4567", licenseExpiryDate: "30/08/2026", type: "staff" },
        { id: 40, name: "Mohit Aggarwal", phoneNumber: "9876543012", whatsappNumber: "9876543012", aadharNumber: "232425262728", panNumber: "ZXCVB5432E", licenseNumber: "GA8899001122", truckNumber: "GA08MN7890", licenseExpiryDate: "22/07/2026", type: "driver" }
    ];

    const filteredEmployees = activeTab === "all" ? employees : employees.filter((e) => e.type === activeTab);

    return (
        <Layout pageTitle="Employee List">
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
                                    Import Employees
                                </button>
                                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                                    <i className="ri-arrow-down-s-line"></i>
                                </button>
                            </div>

                            <button className="btn-sm btn-primary ml-2 text-sm" onClick={() => router.push('/modules/employee/new')}>
                                <i className="ri-add-fill mr-1"></i>
                                <span className="text-sm">Add Employee</span>
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
                            <input className="form-control !h-[31px]" type="text" placeholder="Enter Employee Name" />
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
                                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">Employee Name</label>
                                    <input type="text" placeholder="Enter employee name" className="form-control" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">Phone Number</label>
                                    <input type="text" placeholder="Enter phone number" className="form-control" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#000000] mb-1.5">Aadhar Number</label>
                                    <input type="text" placeholder="Enter aadhar number" className="form-control" />
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
                                                    <span>Employee Name</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Phone Number</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Whatsapp Number</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Aadhar Number</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>PAN Number</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>License Number</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Truck Number</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Employee Type</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>

                                            <th className="last-th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>License Expiry Date</span>
                                                    <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees.map((employee, index) => (
                                            <tr key={employee.id} className="group hover:bg-[#f5f7f9] text-sm cursor-pointer">
                                                <td className="td-cell">
                                                    <input type="checkbox" className="form-check" />
                                                </td>
                                                <td className="td-cell">
                                                    <span className="float-left">{index + 1}</span>
                                                    <span className="float-right cursor-pointer">
                                                        <i className="p-1 rounded border border-[#cfd7df] text-[#4d5e6c] ri-pencil-fill opacity-0 group-hover:opacity-100"></i>
                                                    </span>
                                                </td>
                                                <td className="td-cell">{employee.name}</td>
                                                <td className="td-cell">{employee.phoneNumber}</td>
                                                <td className="td-cell">{employee.whatsappNumber}</td>
                                                <td className="td-cell">{employee.aadharNumber}</td>
                                                <td className="td-cell">{employee.panNumber}</td>
                                                <td className="td-cell">{employee.licenseNumber}</td>
                                                <td className="td-cell">{employee.truckNumber}</td>
                                                <td className="td-cell">{employee.type}</td>
                                                <td className="last-td-cell">{employee.licenseExpiryDate}</td>
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

export default EmployeeList;