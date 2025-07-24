import React, { useState, useMemo } from "react";
import Navbar from "../Components/Navbar";
import ItemDetailsModal from "../Components/ItemDetailsModal";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CircleDollarSign,
  Wallet,
  AlertCircle,
  Package,
  Download,
  Edit2,
  Plus,
  X,
  XCircle,
} from "lucide-react";
import { useAppContext } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { useToast } from "../context/ToastContext";
import AddItemDetailsModal from "../Components/AddItemDetailsModal";

// Analytics component for Material Flow detail view
function MaterialFlowAnalytics({ particular, getTransactionsForParticular }) {
  const txns = getTransactionsForParticular(particular);
  let totalReceived = 0, totalConsumed = 0, unit = '-';
  let totalEstimated = 0;
  if (txns.length > 0) {
    totalReceived = txns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
    totalConsumed = txns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
    unit = txns[0].unit || '-';
    totalEstimated = txns[0].totalEstimated ? Number(txns[0].totalEstimated) : 0;
  }
  const remaining = totalReceived - totalConsumed;
  return (
    <div className="flex flex-wrap gap-4 px-4 py-4">
      <div className="flex-1 min-w-[180px] bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-xs text-gray-500 mb-1">Total Received</div>
        <div className="text-2xl font-bold text-[#7BAFD4]">{totalReceived} {unit}</div>
      </div>
      <div className="flex-1 min-w-[180px] bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-xs text-gray-500 mb-1">Total Consumed</div>
        <div className="text-2xl font-bold text-red-500">{totalConsumed} {unit}</div>
      </div>
      <div className="flex-1 min-w-[180px] bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-xs text-gray-500 mb-1">Remaining In Stock</div>
        <div className="text-2xl font-bold text-green-600">{remaining} {unit}</div>
      </div>
      <div className="flex-1 min-w-[180px] bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-xs text-gray-500 mb-1">Total Estimated</div>
        <div className="text-2xl font-bold text-gray-700">{totalEstimated} {unit}</div>
      </div>
    </div>
  );
}

