import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Navbar from "../Components/Navbar";
import { useToast } from "../context/ToastContext";

const AddClientPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useToast();
  
  const [formData, setFormData] = useState({
    particulars: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    remarks: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically save the data to your backend
    // For now, we'll just show a success message and navigate back
    showSuccess("Payment entry added successfully!");
    navigate("/app/clientpayments");
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={CreditCard} />
      <div className="p-4 sm:p-6 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Payment Entry</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Particulars *
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
                  Date *
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
                  Amount (₹) *
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
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes or comments"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/app/clientpayments")}
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
      </div>
    </>
  );
};

export default AddClientPayment; 