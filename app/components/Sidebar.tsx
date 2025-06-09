'use client'

import { useState, useEffect } from 'react'

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const [tripMenuOpen, setTripMenuOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleMasterMenuClick = () => {
    setMasterMenuOpen(!masterMenuOpen)
  }

  const handleTripMenuClick = () => {
    setTripMenuOpen(!tripMenuOpen)
  }

  // Desktop Sidebar (wider)
  if (!isMobile) {
    return (
      <div className="w-[200px] bg-[#212934] shadow-md relative h-full">
        <div className="px-0 pt-2 pb-0 flex justify-center">
          <img src="/images/logo.png" alt="InfoGreen Logo" className="h-10" />
        </div>

        <nav className="py-0">
          <ul>
            <li
              className={`px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7] ${
                masterMenuOpen ? 'bg-[#191f26] border-l-[#1aed59]' : ''
              }`}
              onClick={handleMasterMenuClick}
            >
              <div className="flex items-center">
                <i className="ri-dashboard-line mr-3 text-lg"></i>
                <span>Master</span>
              </div>
              <i
                className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${
                  masterMenuOpen ? 'rotate-180' : ''
                }`}
              ></i>
            </li>

            {masterMenuOpen && (
              <ul className="text-[#b0b3b7]">
                <li className="py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]">
                  <span onClick={() => window.location.href = '/modules/vehicle/list'}>Vehicle</span>
                  <i onClick={() => window.location.href = '/modules/vehicle/new'} className="ri-add-fill text-lg"></i>
                </li>
                <li className="py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]">
                  <span onClick={() => window.location.href = '/modules/employee/list'}>Employee</span>
                  <i onClick={() => window.location.href = '/modules/employee/new'} className="ri-add-fill text-lg"></i>
                </li>
              </ul>
            )}

            <li
              className={`px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7] ${
                tripMenuOpen ? 'bg-[#191f26] border-l-[#1aed59]' : ''
              }`}
              onClick={handleTripMenuClick}
            >
              <div className="flex items-center">
                <i className="ri-bus-2-line mr-3 text-lg"></i>
                <span>Trip</span>
              </div>
              <i
                className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${
                  tripMenuOpen ? 'rotate-180' : ''
                }`}
              ></i>
            </li>

            {tripMenuOpen && (
              <ul className="text-[#b0b3b7]">
                <li className="py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]">
                  <span onClick={() => window.location.href = '/modules/trip-sheet/list'}>Trip Sheet</span>
                  <i onClick={() => window.location.href = '/modules/trip-sheet/new'} className="ri-add-fill text-lg"></i>
                </li>
                <li className="py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]">
                  <span onClick={() => window.location.href = '/modules/expense/list'}>Expense</span>
                  <i onClick={() => window.location.href = '/modules/expense/new'} className="ri-add-fill text-lg"></i>
                </li>
              </ul>
            )}

            <li
              onClick={() => window.location.href = '/modules/report/new'}
              className="px-4 py-2 border-l-5 border-l-transparent hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]"
            >
              <div className="flex items-center">
                <i className="ri-file-chart-line mr-3 text-lg"></i>
                <span>Report</span>
              </div>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center">
          <div className="mr-2">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <img src="/images/profile-pic.png" alt="User Image" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-[#b0b3b7]">
            <div className="font-semibold">Emily Clark</div>
            <div className="text-xs">Admin</div>
          </div>
          <div className="ml-auto">
            <i className="ri-expand-up-down-fill text-[#b0b3b7] text-lg cursor-pointer"></i>
          </div>
        </div>
      </div>
    )
  }

  // Tablet/Mobile Sidebar (compact)
  return (
    <div className="w-[60px] bg-[#212934] shadow-md relative h-full">
      <div className="px-0 py-1.5 flex justify-center">
        <img src="/images/tab-logo.png" alt="InfoGreen Logo" className="h-9" />
      </div>

      <nav className="py-0">
        <ul>
          <li
            className="relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]"
            onMouseEnter={() => setHoveredMenu('master')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className="ri-dashboard-line text-lg"></i>
            </div>

            {hoveredMenu === 'master' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white">
                <ul>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-add-line text-[16px]"></i> New Vehicle
                  </li>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-list-unordered text-[16px]"></i> Vehicle List
                  </li>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-add-line text-[16px]"></i> New Employee
                  </li>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-list-unordered text-[16px]"></i> Employee List
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li
            className="relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]"
            onMouseEnter={() => setHoveredMenu('tripSheet')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className="ri-bus-2-line text-lg"></i>
            </div>

            {hoveredMenu === 'tripSheet' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-add-line text-[16px]"></i> New Trip Sheet
                  </li>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-list-unordered text-[16px]"></i> Trip Sheet List
                  </li>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-add-line text-[16px]"></i> New Trip Expense
                  </li>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-list-unordered text-[16px]"></i> Trip Expense List
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li
            className="relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer text-[#b0b3b7]"
            onMouseEnter={() => setHoveredMenu('report')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className="ri-file-chart-line text-lg"></i>
            </div>

            {hoveredMenu === 'report' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li className="px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4 border-l-transparent hover:border-[#1aed59] cursor-pointer gap-2">
                    <i className="ri-list-unordered text-[16px]"></i> Report
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center">
        <div className="mr-2">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
            <img src="/images/profile-pic.png" alt="User Image" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
} 