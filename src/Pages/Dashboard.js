import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import {
  ChartColumnBig,
  Wallet,
  CircleDollarSign,
  BarChart3,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProject, isLoading } = useProject();

  // Redirect to projects page if no project is selected
  useEffect(() => {
    if (!isLoading && !selectedProject) {
      navigate('/app/projects');
    }
  }, [selectedProject, isLoading, navigate]);

  const [dashboardData] = useState({
    totalInstallments: { current: 2, total: 5 },
    paymentsDone: { current: 4, total: 10 },
    paymentsDonePercentage: 40,
    expectedPayments: 60,
    existingBalance: 3.63,
    budgetSpent: { current: 36700, total: 1000000 },
    balanceToBePaid: { current: 12000, total: 36700 },
    budgetSpentPercentage: 3.67,
    balanceToBePaidPercentage: 32.69,
  });

  const [monthlyData] = useState([
    { month: "Jan", paymentsReceived: 30, paymentsMade: 15 },
    { month: "Feb", paymentsReceived: 65, paymentsMade: 40 },
    { month: "Mar", paymentsReceived: 45, paymentsMade: 25 },
    { month: "Apr", paymentsReceived: 85, paymentsMade: 60 },
    { month: "May", paymentsReceived: 55, paymentsMade: 35 },
    { month: "Jun", paymentsReceived: 95, paymentsMade: 70 },
    { month: "Jul", paymentsReceived: 40, paymentsMade: 20 },
    { month: "Aug", paymentsReceived: 75, paymentsMade: 55 },
    { month: "Sep", paymentsReceived: 35, paymentsMade: 25 },
    { month: "Oct", paymentsReceived: 90, paymentsMade: 65 },
    { month: "Nov", paymentsReceived: 50, paymentsMade: 30 },
    { month: "Dec", paymentsReceived: 100, paymentsMade: 75 },
  ]);

  const [statisticsData] = useState([
    { month: "Jan", paymentsMade: 20, expectedPayments: 40 },
    { month: "Feb", paymentsMade: 45, expectedPayments: 35 },
    { month: "Mar", paymentsMade: 30, expectedPayments: 60 },
    { month: "Apr", paymentsMade: 65, expectedPayments: 50 },
    { month: "May", paymentsMade: 40, expectedPayments: 75 },
    { month: "Jun", paymentsMade: 80, expectedPayments: 65 },
    { month: "Jul", paymentsMade: 55, expectedPayments: 90 },
    { month: "Aug", paymentsMade: 95, expectedPayments: 70 },
    { month: "Sep", paymentsMade: 60, expectedPayments: 85 },
    { month: "Oct", paymentsMade: 85, expectedPayments: 55 },
    { month: "Nov", paymentsMade: 50, expectedPayments: 75 },
    { month: "Dec", paymentsMade: 70, expectedPayments: 45 },
  ]);

  const renderBarChart = () => {
    const maxValue = Math.max(
      ...monthlyData.map(data => Math.max(data.paymentsReceived, data.paymentsMade))
    );

    return (
      <div className="flex h-40 items-end justify-between space-x-0.5 sm:space-x-1 px-1 sm:px-2 overflow-x-auto">
        {monthlyData.map((data, index) => {
          const receivedHeight = `${(data.paymentsReceived / maxValue) * 100}%`;
          const madeHeight = `${(data.paymentsMade / maxValue) * 100}%`;

          return (
            <div key={index} className="flex flex-col items-center flex-shrink-0">
              <div className="flex space-x-0.5 sm:space-x-1">
                <div
                  className="w-2 sm:w-3 md:w-4 bg-red-500 rounded-t-sm"
                  style={{
                    height: receivedHeight,
                    minHeight: '8px'
                  }}
                ></div>
                <div
                  className="w-2 sm:w-3 md:w-4 bg-red-400 rounded-t-sm"
                  style={{
                    height: madeHeight,
                    minHeight: '8px'
                  }}
                ></div>
              </div>
              <div className="text-[10px] sm:text-xs text-white mt-1 font-medium">{data.month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(
      ...statisticsData.map(data => Math.max(data.paymentsMade, data.expectedPayments))
    );
    const chartHeight = 150;
    const chartWidth = 500;
    const pointsPerMonth = chartWidth / (statisticsData.length - 1);

    const paymentsMadeLine = statisticsData.map((data, index) =>
      `${index * pointsPerMonth},${chartHeight - (data.paymentsMade / maxValue) * chartHeight}`
    ).join(' ');

    const expectedPaymentsLine = statisticsData.map((data, index) =>
      `${index * pointsPerMonth},${chartHeight - (data.expectedPayments / maxValue) * chartHeight}`
    ).join(' ');

    return (
      <div className="relative h-40 mt-2 w-full overflow-x-auto">
        <div className="min-w-full">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2].map((_, index) => (
              <div key={index} className="border-t border-dashed border-white/30 w-full h-0"></div>
            ))}
          </div>

          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
            <polyline
              points={paymentsMadeLine}
              fill="none"
              stroke="#F87171" /* red-400 */
              strokeWidth="2"
            />
            <polyline
              points={expectedPaymentsLine}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  };

  const renderCircularProgress = (percentage, color = "red") => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      red: "stroke-red-500",
      pink: "stroke-red-500", // Changed from pink-300 to red-500
    };

    return (
      <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
        <circle
          className="stroke-white fill-none opacity-30"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
        />
        <circle
          className={`fill-none ${colorClasses[color]}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
    );
  };

  // Function to go back to projects page
  const handleBackToProjects = () => {
    navigate('/app/projects');
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={ChartColumnBig} />

      {/* Project header with back button */}
      {selectedProject && (
        <div className="px-6 pt-2 pb-4 flex items-center">
          <button
            onClick={handleBackToProjects}
            className="flex items-center text-[#7BAFD4] hover:text-[#5A8CAB] mr-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Projects</span>
          </button>
        </div>
      )}

      <div className="p-3 sm:p-4 md:p-6]">
        {/* Top row of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Installments Card */}
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold">
                  {dashboardData.totalInstallments.current} / {dashboardData.totalInstallments.total}
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Total Installments</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <Wallet size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>

          {/* Payments Done Card */}
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold">
                  {dashboardData.paymentsDone.current} L / {dashboardData.paymentsDone.total} L
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Payments Done</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <CircleDollarSign size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>

          {/* Payments Done % Card */}
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold text-red-500">
                  {dashboardData.paymentsDonePercentage}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[100px] sm:max-w-[120px]">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${dashboardData.paymentsDonePercentage}%` }}
                  ></div>
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-medium">Payments Done %</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <BarChart3 size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>

          {/* Expected Payments Card */}
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold text-red-500">
                  {dashboardData.expectedPayments}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[100px] sm:max-w-[120px]">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${dashboardData.expectedPayments}%` }}
                  ></div>
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-medium">Expected Payments</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <AlertCircle size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Existing Balance Chart */}
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="text-white text-sm sm:text-base font-medium mb-4">Existing Balance : {dashboardData.existingBalance} L</div>
            <div className="flex justify-center my-3">
              {renderCircularProgress(70, "pink")}
            </div>
            <div className="mt-2 text-xs sm:text-sm">
              <div className="flex items-center text-white">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Buget Spent : 36K</span>
              </div>
              <div className="flex items-center text-white mt-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full mr-2"></div>
                <span>PaymentsReceived: 4 L</span>
              </div>
            </div>
          </div>

          {/* Budget Spent Cards */}
          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
            <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
              <div className="text-white text-xs sm:text-sm mb-2">Budget Spent</div>
              <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                {dashboardData.budgetSpent.current.toLocaleString()} /{" "}
                {dashboardData.budgetSpent.total.toLocaleString()}
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData.budgetSpentPercentage, "pink")}
              </div>
            </div>
            <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
              <div className="text-white text-xs sm:text-sm mb-2">Budget Spent</div>
              <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                {dashboardData.budgetSpentPercentage}%
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData.budgetSpentPercentage, "pink")}
              </div>
            </div>
          </div>

          {/* Balance To Be Paid Cards */}
          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
            <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
              <div className="text-white text-xs sm:text-sm mb-2">Balance To Be Paid</div>
              <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                {dashboardData.balanceToBePaid.current.toLocaleString()} /{" "}
                {dashboardData.balanceToBePaid.total.toLocaleString()}
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData.balanceToBePaidPercentage, "pink")}
              </div>
            </div>
            <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
              <div className="text-white text-xs sm:text-sm mb-2">Balance To Be Paid</div>
              <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                {dashboardData.balanceToBePaidPercentage}%
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData.balanceToBePaidPercentage, "pink")}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar Chart */}
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-white text-xs sm:text-sm">Payments Received</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span className="text-white text-xs sm:text-sm">Payments Made</span>
              </div>
            </div>
            {renderBarChart()}
          </div>

          {/* Line Chart */}
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div className="text-white text-sm font-medium">Statistics</div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span className="text-white text-xs sm:text-sm">Payments Made</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-white text-xs sm:text-sm">Expected Payments</span>
                </div>
              </div>
            </div>
            {renderLineChart()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
