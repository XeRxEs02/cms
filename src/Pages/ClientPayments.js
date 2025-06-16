import React, { useState, useRef, useMemo } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { CreditCard, Plus, X, Upload, Download, Wallet, CircleDollarSign, BarChart3, AlertCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import * as XLSX from 'xlsx';
import AddPaymentModal from "../Components/AddPaymentModal";

const ClientPayments = () => {
  const location = useLocation();
  const { showSuccess, showInfo } = useToast();
  const fileInputRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sample data to match the image
  const [paymentData, setPaymentData] = useState([
    {
      no: "01",
      particulars: "Installment - 1",
      date: "01/01/2025",
      amount: 200000,
      paidThrough: "Cash",
      remarks: "-"
    },
    {
      no: "02",
      particulars: "Installment - 2",
      date: "08/01/2025",
      amount: 200000,
      paidThrough: "Cheque",
      remarks: "-"
    }
  ]);

  // Calculate analytics data
  const analytics = useMemo(() => {
    // Calculate total amount and convert to Lakhs
    const totalAmount = paymentData.reduce((sum, item) => sum + item.amount, 0);
    const totalAmountInLakhs = (totalAmount / 100000).toFixed(1);

    // Project total expected amount (10L) and installments (5)
    const totalExpectedInLakhs = 10;
    const totalInstallmentsNeeded = 5;
    const currentInstallments = paymentData.length;

    // Calculate percentages
    const paymentsDonePercent = Math.round((totalAmountInLakhs / totalExpectedInLakhs) * 100);
    const expectedPaymentsPercent = Math.round(((totalExpectedInLakhs - totalAmountInLakhs) / totalExpectedInLakhs) * 100);

    // Monthly data for trends
    const monthlyData = paymentData.reduce((acc, payment) => {
      const date = new Date(payment.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          amount: 0,
          count: 0
        };
      }
      
      acc[monthYear].amount += payment.amount / 100000; // Convert to lakhs
      acc[monthYear].count += 1;
      
      return acc;
    }, {});

    return {
      totalInstallments: {
        current: currentInstallments,
        total: totalInstallmentsNeeded,
        display: `${currentInstallments} / ${totalInstallmentsNeeded}`
      },
      paymentsDone: {
        current: totalAmountInLakhs,
        total: totalExpectedInLakhs,
        display: `${totalAmountInLakhs} L / ${totalExpectedInLakhs} L`
      },
      percentages: {
        done: paymentsDonePercent,
        expected: expectedPaymentsPercent
      },
      monthlyTrends: Object.values(monthlyData)
    };
  }, [paymentData]);

  // Render circular progress
  const renderCircularProgress = (percentage, color = "#EF4444") => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2C3E50"
          strokeOpacity="0.3"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Render bar chart
  const renderBarChart = () => {
    if (!analytics.monthlyTrends || analytics.monthlyTrends.length === 0) {
      return <div className="flex items-center justify-center h-40 text-white">No data available</div>;
    }

    const maxValue = Math.max(
      ...analytics.monthlyTrends.map(data => Math.max(data.amount, data.amount))
    );

    return (
      <div className="flex h-40 items-end justify-between space-x-0.5 sm:space-x-1 px-1 sm:px-2 overflow-x-auto">
        {analytics.monthlyTrends.map((data, index) => {
          const amountHeight = `${(data.amount / maxValue) * 100}%`;
          const countHeight = `${(data.amount / maxValue) * 100}%`;

          return (
            <div key={index} className="flex flex-col items-center flex-shrink-0">
              <div className="flex space-x-0.5 sm:space-x-1">
                <div
                  className="w-2 sm:w-3 md:w-4 bg-red-500 rounded-t-sm"
                  style={{
                    height: amountHeight,
                    minHeight: '8px'
                  }}
                ></div>
                <div
                  className="w-2 sm:w-3 md:w-4 bg-red-400 rounded-t-sm"
                  style={{
                    height: countHeight,
                    minHeight: '8px'
                  }}
                ></div>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1 font-medium">{data.month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  // Handle adding new payment
  const handleAddPayment = (newPayment) => {
    const nextNo = (paymentData.length + 1).toString().padStart(2, '0');
    const paymentWithId = {
      ...newPayment,
      no: nextNo
    };
    setPaymentData([...paymentData, paymentWithId]);
    showSuccess("New payment entry added successfully!");
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      showInfo("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    showSuccess("Payment plan uploaded successfully!");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(paymentData.map(item => ({
        'No.': item.no,
        'Particulars': item.particulars,
        'Date': item.date,
        'Amount': item.amount,
        'Paid Through': item.paidThrough,
        'Remarks': item.remarks
      })));

      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', '', '', analytics.paymentsDone.current * 100000, '', '']
      ], { origin: -1 });

      ws['!cols'] = [
        { wch: 5 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Client Payments');

      XLSX.writeFile(wb, 'client_payments.xlsx');
      showSuccess('Payment data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={CreditCard} />
      <div className="p-4 sm:p-6 min-h-screen">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Installments Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xl font-semibold mb-1">
              {analytics.totalInstallments.display}
            </div>
            <div className="text-gray-600 text-sm">Total Installments</div>
          </div>

          {/* Payments Done Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xl font-semibold mb-1">
              {analytics.paymentsDone.display}
            </div>
            <div className="text-gray-600 text-sm">Payments Done</div>
          </div>

          {/* Payments Done % Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-1">
              <div className="relative w-full h-2 bg-gray-200 rounded">
                <div 
                  className="absolute top-0 left-0 h-full bg-red-500 rounded"
                  style={{ width: `${analytics.percentages.done}%` }}
                ></div>
              </div>
              <div className="ml-2 text-sm font-medium text-gray-700">
                {analytics.percentages.done}%
              </div>
            </div>
            <div className="text-gray-600 text-sm">Payments Done %</div>
          </div>

          {/* Expected Payments Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-1">
              <div className="relative w-full h-2 bg-gray-200 rounded">
                <div 
                  className="absolute top-0 left-0 h-full bg-red-500 rounded"
                  style={{ width: `${analytics.percentages.expected}%` }}
                ></div>
              </div>
              <div className="ml-2 text-sm font-medium text-gray-700">
                {analytics.percentages.expected}%
              </div>
            </div>
            <div className="text-gray-600 text-sm">Expected Payments</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center gap-2 min-w-[180px] justify-center"
          >
            <Plus size={18} />
            ADD PAYMENT
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 flex items-center gap-2 min-w-[180px] justify-center"
          >
            <Upload size={18} />
            UPLOAD PLAN
          </button>
          <button 
            onClick={handleExportToExcel}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center gap-2 min-w-[180px] justify-center"
          >
            <Download size={18} />
            EXPORT DATA
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-center">NO.</th>
                  <th className="px-6 py-3">Particulars</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-center">Amount</th>
                  <th className="px-6 py-3">Paid Through</th>
                  <th className="px-6 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((payment) => (
                  <tr key={payment.no} className="border-b">
                    <td className="px-6 py-3 text-center">{payment.no}</td>
                    <td className="px-6 py-3">{payment.particulars}</td>
                    <td className="px-6 py-3">{payment.date}</td>
                    <td className="px-6 py-3 text-center">{formatNumber(payment.amount)}</td>
                    <td className="px-6 py-3">{payment.paidThrough}</td>
                    <td className="px-6 py-3">{payment.remarks}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-3 text-center">Total</td>
                  <td></td>
                  <td></td>
                  <td className="px-6 py-3 text-center">{formatNumber(analytics.paymentsDone.current * 100000)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Payment Modal */}
        <AddPaymentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddPayment}
        />
      </div>
    </>
  );
};

export default ClientPayments;
