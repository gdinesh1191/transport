'use client'

import Layout from "./components/Layout"

export default function Home() {
  return (
    <Layout pageTitle="Dashboard">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Transport Management</h2>
          <p className="text-gray-600 mb-4">
            Manage your fleet, track trips, handle expenses, and generate reports all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Vehicles</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <i className="ri-truck-line text-4xl text-blue-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Trips</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <i className="ri-bus-2-line text-4xl text-green-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Employees</p>
                <p className="text-3xl font-bold">36</p>
              </div>
              <i className="ri-team-line text-4xl text-purple-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">This Month Expenses</p>
                <p className="text-3xl font-bold">₹45K</p>
              </div>
              <i className="ri-money-dollar-circle-line text-4xl text-orange-200"></i>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Trip Sheets</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-800">Delhi to Mumbai</p>
                  <p className="text-sm text-gray-600">Vehicle: MH-01-AB-1234</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-800">Pune to Bangalore</p>
                  <p className="text-sm text-gray-600">Vehicle: KA-02-CD-5678</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => window.location.href = '/modules/vehicle/new'}
                className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <i className="ri-truck-line text-2xl text-blue-600 mb-2 block"></i>
                <p className="font-medium text-gray-800">Add Vehicle</p>
              </button>
              <button 
                onClick={() => window.location.href = '/modules/trip-sheet/new'}
                className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <i className="ri-file-add-line text-2xl text-green-600 mb-2 block"></i>
                <p className="font-medium text-gray-800">New Trip</p>
              </button>
              <button 
                onClick={() => window.location.href = '/modules/employee/new'}
                className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <i className="ri-user-add-line text-2xl text-purple-600 mb-2 block"></i>
                <p className="font-medium text-gray-800">Add Employee</p>
              </button>
              <button 
                onClick={() => window.location.href = '/modules/report/new'}
                className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <i className="ri-file-chart-line text-2xl text-orange-600 mb-2 block"></i>
                <p className="font-medium text-gray-800">View Reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
 