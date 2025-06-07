import React from "react";
import { X } from "lucide-react";

const ItemDetailsModal = ({ isOpen, onClose, itemDetails }) => {
  if (!isOpen || !itemDetails) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Sample data for the material list - in a real app, this would come from props or API
  const materialData = [
    {
      no: "01",
      drNo: itemDetails.drNo.toString().padStart(2, '0'),
      particulars: itemDetails.particulars,
      date: formatDate(itemDetails.usageDate),
      amount: itemDetails.amount,
      paid: itemDetails.paid,
      balance: itemDetails.balance,
      remarks: itemDetails.remarks || "-"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Item Info */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Particulars</h3>
                <p className="text-lg font-semibold text-gray-900">{itemDetails.particulars}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">DR. No</h3>
                <p className="text-lg font-semibold text-gray-900">#{itemDetails.drNo}</p>
              </div>
            </div>
          </div>

          {/* Material List */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-200 border-b border-gray-300">
                  <tr className="font-semibold text-gray-900">
                    <th scope="col" className="px-3 py-3 text-center">NO.</th>
                    <th scope="col" className="px-3 py-3 text-center">DR. No</th>
                    <th scope="col" className="px-3 py-3 text-center">Particulars</th>
                    <th scope="col" className="px-3 py-3 text-center">Date</th>
                    <th scope="col" className="px-3 py-3 text-center">Amount</th>
                    <th scope="col" className="px-3 py-3 text-center">Paid</th>
                    <th scope="col" className="px-3 py-3 text-center">Balance</th>
                    <th scope="col" className="px-3 py-3 text-center">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {materialData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-3 py-3 text-center font-medium">{item.no}</td>
                      <td className="px-3 py-3 text-center">{item.drNo}</td>
                      <td className="px-3 py-3 text-center text-red-600 font-medium">{item.particulars}</td>
                      <td className="px-3 py-3 text-center">{item.date}</td>
                      <td className="px-3 py-3 text-center font-medium">{item.amount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-center font-medium">{item.paid > 0 ? item.paid.toLocaleString() : "-"}</td>
                      <td className="px-3 py-3 text-center font-medium">{item.balance > 0 ? item.balance.toLocaleString() : "-"}</td>
                      <td className="px-3 py-3 text-center">{item.remarks}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="border-t-2 border-gray-400 bg-gray-50">
                    <td className="px-3 py-3 text-center font-bold text-red-600">Total</td>
                    <td className="px-3 py-3"></td>
                    <td className="px-3 py-3"></td>
                    <td className="px-3 py-3"></td>
                    <td className="px-3 py-3 text-center font-bold text-red-600">{itemDetails.amount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-center font-bold text-red-600">{itemDetails.paid > 0 ? itemDetails.paid.toLocaleString() : "-"}</td>
                    <td className="px-3 py-3 text-center font-bold text-red-600">{itemDetails.balance > 0 ? itemDetails.balance.toLocaleString() : "-"}</td>
                    <td className="px-3 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Additional Info Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Date:</span>
                    <span className="font-medium">{formatDate(itemDetails.usageDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity Left:</span>
                    <span className="font-medium">{itemDetails.quantityLeft} units</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Status</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="font-medium">{formatDate(itemDetails.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${
                      itemDetails.balance === 0 ? "text-green-600" :
                      itemDetails.paid > 0 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {itemDetails.balance === 0 ? "Fully Paid" :
                       itemDetails.paid > 0 ? "Partially Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal; 