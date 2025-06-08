import React, { useState, useMemo } from "react";
import Navbar from "../Components/Navbar";
import ItemDetailsModal from "../Components/ItemDetailsModal";
import { useLocation } from "react-router-dom";
import {
  BarChart3,
  CircleDollarSign,
  Wallet,
  AlertCircle,
  Package,
  Download,
} from "lucide-react";
import { useAppContext } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { useToast } from "../context/ToastContext";

const Inventory = () => {
  const location = useLocation();
  const { appData } = useAppContext();
  const { showSuccess, showInfo } = useToast();

  // State for active tab
  const [activeTab, setActiveTab] = useState("Material Flow");

  // State for item details modal
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  // Memoize expensive calculations
  const { transactions, totalAmount, totalPaid, totalBalance, paymentPercentage, balancePercentage } = useMemo(() => {
    const aggregated = appData.dailyReport.entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();
      
      if (!acc[key]) {
        acc[key] = {
          particulars: entry.particulars,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          transactions: []
        };
      }
      
      acc[key].totalAmount += entry.amount;
      acc[key].totalPaid += entry.paid;
      acc[key].totalBalance += entry.balance;
      acc[key].transactions.push(entry);
      
      return acc;
    }, {});

    const transactions = Object.values(aggregated);
    const totalAmount = transactions.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalPaid = transactions.reduce((sum, item) => sum + item.totalPaid, 0);
    const totalBalance = transactions.reduce((sum, item) => sum + item.totalBalance, 0);

    return {
      transactions,
      totalAmount,
      totalPaid,
      totalBalance,
      paymentPercentage: totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0,
      balancePercentage: totalAmount > 0 ? Math.round((totalBalance / totalAmount) * 100) : 0
    };
  }, [appData.dailyReport.entries]);

  const monthlyData = useMemo(() => {
    const data = {};
    appData.dailyReport.entries.forEach(item => {
      const date = new Date(item.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!data[monthYear]) {
        data[monthYear] = {
          amount: 0,
          paid: 0,
          balance: 0
        };
      }

      data[monthYear].amount += item.amount;
      data[monthYear].paid += item.paid;
      data[monthYear].balance += item.balance;
    });

    return Object.entries(data).map(([month, values]) => ({
      month,
      ...values
    }));
  }, [appData.dailyReport.entries]);

  const itemCounts = useMemo(() => {
    const counts = {};
    appData.dailyReport.entries.forEach(item => {
      counts[item.particulars] = (counts[item.particulars] || 0) + 1;
    });
    return counts;
  }, [appData.dailyReport.entries]);

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
            <div className="text-xs text-gray-400 mt-1">{data.month}</div>
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
        
        // Keep track of the latest transaction date and DR number
        const currentDate = new Date(entry.date);
        const existingDate = new Date(acc[key].date);
        if (currentDate > existingDate) {
          acc[key].date = entry.date;
          acc[key].drNo = entry.drNo || '-';
        }
      }
      return acc;
    }, {});

    // Convert to array and sort by date (most recent first)
    return Object.values(grouped).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet from transactions data
      const ws = XLSX.utils.json_to_sheet(transactions.map(item => ({
        'Particulars': item.particulars,
        'Total Amount': item.totalAmount,
        'Total Paid': item.totalPaid,
        'Total Balance': item.totalBalance,
        'Payment %': `${Math.round((item.totalPaid / item.totalAmount) * 100)}%`,
        'Balance %': `${Math.round((item.totalBalance / item.totalAmount) * 100)}%`
      })));

      // Add total row
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', totalAmount, totalPaid, totalBalance, `${paymentPercentage}%`, `${balancePercentage}%`]
      ], { origin: -1 });

      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // Particulars
        { wch: 15 }, // Total Amount
        { wch: 15 }, // Total Paid
        { wch: 15 }, // Total Balance
        { wch: 12 }, // Payment %
        { wch: 12 }  // Balance %
      ];

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

      // Generate Excel file
      XLSX.writeFile(wb, 'inventory_report.xlsx');
      showSuccess('Inventory data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
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
                      ₹ {totalAmount.toLocaleString()}
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
                      ₹ {totalPaid.toLocaleString()}
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
                      {paymentPercentage}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[120px]">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${paymentPercentage}%` }}
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
                      ₹ {totalBalance.toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[120px]">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${balancePercentage}%` }}
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
                  {renderCircularProgress(paymentPercentage, "pink")}
                </div>
                <div className="mt-2 text-sm">
                  <div className="flex items-center text-white">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Total Items: {appData.dailyReport.entries.length}</span>
                  </div>
                  <div className="flex items-center text-white mt-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <span>Unique Items: {Object.keys(itemCounts).length}</span>
                  </div>
                </div>
              </div>

              {/* Payment Stats */}
              <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Payment Status</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {totalPaid.toLocaleString()} / {totalAmount.toLocaleString()}
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(paymentPercentage, "pink")}
                  </div>
                </div>
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Payment Percentage</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {paymentPercentage}%
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(paymentPercentage, "pink")}
                  </div>
                </div>
              </div>

              {/* Balance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Balance Status</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {totalBalance.toLocaleString()} / {totalAmount.toLocaleString()}
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(balancePercentage, "pink")}
                  </div>
                </div>
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
                  <div className="text-white text-sm mb-2">Balance Percentage</div>
                  <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                    {balancePercentage}%
                  </div>
                  <div className="flex justify-center my-2">
                    {renderCircularProgress(balancePercentage, "pink")}
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
                        <td className="px-6 py-4 text-[#2C3E50]">{item.drNo}</td>
                        <td className="px-6 py-4">
                          <div
                            className="flex items-center cursor-pointer hover:bg-blue-50 rounded-md p-1 transition-colors"
                            onClick={() => handleParticularsClick(item)}
                            title="Click to view item details"
                          >
                            <div className="w-2 h-2 bg-[#7BAFD4] rounded-full mr-2"></div>
                            <span className="text-[#7BAFD4] hover:text-[#6B9FD4]">
                              {item.particulars}
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
                      <td colSpan="3" className="px-6 py-4 text-right text-[#2C3E50]">
                        Total
                      </td>
                      <td className="px-6 py-4 text-[#2C3E50]">₹{totalAmount}</td>
                      <td className="px-6 py-4 text-green-600">₹{totalPaid}</td>
                      <td className="px-6 py-4 text-red-600">₹{totalBalance}</td>
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
