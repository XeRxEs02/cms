import React, { useState } from 'react';
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { ListTodo, FileText, Download } from "lucide-react";
import AddDailyReportModal from '../Components/AddDailyReportModal';
import { useAppContext } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { useToast } from "../context/ToastContext";

const DailyReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const { appData, updateDailyReport } = useAppContext();
  const { dailyReport } = appData;
  const { showSuccess, showInfo } = useToast();

  // New: State for selected date
  const allDates = Array.from(new Set(dailyReport.entries.map(e => e.date))).sort((a, b) => new Date(b) - new Date(a));
  const [selectedDate, setSelectedDate] = useState(allDates[0] || '');
  // Add state for history range
  const [historyRange, setHistoryRange] = useState('1week');

  // New: State for history particular filter
  const allParticulars = Array.from(new Set(dailyReport.entries.map(e => e.particulars)));
  const [historyParticular, setHistoryParticular] = useState('All');

  const handleAddEntry = (newEntry) => {
    updateDailyReport({ ...newEntry, isNew: true });
    setShowAddModal(false);
    // If the new entry's date is different, switch to that date so the table updates
    if (newEntry.date && newEntry.date !== selectedDate) {
      setSelectedDate(newEntry.date);
    } else {
      // Otherwise, force a state update to trigger re-render
      setSelectedDate(prev => prev);
    }
  };

  // Grouped transactions (unchanged)
  const getGroupedTransactions = () => {
    const grouped = dailyReport.entries.reduce((acc, entry) => {
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
          unit: entry.unit,
          quantity: entry.quantity,
          remarks: entry.remarks,
          transactions: [entry]
        };
      } else {
        acc[key].amount += entry.amount;
        acc[key].paid += entry.paid;
        acc[key].balance += entry.balance;
        acc[key].quantity += entry.quantity;
        acc[key].transactions.push(entry);
        const currentDate = new Date(entry.date);
        const existingDate = new Date(acc[key].date);
        if (currentDate > existingDate) {
          acc[key].date = entry.date;
          acc[key].no = entry.no;
          acc[key].drNo = entry.drNo || '-';
          acc[key].remarks = entry.remarks;
        }
      }
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // New: Filter entries for selected date
  const entriesForSelectedDate = selectedDate ? dailyReport.entries.filter(e => e.date === selectedDate) : [];

  // Calculate totals for selected date
  const totalAmount = entriesForSelectedDate.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const totalPaid = entriesForSelectedDate.reduce((sum, entry) => sum + (entry.paid || 0), 0);
  const totalBalance = entriesForSelectedDate.reduce((sum, entry) => sum + (entry.balance || 0), 0);

  // Helper to get filtered dates for history modal
  const getFilteredDates = () => {
    const now = new Date();
    let filtered = allDates;
    if (historyParticular !== 'All') {
      filtered = filtered.filter(date => dailyReport.entries.some(e => e.date === date && e.particulars === historyParticular));
    }
    if (historyRange === '1week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return filtered.filter(date => new Date(date) >= weekAgo && new Date(date) <= now);
    } else if (historyRange === '1month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return filtered.filter(date => new Date(date) >= monthAgo && new Date(date) <= now);
    } else if (historyRange === '1year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      return filtered.filter(date => new Date(date) >= yearAgo && new Date(date) <= now);
    }
    return filtered;
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

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet from transactions data
      const ws = XLSX.utils.json_to_sheet(entriesForSelectedDate.map(item => ({
        'No.': item.no,
        'Particulars': item.particulars,
        'Date': item.date,
        'Amount': item.amount,
        'Paid': item.paid,
        'Balance': item.balance,
        'Unit': item.unit,
        'Quantity': item.quantity,
        'Remarks': item.remarks
      })));

      // Add total row
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', '', '', totalAmount, totalPaid, totalBalance, '', '', '']
      ], { origin: -1 });

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No.
        { wch: 20 }, // Particulars
        { wch: 12 }, // Date
        { wch: 15 }, // Amount
        { wch: 15 }, // Paid
        { wch: 15 }, // Balance
        { wch: 10 }, // Unit
        { wch: 10 }, // Quantity
        { wch: 20 }  // Remarks
      ];

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Daily Report');

      // Generate Excel file
      XLSX.writeFile(wb, 'daily_report.xlsx');
      showSuccess('Daily report data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={FileText} />
      <div className="px-2 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Daily Report</h1>
          <p className="text-[#7C8CA1]">Track daily expenses and payments</p>
        </div>

        {/* Move View History and Select Date up, above the main action bar */}
        <div className="flex justify-end gap-2 mb-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={() => navigate(`/app/daily-report/history`)}
          >
            View History
          </button>
          <label className="font-medium text-gray-700">Select Date:</label>
          <select
            className="border rounded px-2 py-1 ml-2"
            value={selectedDate}
            onChange={e => { setSelectedDate(e.target.value); }}
          >
            {allDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <button 
            onClick={handleExportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Download size={18} />
            EXPORT TO EXCEL
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Add Entry
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Existing Balance */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#2C3E50]">Existing Balance</h3>
              <p className="text-3xl font-bold text-[#2C3E50]">{dailyReport.existingBalance} L</p>
            </div>
            <div className="w-24 h-24">
              {renderCircularProgress(75, 96)}
            </div>
          </div>

          {/* Budget Spent */}
          <div className="bg-[#7BAFD4] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#2C3E50]">Budget Spent</h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-[#2C3E50]">₹{dailyReport.budgetSpent.amount}</p>
              <p className="text-sm text-[#2C3E50]">/ ₹{dailyReport.budgetSpent.total}</p>
            </div>
            <div className="mt-4">
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
            <div className="w-24 h-24">
              {renderCircularProgress(dailyReport.budgetSpent.percentage, 96)}
            </div>
          </div>

          {/* Balance To Be Paid */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#2C3E50]">Balance To Be Paid</h3>
              <p className="text-3xl font-bold text-red-600">{dailyReport.balanceToBePaid.percentage}%</p>
            </div>
            <div className="w-24 h-24">
              {renderCircularProgress(dailyReport.balanceToBePaid.percentage, 96)}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">DR. No.</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Amount</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Paid</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Unit</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Quantity</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {entriesForSelectedDate.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-6 text-gray-400">No entries for this day.</td></tr>
                ) : (
                  entriesForSelectedDate.map((entry, idx) => (
                    <tr key={entry.id || entry.no || idx} className="text-sm text-[#4A5568] hover:bg-gray-50">
                      <td className="px-6 py-4">{entry.drNo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-[#7BAFD4]">{entry.particulars}</span>
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
                  ))
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right font-semibold text-[#2C3E50]">
                    Total
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

        {/* History Modal */}
        {/* The history modal and its related state/logic have been removed. */}

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