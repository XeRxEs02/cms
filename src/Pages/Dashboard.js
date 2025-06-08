import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { getProjectDashboardData, getProjectInsights, getProjectTimeline } from "../services/dashboardDataService";
import {
  ChartColumnBig,
  Wallet,
  CircleDollarSign,
  BarChart3,
  AlertCircle,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Info
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { selectedProject, isLoading, selectProject } = useProject();

  // State for project-specific dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);
  const [projectInsights, setProjectInsights] = useState([]);
  const [projectTimeline, setProjectTimeline] = useState(null);

  // Load project from URL parameter if not already selected
  useEffect(() => {
    if (projectId && (!selectedProject || selectedProject.id.toString() !== projectId)) {
      // If we have a projectId in URL but no selected project, try to load it
      // In a real app, this would fetch from API. For now, we'll use mock data
      const projectsData = [
        {
          id: 1,
          name: "Residential Complex - Phase 1",
          location: "Bangalore",
          status: "Active",
          completion: 45,
          budget: "₹ 2.5 Cr",
          startDate: "15 Jan 2023",
          endDate: "30 Dec 2023",
          color: "#4CAF50"
        },
        {
          id: 2,
          name: "Commercial Tower",
          location: "Mumbai",
          status: "Active",
          completion: 30,
          budget: "₹ 5.8 Cr",
          startDate: "10 Mar 2023",
          endDate: "15 Apr 2024",
          color: "#2196F3"
        },
        {
          id: 3,
          name: "Highway Extension",
          location: "Delhi",
          status: "Active",
          completion: 10,
          budget: "₹ 12.2 Cr",
          startDate: "05 May 2023",
          endDate: "20 Jun 2024",
          color: "#FFC107"
        },
        {
          id: 4,
          name: "Hospital Building",
          location: "Chennai",
          status: "Completed",
          completion: 100,
          budget: "₹ 3.7 Cr",
          startDate: "12 Dec 2022",
          endDate: "25 Nov 2023",
          color: "#9C27B0"
        },
        {
          id: 5,
          name: "Shopping Mall",
          location: "Hyderabad",
          status: "Active",
          completion: 60,
          budget: "₹ 8.1 Cr",
          startDate: "08 Feb 2023",
          endDate: "30 Mar 2024",
          color: "#FF5722"
        },
        {
          id: 6,
          name: "IT Park",
          location: "Pune",
          status: "Active",
          completion: 5,
          budget: "₹ 15.5 Cr",
          startDate: "20 Jun 2023",
          endDate: "15 Aug 2024",
          color: "#607D8B"
        }
      ];

      const project = projectsData.find(p => p.id.toString() === projectId);
      if (project) {
        selectProject(project);
      } else {
        // Project not found, redirect to projects page
        navigate('/app/projects');
      }
    } else if (!isLoading && !selectedProject && !projectId) {
      // No project selected and no projectId in URL, redirect to projects page
      navigate('/app/projects');
    }
  }, [projectId, selectedProject, isLoading, navigate, selectProject]);

  // Load project-specific data when project changes
  useEffect(() => {
    if (selectedProject) {
      const projectData = getProjectDashboardData(selectedProject);
      setDashboardData(projectData.dashboardData);
      setMonthlyData(projectData.monthlyData);
      setStatisticsData(projectData.statisticsData);

      const insights = getProjectInsights(selectedProject);
      setProjectInsights(insights);

      const timeline = getProjectTimeline(selectedProject);
      setProjectTimeline(timeline);
    }
  }, [selectedProject]);

  const renderBarChart = () => {
    if (!monthlyData || monthlyData.length === 0) {
      return <div className="flex items-center justify-center h-40 text-white">No data available</div>;
    }

    const maxValue = Math.max(
      ...monthlyData.map(data => Math.max(data.paymentsReceived || 0, data.paymentsMade || 0))
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
    if (!statisticsData || statisticsData.length === 0) {
      return <div className="flex items-center justify-center h-40 text-white">No data available</div>;
    }

    const maxValue = Math.max(
      ...statisticsData.map(data => Math.max(data.paymentsMade || 0, data.expectedPayments || 0))
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

  // Show loading state while data is being prepared
  if (!selectedProject || !dashboardData) {
    return (
      <>
        <Navbar currentPath={location.pathname} icon={ChartColumnBig} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BAFD4] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar currentPath={location.pathname} icon={ChartColumnBig} />

      {/* Enhanced Project header with timeline and insights */}
      {selectedProject && (
        <div className="pl-0 pr-4 pt-2 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackToProjects}
              className="flex items-center text-[#7BAFD4] hover:text-[#5A8CAB]"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to Projects</span>
            </button>
          </div>

          {/* Project Info Card */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-gray-800">{selectedProject.name}</h2>
                <p className="text-gray-600">{selectedProject.location}</p>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProject.status === 'Active' ? 'bg-green-100 text-green-800' :
                    selectedProject.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedProject.status}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    Budget: {selectedProject.budget}
                  </span>
                </div>
              </div>

              {/* Timeline Info */}
              {projectTimeline && (
                <div className="flex flex-col md:flex-row gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-[#7BAFD4]" />
                    <span>{projectTimeline.daysRemaining} days remaining</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp size={16} className="mr-2 text-[#7BAFD4]" />
                    <span>{selectedProject.completion}% complete</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Project Progress</span>
                <span>{selectedProject.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#7BAFD4] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedProject.completion}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Project Insights */}
          {projectInsights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {projectInsights.map((insight, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  insight.type === 'success' ? 'bg-green-50 border-green-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start">
                    <Info size={16} className={`mr-2 mt-0.5 ${
                      insight.type === 'warning' ? 'text-yellow-600' :
                      insight.type === 'success' ? 'text-green-600' :
                      'text-blue-600'
                    }`} />
                    <p className="text-sm text-gray-700">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="pl-0 pr-4">
        {/* Top row of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Total Installments Card */}
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold">
                  {dashboardData?.totalInstallments?.current || 0} / {dashboardData?.totalInstallments?.total || 0}
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
                  {dashboardData?.paymentsDone?.current || 0} L / {dashboardData?.paymentsDone?.total || 0} L
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
                  {dashboardData?.paymentsDonePercentage || 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[100px] sm:max-w-[120px]">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${dashboardData?.paymentsDonePercentage || 0}%` }}
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
                  {dashboardData?.expectedPayments || 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[100px] sm:max-w-[120px]">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${dashboardData?.expectedPayments || 0}%` }}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Existing Balance Chart */}
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="text-white text-sm sm:text-base font-medium mb-4">Existing Balance : {dashboardData?.existingBalance || 0} L</div>
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
                {(dashboardData?.budgetSpent?.current || 0).toLocaleString()} /{" "}
                {(dashboardData?.budgetSpent?.total || 0).toLocaleString()}
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData?.budgetSpentPercentage || 0, "pink")}
              </div>
            </div>
            <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
              <div className="text-white text-xs sm:text-sm mb-2">Budget Spent</div>
              <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                {dashboardData?.budgetSpentPercentage || 0}%
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData?.budgetSpentPercentage || 0, "pink")}
              </div>
            </div>
          </div>

          {/* Balance To Be Paid Cards */}
          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
            <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
              <div className="text-white text-xs sm:text-sm mb-2">Balance To Be Paid</div>
              <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                {(dashboardData?.balanceToBePaid?.current || 0).toLocaleString()} /{" "}
                {(dashboardData?.balanceToBePaid?.total || 0).toLocaleString()}
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData?.balanceToBePaidPercentage || 0, "pink")}
              </div>
            </div>
            <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
              <div className="text-white text-xs sm:text-sm mb-2">Balance To Be Paid</div>
              <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                {dashboardData?.balanceToBePaidPercentage || 0}%
              </div>
              <div className="flex justify-center my-2">
                {renderCircularProgress(dashboardData?.balanceToBePaidPercentage || 0, "pink")}
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
