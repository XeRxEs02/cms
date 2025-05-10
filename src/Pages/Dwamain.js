import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  BriefcaseBusiness,
  Boxes,
  ReceiptIndianRupee,
  FolderKanban,
  Search,
  BarChart3,
  CircleDollarSign,
  Wallet,
  AlertCircle,
  Calendar,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
} from "lucide-react";

const Dwamain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("actions");
  const itemsPerPage = 10;

  // Sample data for dashboard
  const dashboardData = {
    totalDWAs: 145,
    activeDWAs: 87,
    completedDWAs: 58,
    completionRate: 40,

    todayStats: {
      newDWAs: 5,
      completedDWAs: 3,
      pendingApprovals: 8,
      activeWorkers: 42
    },

    monthlyProgress: [
      { month: "Jan", completed: 12, new: 15 },
      { month: "Feb", completed: 18, new: 14 },
      { month: "Mar", completed: 15, new: 20 },
      { month: "Apr", completed: 22, new: 18 },
      { month: "May", completed: 19, new: 16 },
      { month: "Jun", completed: 25, new: 22 },
      { month: "Jul", completed: 20, new: 18 },
      { month: "Aug", completed: 28, new: 24 },
      { month: "Sep", completed: 30, new: 26 },
      { month: "Oct", completed: 24, new: 20 },
      { month: "Nov", completed: 32, new: 28 },
      { month: "Dec", completed: 36, new: 30 }
    ],

    recentActivity: [
      { id: 1, dwa: "DWA-9584035", action: "Created", date: "2023-11-15", time: "09:30 AM" },
      { id: 2, dwa: "DWA-9584032", action: "Updated", date: "2023-11-15", time: "10:15 AM" },
      { id: 3, dwa: "DWA-9584028", action: "Completed", date: "2023-11-15", time: "11:45 AM" },
      { id: 4, dwa: "DWA-9584040", action: "Created", date: "2023-11-15", time: "01:20 PM" },
      { id: 5, dwa: "DWA-9584037", action: "Updated", date: "2023-11-15", time: "03:05 PM" }
    ]
  };

  const data = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    dwa: `DWA-95840${i + 30}`,
  }));
  const filteredData = data.filter((item) =>
    item.dwa.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    // Set the selected page number
    setCurrentPage(event.selected);

    // Scroll to top of the page for better user experience
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={BriefcaseBusiness} />
      <div className="flex-1 px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">
            DWA LISTING [{filteredData?.length}]
          </h1>
          <div className="relative">
            <input
              type="text"
              className="border rounded-full pl-10 pr-4 py-2"
              placeholder="DWA Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="border-b border-gray-300 mb-4">
          <ul className="flex">
            <li className="mr-4">
              <button
                onClick={() => setActiveTab("actions")}
                className={`inline-block py-2 px-4 ${activeTab === "actions"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-red-500"}`}
              >
                Actions
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`inline-block py-2 px-4 ${activeTab === "dashboard"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-red-500"}`}
              >
                Dashboard
              </button>
            </li>
          </ul>
        </div>

        {activeTab === "actions" ? (
          <div className="bg-white rounded-lg overflow-hidden shadow p-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">NO.</th>
                  <th className="py-2">DWA</th>
                  <th className="py-2">INDENT</th>
                  <th className="py-2">INVENTORY</th>
                  <th className="py-2">BILLING</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-gray-50 border-b" : ""}
                  >
                    <td className="py-2">
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </td>
                    <td className="py-2 text-red-500">{item.dwa}</td>
                    <td className="py-2">
                      <button className="border border-red-500 text-red-500 px-4 py-1 gap-2 rounded flex items-center">
                        <FolderKanban /> INDENT
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        className="border border-red-500 text-red-500 px-4 py-1 gap-2 rounded flex items-center"
                        onClick={() => navigate("/app/dwa/wo")}
                      >
                        <Boxes /> INVENTORY
                      </button>
                    </td>
                    <td className="py-2">
                      <button className="border border-red-500 text-red-500 px-4 py-1 gap-2 rounded flex items-center">
                        <ReceiptIndianRupee /> BILLING
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-center mt-4">
              <div className="text-sm text-gray-500 mb-2">
                Page {currentPage + 1} of {pageCount || 1}
              </div>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                forcePage={currentPage}
                containerClassName={"flex space-x-2 items-center"}
                activeClassName={"bg-red-500 text-white"}
                pageClassName={"px-3 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"}
                previousClassName={"px-3 py-1 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"}
                nextClassName={"px-3 py-1 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"}
                breakClassName={"px-3 py-1"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                pageLinkClassName={"w-full h-full flex items-center justify-center"}
                previousLinkClassName={"w-full h-full flex items-center justify-center"}
                nextLinkClassName={"w-full h-full flex items-center justify-center"}
                breakLinkClassName={"w-full h-full flex items-center justify-center"}
              />
            </div>
          </div>
        ) : (
          // Dashboard Tab Content
          <div className="bg-white rounded-lg overflow-hidden shadow p-4">
            {/* Top row of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total DWAs Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold">
                      {dashboardData.totalDWAs}
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Total DWAs</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <ClipboardList size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>

              {/* Active DWAs Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold">
                      {dashboardData.activeDWAs}
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Active DWAs</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <TrendingUp size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>

              {/* Completed DWAs Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold">
                      {dashboardData.completedDWAs}
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Completed DWAs</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <TrendingDown size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>

              {/* Completion Rate Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold text-red-500">
                      {dashboardData.completionRate}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[100px] sm:max-w-[120px]">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${dashboardData.completionRate}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium">Completion Rate</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <BarChart3 size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle row - Today's Stats */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Today's Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <ClipboardList size={20} className="text-[#7BAFD4]" />
                  </div>
                  <div>
                    <div className="text-white text-sm">New DWAs</div>
                    <div className="text-white text-xl font-bold">{dashboardData.todayStats.newDWAs}</div>
                  </div>
                </div>

                <div className="bg-[#7BAFD4] rounded-md p-4 shadow flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <TrendingDown size={20} className="text-[#7BAFD4]" />
                  </div>
                  <div>
                    <div className="text-white text-sm">Completed Today</div>
                    <div className="text-white text-xl font-bold">{dashboardData.todayStats.completedDWAs}</div>
                  </div>
                </div>

                <div className="bg-[#7BAFD4] rounded-md p-4 shadow flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <AlertCircle size={20} className="text-[#7BAFD4]" />
                  </div>
                  <div>
                    <div className="text-white text-sm">Pending Approvals</div>
                    <div className="text-white text-xl font-bold">{dashboardData.todayStats.pendingApprovals}</div>
                  </div>
                </div>

                <div className="bg-[#7BAFD4] rounded-md p-4 shadow flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <Users size={20} className="text-[#7BAFD4]" />
                  </div>
                  <div>
                    <div className="text-white text-sm">Active Workers</div>
                    <div className="text-white text-xl font-bold">{dashboardData.todayStats.activeWorkers}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row - Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Progress Chart */}
              <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                <h2 className="text-white font-medium mb-4">Monthly Progress</h2>
                <div className="h-64 flex items-end space-x-1 px-2">
                  {dashboardData.monthlyProgress.map((data, index) => {
                    // Calculate relative heights (max height is 180px)
                    const maxValue = Math.max(...dashboardData.monthlyProgress.map(d => Math.max(d.completed, d.new)));
                    const completedHeight = (data.completed / maxValue) * 180;
                    const newHeight = (data.new / maxValue) * 180;

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="flex space-x-1 w-full justify-center">
                          <div
                            className="w-3 sm:w-4 bg-red-500 rounded-t-sm"
                            style={{ height: `${completedHeight}px` }}
                          ></div>
                          <div
                            className="w-3 sm:w-4 bg-red-400 rounded-t-sm"
                            style={{ height: `${newHeight}px` }}
                          ></div>
                        </div>
                        <div className="text-[10px] sm:text-xs text-white mt-1">{data.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-4 gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-white text-xs">Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span className="text-white text-xs">New</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                <h2 className="text-white font-medium mb-4">Recent Activity</h2>
                <div className="overflow-y-auto max-h-64">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center border-b border-white/10 py-3">
                      <div className="bg-white p-2 rounded-full mr-3">
                        <Clock size={16} className="text-[#7BAFD4]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{activity.dwa}</div>
                        <div className="text-white/80 text-xs">{activity.action}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-xs">{activity.date}</div>
                        <div className="text-white/80 text-xs">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dwamain;
