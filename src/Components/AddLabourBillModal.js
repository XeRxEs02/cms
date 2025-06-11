import React, { useState } from "react";
import { useLabour } from "../context/LabourContext";
import { useToast } from "../context/ToastContext";

const AddLabourBillModal = ({ setShowModal, addLabourBill }) => {
  const { calculateDailyAmount } = useLabour();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    date: "",
    barbender: "",
    headmanson: 0,
    manson: 0,
    mhelper: 0,
    whelper: 0,
    amount: 0,
    extrapayment: 0,
    remarks: "",
  });

  // Calculate totals when staff numbers change
  const handleStaffChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const updatedData = { ...formData, [field]: numValue };

    // Calculate amount based on rates
    const calculatedAmount = calculateDailyAmount(
      updatedData.headmanson,
      updatedData.manson,
      updatedData.mhelper,
      updatedData.whelper
    );

    setFormData({
      ...updatedData,
      amount: calculatedAmount
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.date || !formData.barbender) {
      showError("Please fill in all required fields.");
      return;
    }

    if (formData.headmanson === 0 && formData.manson === 0 && formData.mhelper === 0 && formData.whelper === 0) {
      showError("Please add at least one staff member.");
      return;
    }

    // Add the new labour bill
    addLabourBill(formData);
    showSuccess(`Labour bill added successfully! Total amount: ₹${formData.amount + formData.extrapayment}`);

    // Close the modal
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center min-h-screen z-50">
      <div className="bg-white rounded-md w-full max-w-md p-6 mx-4 sm:mx-6 lg:mx-8 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <h2 className="font-semibold text-xl text-black mb-2">
          Add Labour Bill
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Fill in the details to add a new labour bill.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Work Type *
            </label>
            <select
              value={formData.barbender}
              onChange={(e) => handleInputChange('barbender', e.target.value)}
              className="w-full border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select Work Type</option>
              <option value="Column BarBending">Column BarBending</option>
              <option value="Beam BarBending">Beam BarBending</option>
              <option value="Slab BarBending">Slab BarBending</option>
              <option value="Concrete Work">Concrete Work</option>
              <option value="Masonry Work">Masonry Work</option>
              <option value="General Construction">General Construction</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Head Mason (₹800/day)
              </label>
              <input
                type="number"
                min="0"
                value={formData.headmanson}
                onChange={(e) => handleStaffChange('headmanson', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mason (₹800/day)
              </label>
              <input
                type="number"
                min="0"
                value={formData.manson}
                onChange={(e) => handleStaffChange('manson', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                M-Helper (₹600/day)
              </label>
              <input
                type="number"
                min="0"
                value={formData.mhelper}
                onChange={(e) => handleStaffChange('mhelper', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                W-Helper (₹400/day)
              </label>
              <input
                type="number"
                min="0"
                value={formData.whelper}
                onChange={(e) => handleStaffChange('whelper', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Calculated Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Extra Payment (₹)
            </label>
            <input
              type="number"
              min="0"
              value={formData.extrapayment}
              onChange={(e) => handleInputChange('extrapayment', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Additional payment if any"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Additional notes or comments"
              rows="2"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Add Labour Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLabourBillModal;
