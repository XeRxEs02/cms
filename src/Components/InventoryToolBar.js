import React from "react";
import { Search } from "lucide-react";
const InventoryToolBar = (props) => {
  const {
    items,
    setSearchResults,
    itemSelected,
    setShowItemModal,
    searchTerm,
    setSearchTerm,
    handleClear,
  } = props;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex gap-2  items-center">
          {/* <button className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2">
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
          </button> */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="rounded-md px-3 py-2 text-sm pl-10"
              value={searchTerm}
              onChange={(e) => {
                const term = e.target.value;
                setSearchTerm(term);
                const results = items.filter((item) =>
                  item.name.toLowerCase().includes(term.toLowerCase())
                );
                setSearchResults(results);
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
            onClick={() => setShowItemModal(true)} // Show modal on button click
          >
            Add Item
          </button>
          {itemSelected && (
            <button
              className="bg-gray-50 text-black text-sm font-semibold px-4 py-2 rounded"
              onClick={() => {
                handleClear();
              }}
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryToolBar;
