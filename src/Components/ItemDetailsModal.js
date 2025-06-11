import React from "react";
import { X } from "lucide-react";

const ItemDetailsModal = ({ isOpen, onClose, itemDetails }) => {
  if (!isOpen || !itemDetails) return null;

  // Sort transactions by date (most recent first)
  const materialData = itemDetails.transactions ? [...itemDetails.transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#2C3E50]">{itemDetails.particulars}</h2>
            <p className="text-sm text-gray-600">Transaction History</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#7C8CA1] hover:text-[#2C3E50]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">DR. No.</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Amount</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Paid</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materialData.map((item, index) => (
                  <tr key={index} className="text-sm hover:bg-gray-50">
                    <td className="px-6 py-4 text-[#2C3E50]">{item.drNo || '-'}</td>
                    <td className="px-6 py-4 text-[#4A5568]">{item.date}</td>
                    <td className="px-6 py-4 text-[#2C3E50]">₹{item.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#2C3E50]">
                      {item.paid > 0 ? `₹${item.paid.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-[#2C3E50]">
                      {item.balance > 0 ? `₹${item.balance.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-[#7C8CA1]">{item.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-right font-semibold text-[#2C3E50]">
                    Total
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#2C3E50]">
                    ₹{itemDetails.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹{itemDetails.paid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-red-600">
                    ₹{itemDetails.balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal; 