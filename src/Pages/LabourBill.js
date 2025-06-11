import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { ReceiptIndianRupee, Search, Users, Download } from "lucide-react";
import AddLabourBillModal from "../Components/AddLabourBillModal";
import { useToast } from "../context/ToastContext";
import { useLabour } from "../context/LabourContext";
import * as XLSX from 'xlsx';

const LabourBill = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { showInfo, showSuccess } = useToast();
  const { weeklyLabourData, setWeeklyLabourData, nextId, setNextId } = useLabour();
  
  // Combine context data with local data for display
  const [localLabourData, setLocalLabourData] = useState([]);

  // Combine local and context data
  const allLabourData = [...localLabourData, ...weeklyLabourData];

  // Function to add a new labour bill
  const addLabourBill = (newBill) => {
    // Create a new bill with an ID
    const billWithId = {
      ...newBill,
      id: nextId
    };

    // Add the new bill to the local state
    setLocalLabourData([...localLabourData, billWithId]);
    setNextId(prev => prev + 1);
    showSuccess(`Labour bill added successfully! Total: ₹${billWithId.amount + billWithId.extrapayment}`);
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet from labour bill data
      const ws = XLSX.utils.json_to_sheet(allLabourData.map(item => ({
        'No.': item.id,
        'Date': item.date,
        'Bar Bender': item.barbender,
        'Head Manson': item.headmanson,
        'Manson': item.manson,
        'M-Helper': item.mhelper,
        'W-Helper': item.whelper,
        'Amount': item.amount || 0,
        'Extra Payment': item.extrapayment || 0,
        'Total Payment': (item.amount || 0) + (item.extrapayment || 0),
        'Source': item.weekNumber ? `Week ${item.weekNumber} - ${item.day || 'Daily'}` : 'Manual Entry',
        'Remarks': item.remarks || '-'
      })));

      // Add total row
      const totalAmount = allLabourData.reduce((sum, item) => sum + (item.amount || 0) + (item.extrapayment || 0), 0);
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', '', '', '', '', '', '', '', '', totalAmount, '', '']
      ], { origin: -1 });

      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No.
        { wch: 12 }, // Date
        { wch: 12 }, // Bar Bender
        { wch: 12 }, // Head Manson
        { wch: 12 }, // Manson
        { wch: 12 }, // M-Helper
        { wch: 12 }, // W-Helper
        { wch: 15 }, // Amount
        { wch: 15 }, // Extra Payment
        { wch: 15 }, // Total Payment
        { wch: 20 }, // Source
        { wch: 20 }  // Remarks
      ];

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Labour Bills');

      // Generate Excel file
      XLSX.writeFile(wb, 'labour_bills.xlsx');
      showSuccess('Labour bill data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Users} />
      <div className="p-4 sm:p-6 min-h-screen">
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={handleExportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Download size={18} />
            EXPORT TO EXCEL
          </button>
        </div>

        <div className="overflow-x-auto px-6 rounded-lg">
          <div className="flex justify-start items-center text-lg font-semibold text-gray-900 mb-3 mt-4">
            Labour Bill List [{allLabourData.length}]
          </div>
          <div className="flex flex-wrap justify-between items-center mb-3">
            <div className="flex gap-2 items-center">
              <button className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm font-semibold flex text-gray-700 items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
                  />
                </svg>
                Filter
              </button>
              <div className="relative">
                <input
                  tyep="text"
                  placeholder="Search"
                  className="rounded-md px-3 py-2 text-sm pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <button
              className="flex items-center px-4 py-3 bg-red-600 text-white text-sm rounded-md font-semibold"
              onClick={() => {
                setShowModal(true);
                showInfo("Add Labour Bill modal opened. Enter labour details to create a new bill.");
              }}
            >
              ADD
            </button>
          </div>
          <table className="w-full text-left text-sm text-black rounded-md  overflow-hidden">
            <thead className="bg-gray-200 border-b border-gray-200">
              <th scope="col" className="px-4 py-3 w-16">
                No.
              </th>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
              <th scope="col" className="px-4 py-3">
                Bar Bender
              </th>
              <th scope="col" className="px-4 py-3">
                Head manson
              </th>
              <th scope="col" className="px-4 py-3">
                Manson
              </th>
              <th scope="col" className="px-4 py-3">
                M-Helper
              </th>
              <th scope="col" className="px-4 py-3">
                W-Helper
              </th>
              <th scope="col" className="px-4 py-3">
                Amount (₹)
              </th>
              <th scope="col" className="px-4 py-3">
                Extra Payment
              </th>
              <th scope="col" className="px-4 py-3">
                Total Payment
              </th>
              <th scope="col" className="px-4 py-3">
                Source
              </th>
              <th scope="col" className="px-4 py-3">
                Remarks
              </th>
            </thead>
            <tbody className="w-full bg-white divide-y divide-gray-200">
              {allLabourData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-gray-800"
                >
                  <td className="px-4 py-3 font-semibold ">{item.id}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.barbender}</td>
                  <td className="px-4 py-3 text-center">{item.headmanson}</td>
                  <td className="px-4 py-3 text-center">{item.manson}</td>
                  <td className="px-4 py-3 text-center">{item.mhelper}</td>
                  <td className="px-4 py-3 text-center">{item.whelper}</td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">₹{item.amount || 0}</td>
                  <td className="px-4 py-3 text-center">₹{item.extrapayment || 0}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600">₹{(item.amount || 0) + (item.extrapayment || 0)}</td>
                  <td className="px-4 py-3 text-center">
                    {item.weekNumber ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Week {item.weekNumber} - {item.day || 'Daily'}
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        Manual Entry
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <AddLabourBillModal setShowModal={setShowModal} addLabourBill={addLabourBill} />}
    </>
  );
};

export default LabourBill;
