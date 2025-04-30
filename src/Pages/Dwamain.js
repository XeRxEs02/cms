import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  BriefcaseBusiness,
  Boxes,
  ReceiptIndianRupee,
  FolderKanban,
  Search,
} from "lucide-react";

const Dwamain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const data = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    dwa: `DWA-95840${i + 30}`,
  }));
  const filteredData = data.filter((item) =>
    item.dwa.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={BriefcaseBusiness} />
      <div className="flex-1 px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">
            DWA LISTING [{filteredData?.length}]
          </h1>
          <div className="relative">
            <input
              type="text"
              className="border rounded-full pl-10 pr-4 py-2"
              placeholder="DWA Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="border-b border-gray-300 mb-4">
          <ul className="flex">
            <li className="mr-4">
              <div className="inline-block py-2 px-4 text-red-600 border-b-2 border-red-600">
                Actions
              </div>
            </li>
            <li>
              <div className="inline-block py-2 px-4 text-gray-600">
                Dashboard
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">NO.</th>
                <th className="py-2">DWA</th>
                <th className="py-2">INDENT</th>
                <th className="py-2">INVENTORY</th>
                <th className="py-2">BILLING</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-gray-50 border-b" : ""}
                >
                  <td className="py-2">
                    {item.id < 10 ? `0${item.id}` : item.id}
                  </td>
                  <td className="py-2 text-red-500">{item.dwa}</td>
                  <td className="py-2">
                    <button className="border border-red-500 text-red-500 px-4 py-1 gap-2 rounded flex items-center">
                      <FolderKanban /> INDENT
                    </button>
                  </td>
                  <td className="py-2">
                    <button
                      className="border border-red-500 text-red-500 px-4 py-1 gap-2 rounded flex items-center"
                      onClick={() => navigate("/app/dwa/wo")}
                    >
                      <Boxes /> INVENTORY
                    </button>
                  </td>
                  <td className="py-2">
                    <button className="border border-red-500 text-red-500 px-4 py-1 gap-2 rounded flex items-center">
                      <ReceiptIndianRupee /> BILLING
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex space-x-2"}
              activeClassName={"bg-red-500 text-white px-3 py-1 rounded"}
              pageClassName={"px-3 py-1 bg-gray-200 rounded cursor-pointer"}
              previousClassName={"px-3 py-1 bg-gray-300 rounded cursor-pointer"}
              nextClassName={"px-3 py-1 bg-gray-300 rounded cursor-pointer"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dwamain;
