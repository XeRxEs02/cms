import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { CreditCard, Edit, Save, DollarSign, Plus, X, Upload, Download } from "lucide-react";
import { useToast } from "../context/ToastContext";
import * as XLSX from 'xlsx';

const AddPaymentModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    particulars: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    paidThrough: "Cash",
    remarks: "-"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      no: String(Date.now()).slice(-2),
      ...formData,
      amount: parseInt(formData.amount)
    });
    onClose();
    setFormData({
      particulars: "",
      date: new Date().toISOString().split('T')[0],
      amount: "",
      paidThrough: "Cash",
      remarks: "-"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Payment Entry</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Particulars
            </label>
            <input
              type="text"
              value={formData.particulars}
              onChange={(e) => setFormData({ ...formData, particulars: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Installment - 6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paid Through
            </label>
            <select
              value={formData.paidThrough}
              onChange={(e) => setFormData({ ...formData, paidThrough: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional remarks"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

  // Calculate totals
  const totalAmount = paymentData.reduce((sum, item) => sum + item.amount, 0);
  const totalInstallments = "2 / 5";
  const paymentsDone = "4 L / 10 L";
  const paymentsDonePercent = 40;
  const expectedPaymentsPercent = 60;

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Handle adding new payment
  const handleAddPayment = (newPayment) => {
    setPaymentData([...paymentData, newPayment]);
    showSuccess("New payment entry added successfully!");
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      showInfo("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    // Here you would typically process the Excel file
    // For now, we'll just show a success message
    showSuccess("Payment plan uploaded successfully!");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet from payment data
      const ws = XLSX.utils.json_to_sheet(paymentData.map(item => ({
        'No.': item.no,
        'Particulars': item.particulars,
        'Date': item.date,
        'Amount': item.amount,
        'Paid Through': item.paidThrough,
        'Remarks': item.remarks
      })));

      // Add total row
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', '', '', totalAmount, '', '']
      ], { origin: -1 });

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No.
        { wch: 20 }, // Particulars
        { wch: 12 }, // Date
        { wch: 15 }, // Amount
        { wch: 15 }, // Paid Through
        { wch: 20 }  // Remarks
      ];

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Client Payments');

      // Generate Excel file
      XLSX.writeFile(wb, 'client_payments.xlsx');
      showSuccess('Payment data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={CreditCard} />
      <div className="p-4 sm:p-6 min-h-screen">
        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2">
                  <span className="text-lg font-semibold">{totalInstallments}</span>
                  <p className="text-sm text-gray-600">Total Installments</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2">
                  <span className="text-lg font-semibold">{paymentsDone}</span>
                  <p className="text-sm text-gray-600">Payments Done</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2">
                  <div className="relative w-full h-2 bg-gray-200 rounded">
                    <div 
                      className="absolute top-0 left-0 h-full bg-red-500 rounded" 
                      style={{ width: `${paymentsDonePercent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Payments Done %</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2">
                  <div className="relative w-full h-2 bg-gray-200 rounded">
                    <div 
                      className="absolute top-0 left-0 h-full bg-red-500 rounded" 
                      style={{ width: `${expectedPaymentsPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Expected Payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={18} />
            ADD PAYMENT
          </button>
          <button 
            onClick={handleExportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Download size={18} />
            EXPORT TO EXCEL
          </button>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <button 
            onClick={handleUploadClick}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
          >
            <Upload size={18} />
            UPLOAD PAYMENTS PLAN
          </button>
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
                  <td className="px-6 py-3 text-center">{formatNumber(totalAmount)}</td>
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
