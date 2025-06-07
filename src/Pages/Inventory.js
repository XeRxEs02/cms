import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import ItemDetailsModal from "../Components/ItemDetailsModal";
import { useLocation } from "react-router-dom";
import {
  Boxes,
  BarChart3,
  CircleDollarSign,
  Wallet,
  AlertCircle,
  Package,
} from "lucide-react";
import { useAppContext } from '../context/AppContext';

const Inventory = () => {
  const location = useLocation();
  const { appData } = useAppContext();

  // State for active tab
  const [activeTab, setActiveTab] = useState("Material Flow");

  // State for item details modal
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  // Aggregate transactions by particulars for Recent Transactions tab
  const aggregateTransactions = (entries) => {
    const aggregated = entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();
      
      if (!acc[key]) {
        acc[key] = {
          firstTransactionId: entry.no,
          drNo: entry.drNo || '-',
          particulars: entry.particulars,
          firstDate: entry.date,
          latestDate: entry.date,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          status: 'Pending',
          transactions: []
        };
      }

      acc[key].totalAmount += entry.amount;
      acc[key].totalPaid += entry.paid;
      acc[key].totalBalance += entry.balance;
      acc[key].latestDate = entry.date;
      acc[key].transactions.push(entry);

      if (acc[key].totalBalance === 0) {
        acc[key].status = 'Paid';
      } else if (acc[key].totalPaid > 0) {
        acc[key].status = 'Partial';
      }

      return acc;
    }, {});

    return Object.values(aggregated);
  };

  const aggregatedTransactions = aggregateTransactions(appData.dailyReport.entries);
  const totalTransactions = aggregatedTransactions.length;
  const totalAmount = aggregatedTransactions.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalPaid = aggregatedTransactions.reduce((sum, item) => sum + item.totalPaid, 0);
  const totalBalance = aggregatedTransactions.reduce((sum, item) => sum + item.totalBalance, 0);

  // Helper functions for Material Flow tab
  const calculateTotalAmount = () => {
    return totalAmount;
  };

  const calculateTotalPaid = () => {
    return totalPaid;
  };

  const calculateTotalBalance = () => {
    return totalBalance;
  };

  const calculatePaymentPercentage = () => {
    const totalAmount = calculateTotalAmount();
    const totalPaid = calculateTotalPaid();
    return totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
  };

  const calculateBalancePercentage = () => {
    const totalAmount = calculateTotalAmount();
    const totalBalance = calculateTotalBalance();
    return totalAmount > 0 ? Math.round((totalBalance / totalAmount) * 100) : 0;
  };

  const getItemCounts = () => {
    const itemCounts = {};
    appData.dailyReport.entries.forEach(item => {
      if (itemCounts[item.particulars]) {
        itemCounts[item.particulars]++;
      } else {
        itemCounts[item.particulars] = 1;
      }
    });
    return itemCounts;
  };

  const getMonthlyData = () => {
    const monthlyData = {};

    appData.dailyReport.entries.forEach(item => {
      const date = new Date(item.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          amount: 0,
          paid: 0,
          balance: 0
        };
      }

      monthlyData[monthYear].amount += item.amount;
      monthlyData[monthYear].paid += item.paid;
      monthlyData[monthYear].balance += item.balance;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));
  };

  // Function to handle clicking on particulars
  const handleParticularsClick = (transaction) => {
    setSelectedItemDetails(transaction);
    setShowItemDetailsModal(true);
  };

  // Function to render circular progress
  const renderCircularProgress = (percentage, color = "red") => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      red: "stroke-red-500",
      pink: "stroke-red-500",
      blue: "stroke-[#7BAFD4]",
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

  // Function to render bar chart
  const renderBarChart = () => {
    const monthlyData = getMonthlyData();

    if (monthlyData.length === 0) {
      return <div className="text-white text-center py-10">No data available</div>;
    }

    const maxValue = Math.max(
      ...monthlyData.map(data => Math.max(data.amount, data.paid))
    );

    return (
      <div className="flex h-40 items-end justify-between space-x-0.5 sm:space-x-1 px-1 sm:px-2 overflow-x-auto">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-shrink-0">
            <div className="flex space-x-0.5 sm:space-x-1">
              <div
                className="w-2 sm:w-3 md:w-4 bg-red-500 rounded-t-sm"
                style={{
                  height: `${(data.amount / maxValue) * 100}%`,
                  minHeight: '8px'
                }}
              ></div>
              <div
                className="w-2 sm:w-3 md:w-4 bg-red-400 rounded-t-sm"
                style={{
                  height: `${(data.paid / maxValue) * 100}%`,
                  minHeight: '8px'
                }}
              ></div>
            </div>
            <div className="text-[10px] sm:text-xs text-white mt-1 font-medium">{data.month}</div>
          </div>
        ))}
      </div>
    );
  };

  // Function to group and sort transactions by particulars
  const getGroupedTransactions = () => {
    const grouped = appData.dailyReport.entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          no: entry.no,
          drNo: entry.drNo || '-',
          particulars: entry.particulars,
          date: entry.date,
          amount: entry.amount,
          paid: entry.paid,
          balance: entry.balance,
          transactions: [entry]
        };
      } else {
        // Update the aggregated values
        acc[key].amount += entry.amount;
        acc[key].paid += entry.paid;
        acc[key].balance += entry.balance;
        acc[key].transactions.push(entry);
        
        // Keep track of the latest transaction date
        const currentDate = new Date(entry.date);
        const existingDate = new Date(acc[key].date);
        if (currentDate > existingDate) {
          acc[key].date = entry.date;
          acc[key].no = entry.no; // Use the most recent transaction ID
        }
      }
      return acc;
    }, {});

    // Convert to array and sort by date (most recent first)
    return Object.values(grouped).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Package} />
      <section className="w-full px-2 sm:px-4 mx-0 sm:mx-2">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("Material Flow")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "Material Flow"
                  ? "border-[#7BAFD4] text-[#7BAFD4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Material Flow
            </button>
            <button
              onClick={() => setActiveTab("Recent Transactions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "Recent Transactions"
                  ? "border-[#7BAFD4] text-[#7BAFD4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Recent Transactions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "Material Flow" && (
          <div>
            <div className="p-3 sm:p-4 md:p-6">
              {/* Top row of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Amount Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold">
                      ₹ {calculateTotalAmount().toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Total Amount</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <Wallet size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>

              {/* Total Paid Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold">
                      ₹ {calculateTotalPaid().toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Total Paid</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <CircleDollarSign size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>

              {/* Payment Percentage Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold text-red-500">
                      {calculatePaymentPercentage()}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[120px]">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${calculatePaymentPercentage()}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium">Payment Done %</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <BarChart3 size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="mt-8 ml-2">
                    <div className="text-lg sm:text-xl font-bold text-red-500">
                      ₹ {calculateTotalBalance().toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[120px]">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${calculateBalancePercentage()}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base font-medium">Balance</div>
                  </div>
                  <div className="bg-white p-2 rounded-md mt-6 mr-2">
                    <AlertCircle size={20} className="sm:w-6 sm:h-6 text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Item Distribution Chart */}
              <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                <div className="text-white font-medium mb-4">Item Distribution</div>
                <div className="flex justify-center my-3">
                  {renderCircularProgress(calculatePaymentPercentage(), "pink")}
                </div>
                <div className="mt-2 text-sm">
                  <div className="flex items-center text-white">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Total Items: {appData.dailyReport.entries.length}</span>
                  </div>
                  <div className="flex items-center text-white mt-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span>Unique Items: {Object.keys(getItemCounts()).length}</span>
                  </div>
                </div>
              </div>

              {/* Payment Stats */}
              <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Payment Status</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {calculateTotalPaid().toLocaleString()} / {calculateTotalAmount().toLocaleString()}
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(calculatePaymentPercentage(), "pink")}
                  </div>
                </div>
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Payment Percentage</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {calculatePaymentPercentage()}%
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(calculatePaymentPercentage(), "pink")}
                  </div>
                </div>
              </div>

              {/* Balance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Balance Status</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {calculateTotalBalance().toLocaleString()} / {calculateTotalAmount().toLocaleString()}
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(calculateBalancePercentage(), "pink")}
                  </div>
                </div>
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Balance Percentage</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {calculateBalancePercentage()}%
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(calculateBalancePercentage(), "pink")}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row - Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Bar Chart */}
              <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-white text-xs sm:text-sm">Total Amount</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <span className="text-white text-xs sm:text-sm">Paid Amount</span>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {renderBarChart()}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Recent Transactions Tab */}
        {activeTab === "Recent Transactions" && (
          <div className="p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-600">Latest inventory transactions grouped by particulars</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Latest ID</th>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">DR. No.</th>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Latest Date</th>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Amount</th>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Paid</th>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance</th>
                      <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getGroupedTransactions().map((item) => (
                      <tr key={item.particulars} className="text-sm hover:bg-gray-50">
                        <td className="px-6 py-4 text-[#2C3E50]">#{item.no}</td>
                        <td className="px-6 py-4 text-[#2C3E50]">{item.drNo}</td>
                        <td className="px-6 py-4">
                          <div
                            className="flex items-center cursor-pointer hover:bg-blue-50 rounded-md p-1 transition-colors"
                            onClick={() => handleParticularsClick({
                              ...item,
                              transactions: item.transactions
                            })}
                            title="Click to view item details"
                          >
                            <div className="w-2 h-2 bg-[#7BAFD4] rounded-full mr-2"></div>
                            <span className="text-[#7BAFD4] hover:text-[#6B9FD4]">
                              {item.particulars}
                              <span className="ml-2 text-xs text-gray-500">
                                ({item.transactions.length} transactions)
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#4A5568]">{item.date}</td>
                        <td className="px-6 py-4 text-[#2C3E50]">₹{item.amount}</td>
                        <td className="px-6 py-4 text-[#2C3E50]">₹{item.paid}</td>
                        <td className="px-6 py-4 text-[#2C3E50]">₹{item.balance}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.balance === 0
                                ? 'bg-green-100 text-green-600'
                                : item.paid > 0
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {item.balance === 0 ? 'Paid' : item.paid > 0 ? 'Partial' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-semibold">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right text-[#2C3E50]">
                        Unique Items: {getGroupedTransactions().length}
                      </td>
                      <td className="px-6 py-4 text-[#2C3E50]">₹{calculateTotalAmount()}</td>
                      <td className="px-6 py-4 text-green-600">₹{calculateTotalPaid()}</td>
                      <td className="px-6 py-4 text-red-600">₹{calculateTotalBalance()}</td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Item Details Modal */}
      <ItemDetailsModal
        isOpen={showItemDetailsModal}
        onClose={() => setShowItemDetailsModal(false)}
        itemDetails={selectedItemDetails}
      />
    </>
  );
};

export default Inventory;
