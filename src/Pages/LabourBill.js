import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { ReceiptIndianRupee, Search } from "lucide-react";
import AddLabourBillModal from "../Components/AddLabourBillModal";
const LabourBill = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const labourData = [
    {
      id: 1,
      date: "2023-10-01",
      barbender: "Column BarBending",
      headmanson: 1,
      manson: 1,
      mhelper: 1,
      whelper: 1,
      total: 4,
      extrapayment: 1000,
      remarks: "Extra work done",
    },
    {
      id: 2,
      date: "2023-10-02",
      barbender: "Column BarBending",
      headmanson: 1,
      manson: 1,
      mhelper: 2,
      whelper: 2,
      total: 6,
      extrapayment: 1500,
      remarks: "Extra work done",
    },
    {
      id: 3,
      date: "2023-10-03",
      barbender: "Concrete Work",
      headmanson: 4,
      manson: 2,
      mhelper: 2,
      whelper: 2,
      total: 10,
      extrapayment: 5000,
      remarks: "Concrete work done",
    },
  ];
  return (
    <>
      <Navbar currentPath={location.pathname} icon={ReceiptIndianRupee} />
      <div className="overflow-x-auto px-6 rounded-lg">
        <div className="flex justify-start items-center text-lg font-semibold text-gray-900 mb-3 mt-4">
          Labour Bill List [3]
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
            onClick={() => setShowModal(true)}
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
              Total
            </th>
            <th scope="col" className="px-4 py-3">
              Extra Payment
            </th>
            <th scope="col" className="px-4 py-3">
              Remarks
            </th>
          </thead>
          <tbody className="w-full bg-white divide-y divide-gray-200">
            {labourData.map((item) => (
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
                <td className="px-4 py-3 text-center">{item.total}</td>
                <td className="px-4 py-3 text-center">{item.extrapayment}</td>
                <td className="px-4 py-3">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <AddLabourBillModal setShowModal={setShowModal} />}
    </>
  );
};

export default LabourBill;