const Inventory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appData, updateDailyReport } = useAppContext();
  const { showSuccess, showInfo, showError } = useToast();

  // State for active tab
  const [activeTab, setActiveTab] = useState("Material Tracking List");

  // State for item details modal
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  // State for update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState(null);

  // State for add particular modal
  const [showAddParticularModal, setShowAddParticularModal] = useState(false);

  // Add state for fetched daily report data
  const [fetchedParticularData, setFetchedParticularData] = useState(null);

  // Add this state to track all particulars
  const [allParticulars, setAllParticulars] = useState(() => {
    // Try to load from localStorage for persistence
    const saved = localStorage.getItem('allParticulars');
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage whenever allParticulars changes
  React.useEffect(() => {
    localStorage.setItem('allParticulars', JSON.stringify(allParticulars));
  }, [allParticulars]);

  // Add state for selected particular
  const [selectedParticular, setSelectedParticular] = useState(null);
  const [selectedTrackingItem, setSelectedTrackingItem] = useState(null);

  // Add at the top of the Inventory component
  const [showConsumeModal, setShowConsumeModal] = useState(false);
  const [consumeForm, setConsumeForm] = useState({ quantity: '', date: '' });
  const [consumeError, setConsumeError] = useState('');

  // Handler to open modal
  const handleOpenConsumeModal = () => {
    setConsumeForm({ quantity: '', date: '' });
    setConsumeError('');
    setShowConsumeModal(true);
  };

  // Handler to submit consumed entry
  const handleConsumeSubmit = () => {
    const quantity = Number(consumeForm.quantity);
    const date = consumeForm.date;
    if (!quantity || quantity <= 0) {
      setConsumeError('Please enter a valid consumed quantity.');
      return;
    }
    if (!date) {
      setConsumeError('Please select a date.');
      return;
    }
    // Prevent negative stock
    const txns = getTransactionsForParticular(selectedParticular);
    const totalReceived = txns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
    const totalConsumed = txns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
    const remaining = totalReceived - totalConsumed;
    if (quantity > remaining) {
      setConsumeError('Consumed quantity cannot exceed remaining stock.');
      return;
    }
    // Prevent consuming before any received date
    const receivedDates = txns.filter(t => Number(t.received) > 0 && t.date).map(t => new Date(t.date));
    if (receivedDates.length === 0) {
      setConsumeError('Cannot consume before any stock is received.');
      return;
    }
    const minReceivedDate = new Date(Math.min(...receivedDates.map(d => d.getTime())));
    const consumeDate = new Date(date);
    if (consumeDate < minReceivedDate) {
      setConsumeError(`Consumed date cannot be before first received date (${minReceivedDate.toLocaleDateString()}).`);
      return;
    }
    // Add new consumed entry for this particular
    const newEntry = {
      no: Date.now().toString(),
      drNo: '-',
      particulars: selectedParticular,
      date,
      received: 0,
      consumed: quantity,
      unit: (txns[0] && txns[0].unit) || '-',
      remarks: 'Consumed entry',
    };
    if (typeof updateDailyReport === 'function') {
      updateDailyReport({ ...newEntry, isNew: true });
    }
    setShowConsumeModal(false);
  };

  // Function to generate next DR number
  const getNextDRNumber = () => {
    // Get all existing DR numbers
    const existingDRs = appData.dailyReport.entries
      .map(entry => entry.drNo)
      .filter(drNo => drNo && drNo.startsWith('DR'))
      .map(drNo => {
        const num = parseInt(drNo.replace('DR', ''));
        return isNaN(num) ? 0 : num;
      });

    // Find the highest number
    const maxDR = Math.max(0, ...existingDRs);
    
    // Generate next number, zero-padded to 3 digits
    return `DR${(maxDR + 1).toString().padStart(3, '0')}`;
  };

  // Modify the newParticular state to include auto-generated DR number
  const [newParticular, setNewParticular] = useState({
    drNo: getNextDRNumber(),
    particulars: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    paid: "",
    balance: "",
    remarks: ""
  });

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

  // Add function to handle update button click
  const handleUpdateClick = (item) => {
    setSelectedItemForUpdate(item);
    setShowUpdateModal(true);
  };

  // Add function to handle update submission
  const handleUpdateSubmit = async (updatedData) => {
    try {
      // Update the item in the appData context
      const updatedEntries = appData.dailyReport.entries.map(entry => {
        if (entry.particulars === selectedItemForUpdate.particulars) {
          return { ...entry, ...updatedData };
        }
        return entry;
      });

      // Update the context with new data
      await updateDailyReport({
        ...updatedData,
        isNew: false,
        entries: updatedEntries
      });

      showSuccess("Item updated successfully");
      setShowUpdateModal(false);
      setSelectedItemForUpdate(null);
    } catch (error) {
      console.error('Error updating item:', error);
      showError("Failed to update item");
    }
  };

  // Add function to handle adding new particular
  const handleAddParticular = async (formData) => {
    try {
      // Validate required fields
      if (!formData.particulars || !formData.date || !formData.amount) {
        showError("Please fill in all required fields (Particulars, Date, and Amount)");
        return;
      }

      // Validate numeric fields
      const amount = parseFloat(formData.amount);
      const paid = parseFloat(formData.paid) || 0;
      
      if (isNaN(amount) || amount <= 0) {
        showError("Amount must be a positive number");
        return;
      }

      if (isNaN(paid) || paid < 0) {
        showError("Paid amount must be a non-negative number");
        return;
      }

      if (paid > amount) {
        showError("Paid amount cannot be greater than the total amount");
        return;
      }

      // Calculate balance
      const balance = amount - paid;

      // Check if this is a new item (not already in the list)
      const isNewItem = !appData.dailyReport.entries.some(entry => entry.particulars.toLowerCase() === formData.particulars.toLowerCase());
      if (isNewItem) {
        // Add a blank entry for the new item (all columns empty except particulars)
        await updateDailyReport({
          particulars: formData.particulars,
          drNo: '',
          date: '',
          amount: '',
          paid: '',
          balance: '',
          remarks: '',
          isNew: true
        });
        showInfo(`New item '${formData.particulars}' added to Material Tracking List.`);
      }

      // Create a new entry in the daily report
      const newEntry = {
        ...formData,
        amount,
        paid,
        balance,
        drNo: formData.drNo || getNextDRNumber(),
        isNew: true
      };

      // Update the context with new data
      await updateDailyReport(newEntry);

      showSuccess("New particular added successfully");
      setShowAddParticularModal(false);
      setNewParticular({
        drNo: getNextDRNumber(),
        particulars: "",
        date: new Date().toISOString().split('T')[0],
        amount: "",
        paid: "",
        balance: "",
        remarks: ""
      });
    } catch (error) {
      console.error('Error adding particular:', error);
      showError(error.message || "Failed to add particular. Please try again.");
    }
  };

  // Helper to get all transactions for a particular
  const getTransactionsForParticular = (particular) =>
    appData.dailyReport.entries.filter(
      en => en.particulars.toLowerCase() === particular.toLowerCase()
    );

  // Helper to compute analytics for a particular
  const getAnalyticsForParticular = (particular) => {
    const txns = getTransactionsForParticular(particular);
    let totalReceived = 0, totalConsumed = 0;
    txns.forEach(txn => {
      if (txn.received) totalReceived += Number(txn.received);
      if (txn.consumed) totalConsumed += Number(txn.consumed);
      // fallback for amount/paid if used
      if (txn.amount && !txn.received) totalReceived += Number(txn.amount);
      if (txn.paid && !txn.consumed) totalConsumed += Number(txn.paid);
    });
    // Use totalEstimated from the first transaction for this material, fallback to 100
    const totalEstimated = txns.length > 0 && txns[0].totalEstimated ? Number(txns[0].totalEstimated) : 100;
    const remaining = totalReceived - totalConsumed;
    return { totalReceived, totalConsumed, totalEstimated, remaining };
  };

  // Remove allParticulars for listing items, use unique particulars from daily report
  const uniqueParticulars = useMemo(() => {
    const set = new Set();
    appData.dailyReport.entries.forEach(entry => {
      if (entry.particulars && entry.particulars.trim() !== "") {
        set.add(entry.particulars);
      }
    });
    return Array.from(set);
  }, [appData.dailyReport.entries]);

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Package} />
      <section className="w-full px-2 sm:px-4 mx-0 sm:mx-2">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("Material Tracking List")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "Material Tracking List"
                  ? "border-[#7BAFD4] text-[#7BAFD4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Material Tracking List
            </button>
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
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "Material Flow" && (
          <div>
            {/* Material List or Detail View */}
            {!selectedParticular ? (
              <div className="p-3 sm:p-4 md:p-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Material Flow</h3>
                      <p className="text-sm text-gray-600">Click a material to view its unit flow and records.</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">NO.</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Unit</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Received</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Consumed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {uniqueParticulars.map((particular, idx) => {
                          const txns = getTransactionsForParticular(particular);
                          const totalReceived = txns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
                          const totalConsumed = txns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
                          const unit = txns.length > 0 && txns[0].unit ? txns[0].unit : '-';
                          return (
                            <tr key={particular} className="text-sm hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedParticular(particular)}>
                              <td className="px-6 py-4">{String(idx+1).padStart(2, '0')}</td>
                              <td className="px-6 py-4 text-[#7BAFD4] font-bold">{particular}</td>
                              <td className="px-6 py-4">{unit}</td>
                              <td className="px-6 py-4">{totalReceived} {unit}</td>
                              <td className="px-6 py-4">{totalConsumed} {unit}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                <button
                  className="mb-4 px-4 py-2 bg-[#7BAFD4] text-white rounded hover:bg-[#669BBC]"
                  onClick={() => setSelectedParticular(null)}
                >
                  ← Back to List
                </button>
                {/* Add Consumed Entry Button */}
                <button
                  className="mb-4 ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleOpenConsumeModal}
                >
                  + Add Consumed Entry
                </button>
                {/* Consume Modal */}
                {showConsumeModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
                      <h3 className="text-lg font-semibold mb-4">Add Consumed Quantity</h3>
                      <div className="mb-3">
                        <label className="block text-sm mb-1">Consumed Quantity</label>
                        <input
                          type="number"
                          className="w-full border px-2 py-1 rounded"
                          value={consumeForm.quantity}
                          onChange={e => setConsumeForm(f => ({ ...f, quantity: e.target.value }))}
                          min="1"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full border px-2 py-1 rounded"
                          value={consumeForm.date}
                          onChange={e => setConsumeForm(f => ({ ...f, date: e.target.value }))}
                        />
                      </div>
                      {consumeError && <div className="text-red-500 text-sm mb-2">{consumeError}</div>}
                      <div className="flex gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-[#7BAFD4] text-white rounded hover:bg-[#669BBC]"
                          onClick={handleConsumeSubmit}
                        >
                          Add
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => setShowConsumeModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Analytics Section for Quantities */}
                {(() => {
                  const txns = getTransactionsForParticular(selectedParticular);
                  const totalReceived = txns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
                  const totalConsumed = txns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
                  const unit = txns.length > 0 && txns[0].unit ? txns[0].unit : '-';
                  const remaining = totalReceived - totalConsumed;
                  return (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 min-w-[180px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center shadow-sm border border-blue-100">
                          <div className="text-xs text-blue-700 mb-1 font-medium tracking-wide uppercase">Total Received</div>
                          <div className="text-3xl font-extrabold text-blue-600 flex items-center justify-center gap-1">
                            <span>{totalReceived}</span> <span className="text-base font-semibold text-blue-400">{unit}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-[180px] bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 text-center shadow-sm border border-pink-100">
                          <div className="text-xs text-pink-700 mb-1 font-medium tracking-wide uppercase">Total Consumed</div>
                          <div className="text-3xl font-extrabold text-pink-500 flex items-center justify-center gap-1">
                            <span>{totalConsumed}</span> <span className="text-base font-semibold text-pink-300">{unit}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-[180px] bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center shadow-sm border border-green-100">
                          <div className="text-xs text-green-700 mb-1 font-medium tracking-wide uppercase">Remaining In Stock</div>
                          <div className="text-3xl font-extrabold text-green-600 flex items-center justify-center gap-1">
                            <span>{remaining}</span> <span className="text-base font-semibold text-green-400">{unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-8 mt-2">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-blue-700">Received</span>
                          <span className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden block mt-1">
                            <span className="block h-2 bg-blue-500 rounded-full" style={{ width: `${totalReceived / (totalReceived + totalConsumed + Math.max(remaining, 0)) * 100 || 0}%` }}></span>
                          </span>
                          <span className="text-xs text-blue-500 mt-1">{Math.round((totalReceived / (totalReceived + totalConsumed + Math.max(remaining, 0))) * 100) || 0}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-pink-700">Consumed</span>
                          <span className="w-16 h-2 bg-pink-200 rounded-full overflow-hidden block mt-1">
                            <span className="block h-2 bg-pink-500 rounded-full" style={{ width: `${totalConsumed / (totalReceived + totalConsumed + Math.max(remaining, 0)) * 100 || 0}%` }}></span>
                          </span>
                          <span className="text-xs text-pink-500 mt-1">{Math.round((totalConsumed / (totalReceived + totalConsumed + Math.max(remaining, 0))) * 100) || 0}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-green-700">Remaining</span>
                          <span className="w-16 h-2 bg-green-200 rounded-full overflow-hidden block mt-1">
                            <span className="block h-2 bg-green-500 rounded-full" style={{ width: `${remaining / (totalReceived + totalConsumed + Math.max(remaining, 0)) * 100 || 0}%` }}></span>
                          </span>
                          <span className="text-xs text-green-500 mt-1">{Math.round((remaining / (totalReceived + totalConsumed + Math.max(remaining, 0))) * 100) || 0}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {/* Quantity Transaction Table Section */}
                <div className="overflow-x-auto">
                  <h5 className="text-md font-semibold mb-2 text-[#2C3E50]">Quantity Transaction Details</h5>
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Item No.</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">DR No.</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Item Name</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Date</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Quantity Received</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Quantity Used</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Remaining Quantity</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(() => {
                        const txns = getTransactionsForParticular(selectedParticular);
                        return txns.map((txn, idx) => {
                          const received = Number(txn.received) || 0;
                          const used = Number(txn.consumed) || 0;
                          // Calculate running remaining quantity
                          const prevTxns = txns.slice(0, idx);
                          const prevReceived = prevTxns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
                          const prevUsed = prevTxns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
                          const runningRemaining = prevReceived + received - (prevUsed + used);
                          const unit = txn.unit || (txns[0] && txns[0].unit) || '-';
                          return (
                            <tr key={idx} className="text-sm">
                              <td className="px-4 py-3">{txn.no || idx + 1}</td>
                              <td className="px-4 py-3">{txn.drNo || '-'}</td>
                              <td className="px-4 py-3">{txn.particulars}</td>
                              <td className="px-4 py-3">{txn.date}</td>
                              <td className="px-4 py-3">{received} {unit}</td>
                              <td className="px-4 py-3">{used} {unit}</td>
                              <td className="px-4 py-3">{runningRemaining} {unit}</td>
                              <td className="px-4 py-3">{txn.remarks || '-'}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Material Tracking List Tab */}
        {activeTab === "Material Tracking List" && (
          <div className="p-3 sm:p-4 md:p-6">
            {/* If no item is selected, show the list */}
            {!selectedTrackingItem ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Material Tracking List</h3>
                  </div>
                  <button
                    onClick={() => setShowAddParticularModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Add Particular</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">NO.</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Date</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Amount</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Paid</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getGroupedTransactions().map((item, idx) => (
                        <tr key={item.particulars} className="text-sm hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTrackingItem(item)}>
                          <td className="px-6 py-4">{String(idx+1).padStart(2, '0')}</td>
                          <td className="px-6 py-4 text-[#7BAFD4] font-bold">{item.particulars}</td>
                          <td className="px-6 py-4">{item.date}</td>
                          <td className="px-6 py-4">₹{item.amount}</td>
                          <td className="px-6 py-4">₹{item.paid}</td>
                          <td className="px-6 py-4">₹{item.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // If an item is selected, show analytics and transaction table for that item
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                <button
                  className="mb-4 px-4 py-2 bg-[#7BAFD4] text-white rounded hover:bg-[#669BBC]"
                  onClick={() => setSelectedTrackingItem(null)}
                >
                  ← Back to List
                </button>
                {/* Analytics Section */}
                {(() => {
                  const txns = getTransactionsForParticular(selectedTrackingItem.particulars);
                  const totalAmount = txns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
                  const totalPaid = txns.reduce((sum, t) => sum + (Number(t.paid) || 0), 0);
                  const totalBalance = txns.reduce((sum, t) => sum + (Number(t.balance) || 0), 0);
                  const paymentPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
                  const balancePercentage = totalAmount > 0 ? Math.round((totalBalance / totalAmount) * 100) : 0;
                  return (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 min-w-[180px] bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs text-gray-500 mb-1">Total Required</div>
                          <div className="text-2xl font-bold text-[#7BAFD4]">₹{totalAmount}</div>
                        </div>
                        <div className="flex-1 min-w-[180px] bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs text-gray-500 mb-1">Total Paid</div>
                          <div className="text-2xl font-bold text-green-600">₹{totalPaid}</div>
                        </div>
                        <div className="flex-1 min-w-[180px] bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs text-gray-500 mb-1">Total Pending</div>
                          <div className="text-2xl font-bold text-red-500">₹{totalBalance}</div>
                        </div>
                      </div>
                      {/* Modern Bar Chart for Paid vs Pending */}
                      <div className="flex justify-center mb-4">
                        {(() => {
                          const paidWidth = totalAmount > 0 ? (totalPaid / totalAmount) * 220 : 0;
                          const pendingWidth = totalAmount > 0 ? (totalBalance / totalAmount) * 220 : 0;
                          return (
                            <svg width="480" height="80">
                              {/* Background */}
                              <rect x="0" y="10" width="470" height="50" rx="18" fill="url(#bgGradient)" opacity="0.15" />
                              <defs>
                                <linearGradient id="paidGradient" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="#43e97b" />
                                  <stop offset="100%" stopColor="#38f9d7" />
                                </linearGradient>
                                <linearGradient id="pendingGradient" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="#fa709a" />
                                  <stop offset="100%" stopColor="#fee140" />
                                </linearGradient>
                                <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="#7BAFD4" />
                                  <stop offset="100%" stopColor="#f5f7fa" />
                                </linearGradient>
                              </defs>
                              {/* Paid Bar */}
                              <rect x="20" y="25" width={paidWidth} height="22" rx="11" fill="url(#paidGradient)" />
                              <text x={20 + paidWidth / 2} y="41" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="bold" style={{textShadow:'0 1px 4px #0002'}}>Paid: ₹{totalPaid}</text>
                              {/* Pending Bar */}
                              <rect x={250} y="25" width={pendingWidth} height="22" rx="11" fill="url(#pendingGradient)" />
                              <text x={250 + pendingWidth / 2} y="41" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="bold" style={{textShadow:'0 1px 4px #0002'}}>Pending: ₹{totalBalance}</text>
                              {/* Axis labels */}
                              <text x="20" y="65" fontSize="13" fill="#43e97b" fontWeight="bold">Paid</text>
                              <text x="250" y="65" fontSize="13" fill="#fa709a" fontWeight="bold">Pending</text>
                            </svg>
                          );
                        })()}
                      </div>
                      <div className="flex justify-center gap-8">
                        <div className="text-sm text-[#7BAFD4]">Paid: {paymentPercentage}%</div>
                        <div className="text-sm text-[#EF4444]">Pending: {balancePercentage}%</div>
                      </div>
                    </div>
                  );
                })()}
                {/* Transaction Table Section */}
                <div className="overflow-x-auto">
                  <h5 className="text-md font-semibold mb-2 text-[#2C3E50]">Transaction Details</h5>
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Item No.</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">DR No.</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Item Name</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Date</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Amount</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Paid</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Pending</th>
                        <th className="px-4 py-3 text-sm font-semibold text-[#2C3E50]">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getTransactionsForParticular(selectedTrackingItem.particulars).map((txn, idx) => (
                        <tr key={idx} className="text-sm">
                          <td className="px-4 py-3">{txn.no || idx + 1}</td>
                          <td className="px-4 py-3">{txn.drNo || '-'}</td>
                          <td className="px-4 py-3">{txn.particulars}</td>
                          <td className="px-4 py-3">{txn.date}</td>
                          <td className="px-4 py-3">₹{txn.amount}</td>
                          <td className="px-4 py-3">₹{txn.paid}</td>
                          <td className="px-4 py-3">₹{txn.balance}</td>
                          <td className="px-4 py-3">{txn.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Item Details Modal */}
      <ItemDetailsModal
        isOpen={showItemDetailsModal}
        onClose={() => setShowItemDetailsModal(false)}
        itemDetails={selectedItemDetails}
      />

      {/* Update Item Modal */}
      <ItemDetailsModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedItemForUpdate(null);
        }}
        itemDetails={selectedItemForUpdate}
        isUpdate={true}
        onSubmit={handleUpdateSubmit}
      />

      {/* Add Particular Modal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddParticularModal ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#2C3E50]">Add New Particular</h2>
              <p className="text-sm text-gray-600">Enter the name for the new particular. It will appear in the Material Flow list once it is added to the Daily Report.</p>
            </div>
            <button
              onClick={() => setShowAddParticularModal(false)}
              className="p-2 text-[#7C8CA1] hover:text-[#2C3E50] hover:bg-gray-50 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={e => {
            e.preventDefault();
            if (!newParticular.particulars.trim()) {
              showError('Please enter a particular name.');
              return;
            }
            // Add to allParticulars if not already present
            if (!allParticulars.some(p => p.particulars.toLowerCase() === newParticular.particulars.toLowerCase())) {
              setAllParticulars([
                ...allParticulars,
                { drNo: getNextDRNumber(), particulars: newParticular.particulars }
              ]);
            }
            setShowAddParticularModal(false);
            showSuccess('Particular name added! Now add it to the Daily Report to see full details.');
            setNewParticular({ ...newParticular, particulars: '' });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Particular Name</label>
              <input
                type="text"
                value={newParticular.particulars}
                onChange={e => setNewParticular({ ...newParticular, particulars: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
                required
                placeholder="Enter new particular name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddParticularModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
              >
                <XCircle size={16} />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#7BAFD4] hover:bg-[#6B9FD4] rounded-md flex items-center gap-2"
              >
                <Plus size={16} />
                Add Particular
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Inventory;
