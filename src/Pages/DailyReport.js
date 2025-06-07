import React, { useState } from 'react';
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { ListTodo } from "lucide-react";
import AddDailyReportModal from '../Components/AddDailyReportModal';
import { useAppContext } from '../context/AppContext';

const DailyReport = () => {
  const location = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const { appData, updateDailyReport } = useAppContext();
  const { dailyReport } = appData;

  const handleAddEntry = (newEntry) => {
    updateDailyReport({ ...newEntry, isNew: true });
    setShowAddModal(false);
  };

  // Function to group transactions by particulars
  const getGroupedTransactions = () => {
    const grouped = dailyReport.entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          no: entry.no,
          particulars: entry.particulars,
          date: entry.date,
          amount: entry.amount,
          paid: entry.paid,
          balance: entry.balance,
          unit: entry.unit,
          quantity: entry.quantity,
          remarks: entry.remarks,
          transactions: [entry]
        };
      } else {
        // Update the aggregated values
        acc[key].amount += entry.amount;
        acc[key].paid += entry.paid;
        acc[key].balance += entry.balance;
        acc[key].quantity += entry.quantity;
        acc[key].transactions.push(entry);
        
        // Keep track of the latest transaction date
        const currentDate = new Date(entry.date);
        const existingDate = new Date(acc[key].date);
        if (currentDate > existingDate) {
          acc[key].date = entry.date;
          acc[key].no = entry.no; // Use the most recent transaction ID
          acc[key].remarks = entry.remarks; // Use the latest remarks
        }
      }
      return acc;
    }, {});

    // Convert to array and sort by date (most recent first)
    return Object.values(grouped).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  };

  // Function to render circular progress
  const renderCircularProgress = (percentage, size = 120) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2C3E50"
          strokeOpacity="0.3"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EF4444"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Get grouped transactions
  const groupedTransactions = getGroupedTransactions();

  // Calculate totals from grouped transactions
  const totalAmount = groupedTransactions.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPaid = groupedTransactions.reduce((sum, entry) => sum + entry.paid, 0);
  const totalBalance = groupedTransactions.reduce((sum, entry) => sum + entry.balance, 0);

  return (
    <>
      <Navbar currentPath={location.pathname} icon={ListTodo} />
      <div className="p-4 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Daily Report</h1>
          <p className="text-[#7C8CA1]">Track daily expenses and payments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Existing Balance */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-[#2C3E50]">Existing Balance</h3>
              <p className="text-3xl font-bold text-[#2C3E50]">{dailyReport.existingBalance} L</p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2">
              {renderCircularProgress(75, 150)}
            </div>
          </div>

          {/* Budget Spent */}
          <div className="bg-[#7BAFD4] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#2C3E50]">Budget Spent</h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-[#2C3E50]">₹{dailyReport.budgetSpent.amount}</p>
              <p className="text-sm text-[#2C3E50]">/ ₹{dailyReport.budgetSpent.total}</p>
            </div>
            <div className="mt-2">
              <div className="w-full bg-[#2C3E50]/30 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${dailyReport.budgetSpent.percentage}%` }}
                />
              </div>
              <p className="text-right mt-1 text-red-600">{dailyReport.budgetSpent.percentage}%</p>
            </div>
          </div>

          {/* Budget Spent Percentage */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#2C3E50]">Budget Spent</h3>
              <p className="text-3xl font-bold text-red-600">{dailyReport.budgetSpent.percentage}%</p>
            </div>
            <div className="w-20 h-20">
              {renderCircularProgress(dailyReport.budgetSpent.percentage, 80)}
            </div>
          </div>

          {/* Balance To Be Paid */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#2C3E50]">Balance To Be Paid</h3>
              <p className="text-3xl font-bold text-red-600">{dailyReport.balanceToBePaid.percentage}%</p>
            </div>
            <div className="w-20 h-20">
              {renderCircularProgress(dailyReport.balanceToBePaid.percentage, 80)}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Latest NO.</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Latest Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Amount</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Paid</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Unit</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Quantity</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Latest Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groupedTransactions.map((entry) => (
                  <tr key={entry.particulars} className="text-sm text-[#4A5568] hover:bg-gray-50">
                    <td className="px-6 py-4">{entry.no}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-[#7BAFD4]">{entry.particulars}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({entry.transactions.length} transactions)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{entry.date}</td>
                    <td className="px-6 py-4 text-[#2C3E50]">₹{entry.amount}</td>
                    <td className="px-6 py-4 text-[#2C3E50]">₹{entry.paid}</td>
                    <td className="px-6 py-4 text-[#2C3E50]">₹{entry.balance}</td>
                    <td className="px-6 py-4">{entry.unit}</td>
                    <td className="px-6 py-4">{entry.quantity}</td>
                    <td className="px-6 py-4 text-[#7C8CA1]">{entry.remarks}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right font-semibold text-[#2C3E50]">
                    Total ({groupedTransactions.length} unique items)
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#2C3E50]">₹{totalAmount}</td>
                  <td className="px-6 py-4 font-semibold text-[#2C3E50]">₹{totalPaid}</td>
                  <td className="px-6 py-4 font-semibold text-[#2C3E50]">₹{totalBalance}</td>
                  <td colSpan="3" className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Add Entry Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#7BAFD4] text-white px-6 py-2 rounded-lg hover:bg-[#6B9FD4] transition-colors"
          >
            Add Entry
          </button>
        </div>

        {/* Add Entry Modal */}
        <AddDailyReportModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEntry}
        />
      </div>
    </>
  );
};

export default DailyReport; 