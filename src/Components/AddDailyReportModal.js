import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AddDailyReportModal = ({ isOpen, onClose, onAdd }) => {
  const { appData } = useAppContext();
  const [formData, setFormData] = useState({
    particulars: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paid: '',
    unit: '',
    quantity: '1',
    remarks: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const balance = Number(formData.amount) - Number(formData.paid);
    onAdd({
      ...formData,
      amount: Number(formData.amount),
      paid: Number(formData.paid),
      balance,
      quantity: Number(formData.quantity)
    });
    
    // Reset form
    setFormData({
      particulars: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      paid: '',
      unit: '',
      quantity: '1',
      remarks: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#2C3E50]">Add Daily Report Entry</h2>
          <button
            onClick={onClose}
            className="text-[#7C8CA1] hover:text-[#2C3E50]"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Particulars*
              </label>
              <input
                type="text"
                name="particulars"
                value={formData.particulars}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Date*
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Amount (₹)*
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Paid Amount (₹)*
              </label>
              <input
                type="number"
                name="paid"
                value={formData.paid}
                onChange={handleChange}
                required
                min="0"
                max={formData.amount}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#7C8CA1] hover:text-[#2C3E50]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#7BAFD4] text-white rounded-lg hover:bg-[#6B9FD4] transition-colors"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDailyReportModal; 