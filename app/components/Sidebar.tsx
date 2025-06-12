'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation';  

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const [tripMenuOpen, setTripMenuOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Auto-expand menus based on current path
  useEffect(() => {
    if (pathname.includes('/modules/vehicle') || pathname.includes('/modules/employee') || pathname.includes('/modules/options')) {
      setMasterMenuOpen(true)
    }
    if (pathname.includes('/modules/trip-sheet') || pathname.includes('/modules/expense') ) {
      setTripMenuOpen(true)
    }
  }, [pathname])

  const handleMasterMenuClick = () => {
    setMasterMenuOpen(!masterMenuOpen)
  }

  const handleTripMenuClick = () => {
    setTripMenuOpen(!tripMenuOpen)
  }

  // Check if a path is active
  const isActive = (path: string) => {
    return pathname === path
  }

  // Check if a menu section is active
  const isSectionActive = (paths: string[]) => {
    return paths.some(path => pathname.includes(path))
  }

  // Desktop Sidebar (wider)
  if (!isMobile) {
    return (
      <div className="w-[200px] bg-[#212934] shadow-md relative h-full">
        <div className="px-0 pt-2 pb-0 flex justify-center">
        <Image
        src="/images/logo.png" // Path relative to the public directory
        alt="InfoGreen Logo"
        width={100} // Specify the intrinsic width of the image in pixels
        height={40} // Specify the intrinsic height of the image in pixels
      />

        </div>

        <nav className="py-0">
          <ul>
            <li
              className={`px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                masterMenuOpen || isSectionActive(['/modules/vehicle', '/modules/employee','/modules/options']) 
                  ? 'text-white ' 
                  : 'text-[#b0b3b7]'
              }`}
              onClick={handleMasterMenuClick}
            >
              <div className="flex items-center">
                <i className={`ri-dashboard-line mr-3 text-lg ${
                  masterMenuOpen || isSectionActive(['/modules/vehicle', '/modules/employee','/modules/options']) ? 'text-white' : ''
                }`}></i>
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
                <li
                  className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                    isActive('/modules/vehicle/list') || isActive('/modules/vehicle/new') 
                      ? 'bg-[#191f26] border-[#1aed59] text-white ' 
                      : 'text-[#b0b3b7] border-l-transparent '
                  }`}
                >
                  <span 
                    onClick={() => router.push('/modules/vehicle/list')}
                    className={`${isActive('/modules/vehicle/list') ? 'text-white' : ''}`}
                  >
                    Vehicle
                  </span>
                  <i 
                    onClick={() => router.push('/modules/vehicle/new')} 
                    className={`ri-add-fill text-lg ${isActive('/modules/vehicle/new') ? 'text-white' : ''}`}
                  ></i>
                </li>

                <li
                  className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                    isActive('/modules/employee/list') || isActive('/modules/employee/new') 
                      ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                      : 'text-[#b0b3b7] border-l-transparent'
                  }`}
                >
                  <span 
                    onClick={() => router.push('/modules/employee/list')}
                    className={`${isActive('/modules/employee/list') ? 'text-white' : ''}`}
                  >
                    Employee
                  </span>
                  <i 
                    onClick={() => router.push('/modules/employee/new')} 
                    className={`ri-add-fill text-lg ${isActive('/modules/employee/new') ? 'text-white' : ''}`}
                  ></i>
                </li>

                <li
                  className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                    isActive('/modules/options')
                      ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                      : 'text-[#b0b3b7] border-l-transparent'
                  }`}
                >
                  <span 
                    onClick={() => router.push('/modules/options')}
                    className={`${isActive('/modules/options') ? 'text-white' : ''}`}
                  >
                    Options
                  </span>
                </li>
              </ul>
            )}

            <li
              className={`px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                tripMenuOpen || isSectionActive(['/modules/trip-sheet', '/modules/expense']) 
                  ? 'text-white' 
                  : 'text-[#b0b3b7]'
              }`}
              onClick={handleTripMenuClick}
            >
              <div className="flex items-center">
                <i className={`ri-bus-2-line mr-3 text-lg ${
                  tripMenuOpen || isSectionActive(['/modules/trip-sheet', '/modules/expense']) ? 'text-white' : ''
                }`}></i>
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
                <li className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                  isActive('/modules/trip-sheet/list') || isActive('/modules/trip-sheet/new') 
                    ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                    : 'text-[#b0b3b7] border-l-transparent'
                }`}>
                  <span 
                    onClick={() => router.push('/modules/trip-sheet/list')}
                    className={`${isActive('/modules/trip-sheet/list') ? 'text-white' : ''}`}
                  >
                    Trip Sheet
                  </span>
                  <i 
                    onClick={() => router.push('/modules/trip-sheet/new')} 
                    className={`ri-add-fill text-lg ${isActive('/modules/trip-sheet/new') ? 'text-white' : ''}`}
                  ></i>
                </li>
                <li className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                  isActive('/modules/expense/list') || isActive('/modules/expense/new') 
                    ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                    : 'text-[#b0b3b7] border-l-transparent'
                }`}>
                  <span 
                    onClick={() => router.push('/modules/expense/list')}
                    className={`${isActive('/modules/expense/list') ? 'text-white' : ''}`}
                  >
                    Expense
                  </span>
                  <i 
                    onClick={() => router.push('/modules/expense/new')} 
                    className={`ri-add-fill text-lg ${isActive('/modules/expense/new') ? 'text-white' : ''}`}
                  ></i>
                </li>
              </ul>
            )}

            <li
              onClick={() => router.push('/modules/report/new')}
              className={`px-4 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                isActive('/modules/report/new') 
                  ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                  : 'text-[#b0b3b7] border-l-transparent'
              }`}
            >
              <div className="flex items-center">
                <i className={`ri-file-chart-line mr-3 text-lg ${
                  isActive('/modules/report/new') ? 'text-white' : ''
                }`}></i>
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
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isSectionActive(['/modules/vehicle', '/modules/employee','/modules/options']) 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7]  border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('master')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-dashboard-line text-lg ${
                isSectionActive(['/modules/vehicle', '/modules/employee','/modules/options']) ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'master' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white">
                <ul>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/vehicle/new') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/vehicle/new')}
                  >
                    <i className="ri-add-line text-[16px]"></i> New Vehicle
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/vehicle/list') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'  
                    }`}
                    onClick={() => router.push('/modules/vehicle/list')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Vehicle List
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/employee/new') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/employee/new')}
                  >
                    <i className="ri-add-line text-[16px]"></i> New Employee
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/employee/list') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/employee/list')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Employee List
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/options') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/options')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Options
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isSectionActive(['/modules/trip-sheet', '/modules/expense']) 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7] border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('tripSheet')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-bus-2-line text-lg ${
                isSectionActive(['/modules/trip-sheet', '/modules/expense']) ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'tripSheet' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/trip-sheet/new') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/trip-sheet/new')}
                  >
                    <i className="ri-add-line text-[16px]"></i> New Trip Sheet
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/trip-sheet/list') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/trip-sheet/list')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Trip Sheet List
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/expense/new') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/expense/new')}
                  >
                    <i className="ri-add-line text-[16px]"></i> New Trip Expense
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/expense/list') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/expense/list')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Trip Expense List
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isActive('/modules/report/new') 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7] border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('report')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-file-chart-line text-lg ${
                isActive('/modules/report/new') ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'report' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/modules/report/new') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff] ' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/modules/report/new')}
                  >
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