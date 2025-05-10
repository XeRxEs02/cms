import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import {
  Boxes,
  ChartColumnBig,
  ClipboardList,
  ArrowDownUp,
  Search,
  Trash2,
  BarChart3,
  CircleDollarSign,
  Wallet,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
} from "lucide-react";
import InventoryItems from "../Components/InventoryItems";
import InvemtoryItemDetails from "../Components/InventoryItemDetails";
import InventoryToolBar from "../Components/InventoryToolBar";
import InventoryItemToolBar from "../Components/InventoryItemToolBar";
import AddItemModal from "../Components/AddItemModal";
import AddItemDetailsModal from "../Components/AddItemDetailsModal";
const Inventory = () => {
  const location = useLocation();
  const [tabSelected, setTabSelected] = useState({
    currentTab: 1,
    noTabs: 2,
  });
  const [selectedItem, setSelectedItem] = useState([]);
  const [itemSelected, setItemSelected] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchItemTerm, setSearchItemTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchItemResults, setSearchItemResults] = useState([]);

  const [items, setItems] = useState([
    { id: 1, name: "Sand" },
    { id: 2, name: "Steel" },
    { id: 3, name: "Crushed Stones" },
    { id: 4, name: "Concrete Bricks" },
    { id: 5, name: "Fine Sand" },
  ]);

  // State to store item details data
  const [itemDetailsData, setItemDetailsData] = useState([
    {
      id: 1,
      drNo: 1,
      particulars: "Sand",
      date: "2023-10-01",
      amount: 1000,
      paid: 500,
      balance: 500,
      remarks: "Initial payment",
    },
    {
      id: 2,
      drNo: 2,
      particulars: "steel",
      date: "2023-10-02",
      amount: 2000,
      paid: 1000,
      balance: 1000,
      remarks: "Partial payment",
    },
    {
      id: 3,
      drNo: 3,
      particulars: "Sand",
      date: "2023-10-03",
      amount: 1500,
      paid: 1500,
      balance: 0,
      remarks: "Full payment",
    },
  ]);
  const wrapperRef = useRef(null);
  const handleClear = () => {
    setItemSelected(false);
    setSelectedItem([]);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 39) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        if (
          tabSelected.currentTab >= 1 &&
          tabSelected.currentTab < tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab + 1,
          });
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: 1,
          });
        }
      }
    }

    if (e.keyCode === 37) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        if (
          tabSelected.currentTab > 1 &&
          tabSelected.currentTab <= tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab - 1,
          });
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.noTabs,
          });
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Function to add new item details
  const handleAddItemDetails = (formData) => {
    // Create a new item with an ID
    const newItemDetails = {
      id: itemDetailsData.length + 1,
      drNo: parseInt(formData.drno),
      particulars: formData.particulars,
      date: formData.date,
      amount: parseFloat(formData.amount),
      paid: parseFloat(formData.paid),
      balance: parseFloat(formData.balance),
      remarks: formData.remarks
    };

    // Add the new item to the state
    setItemDetailsData([...itemDetailsData, newItemDetails]);
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newItemObject = { id: items.length + 1, name: newItem };
      setItems([...items, newItemObject]);
      setNewItem("");
      setShowItemModal(false);
    }
  };

  // Helper functions for Material Flow tab
  const calculateTotalAmount = () => {
    return itemDetailsData.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTotalPaid = () => {
    return itemDetailsData.reduce((total, item) => total + item.paid, 0);
  };

  const calculateTotalBalance = () => {
    return itemDetailsData.reduce((total, item) => total + item.balance, 0);
  };

  const calculatePaymentPercentage = () => {
    const totalAmount = calculateTotalAmount();
    const totalPaid = calculateTotalPaid();
    return totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
  };

  const calculateBalancePercentage = () => {
    const totalAmount = calculateTotalAmount();
    const totalBalance = calculateTotalBalance();
    return totalAmount > 0 ? Math.round((totalBalance / totalAmount) * 100) : 0;
  };

  const getItemCounts = () => {
    const itemCounts = {};
    itemDetailsData.forEach(item => {
      if (itemCounts[item.particulars]) {
        itemCounts[item.particulars]++;
      } else {
        itemCounts[item.particulars] = 1;
      }
    });
    return itemCounts;
  };

  const getMonthlyData = () => {
    const monthlyData = {};

    itemDetailsData.forEach(item => {
      const date = new Date(item.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          amount: 0,
          paid: 0,
          balance: 0
        };
      }

      monthlyData[monthYear].amount += item.amount;
      monthlyData[monthYear].paid += item.paid;
      monthlyData[monthYear].balance += item.balance;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));
  };

  // Function to render circular progress
  const renderCircularProgress = (percentage, color = "red") => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      red: "stroke-red-500",
      pink: "stroke-red-500", // Changed from pink-300 to red-500
      blue: "stroke-[#7BAFD4]",
    };

    return (
      <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
        <circle
          className="stroke-white fill-none opacity-30"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
        />
        <circle
          className={`fill-none ${colorClasses[color]}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
    );
  };

  // Function to render bar chart
  const renderBarChart = () => {
    const monthlyData = getMonthlyData();

    if (monthlyData.length === 0) {
      return <div className="text-white text-center py-10">No data available</div>;
    }

    const maxValue = Math.max(
      ...monthlyData.map(data => Math.max(data.amount, data.paid))
    );

    return (
      <div className="flex h-40 items-end justify-between space-x-0.5 sm:space-x-1 px-1 sm:px-2 overflow-x-auto">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-shrink-0">
            <div className="flex space-x-0.5 sm:space-x-1">
              <div
                className="w-2 sm:w-3 md:w-4 bg-red-500 rounded-t-sm"
                style={{
                  height: `${(data.amount / maxValue) * 100}%`,
                  minHeight: '8px'
                }}
              ></div>
              <div
                className="w-2 sm:w-3 md:w-4 bg-red-400 rounded-t-sm"
                style={{
                  height: `${(data.paid / maxValue) * 100}%`,
                  minHeight: '8px'
                }}
              ></div>
            </div>
            <div className="text-[10px] sm:text-xs text-white mt-1 font-medium">{data.month}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Boxes} />
      <section className="w-full px-2 sm:px-4 mx-0 sm:mx-2" aria-multiselectable="false">
        <ul
          className="flex items-center border-b border-slate-200"
          role="tablist"
          ref={wrapperRef}
        >
          <li className="flex-1" role="presentation">
            <button
              className={`-mb-px inline-flex h-10 sm:h-12 w-full items-center justify-center gap-1 sm:gap-2 whitespace-nowrap rounded-t border-b-2 px-2 sm:px-6 text-xs sm:text-sm font-medium tracking-wide transition duration-300 hover:bg-[#e6f0f5] hover:stroke-[#669BBC] focus:bg-[#e6f0f5] focus-visible:outline-none disabled:cursor-not-allowed ${tabSelected.currentTab === 1
                ? "border-[#669BBC] stroke-[#669BBC] text-black hover:border-[#5588aa] hover:text-[#5588aa] focus:border-[#447799] focus:stroke-[#447799] focus:text-[#447799] disabled:border-slate-500"
                : "justify-self-center border-transparent stroke-slate-700 text-black hover:border-[#669BBC] hover:text-[#669BBC] focus:border-[#5588aa] focus:stroke-[#5588aa] focus:text-[#5588aa] disabled:text-slate-500"
                }`}
              id="tab-label-1ai"
              role="tab"
              aria-setsize="3"
              aria-posinset="1"
              tabindex={`${tabSelected.currentTab === 1 ? "0" : "-1"}`}
              aria-controls="tab-panel-1ai"
              aria-selected={`${tabSelected.currentTab === 1 ? "true" : "false"
                }`}
              onClick={() => setTabSelected({ ...tabSelected, currentTab: 1 })}
            >
              <span className="order-2">Inventory List</span>
              <span className="relative only:-mx-6">
                <ClipboardList size={16} className="sm:w-5 sm:h-5" />
              </span>
            </button>
          </li>
          <li className="flex-1" role="presentation">
            <button
              className={`-mb-px inline-flex h-10 sm:h-12 w-full items-center justify-center gap-1 sm:gap-2 whitespace-nowrap rounded-t border-b-2 px-2 sm:px-6 text-xs sm:text-sm font-medium tracking-wide transition duration-300 hover:bg-[#e6f0f5] hover:stroke-[#669BBC] focus:bg-[#e6f0f5] focus-visible:outline-none disabled:cursor-not-allowed ${tabSelected.currentTab === 2
                ? "border-[#669BBC] stroke-[#669BBC] text-black hover:border-[#5588aa] hover:text-[#5588aa] focus:border-[#447799] focus:stroke-[#447799] focus:text-[#447799] disabled:border-slate-500"
                : "justify-self-center border-transparent stroke-slate-700 text-black hover:border-[#669BBC] hover:text-[#669BBC] focus:border-[#5588aa] focus:stroke-[#5588aa] focus:text-[#5588aa] disabled:text-slate-500"
                }`}
              id="tab-label-2ai"
              role="tab"
              aria-setsize="3"
              aria-posinset="2"
              tabindex={`${tabSelected.currentTab === 2 ? "0" : "-1"}`}
              aria-controls="tab-panel-2ai"
              aria-selected={`${tabSelected.currentTab === 2 ? "true" : "false"
                }`}
              onClick={() => setTabSelected({ ...tabSelected, currentTab: 2 })}
            >
              <span className="order-2">Material Flow</span>
              <ArrowDownUp size={16} className="sm:w-5 sm:h-5" />
            </button>
          </li>
        </ul>
        <div>
          <div
            className={`py-4 ${tabSelected.currentTab === 1 ? "" : "hidden"}`}
            id="tab-panel-1ai"
            aria-selected={`${tabSelected.currentTab === 1 ? "true" : "false"}`}
            role="tabpanel"
            aria-labelledby="tab-label-1ai"
            tabindex="-1"
          >
            <div className="max-w-4xl">
              <div className="flex items-center justify-between h-6 py-4">
                <h2 className="font-semibold text-gray-900 text-base sm:text-lg mb-4 truncate">
                  {itemSelected ? `Item: ${selectedItem.name}` : "Items"}
                </h2>
              </div>
              <div className="border-b mb-4" />
              {itemSelected ? (
                <InventoryItemToolBar
                  itemDetailsData={itemDetailsData}
                  setSearchItemResults={setSearchItemResults}
                  itemSelected={itemSelected}
                  setShowItemDetailsModal={setShowItemDetailsModal}
                  searchItemTerm={searchItemTerm}
                  setSearchItemTerm={setSearchItemTerm}
                  handleClear={handleClear}
                />
              ) : (
                <InventoryToolBar
                  items={items}
                  setSearchResults={setSearchResults}
                  itemSelected={itemSelected}
                  setShowItemModal={setShowItemModal}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  handleClear={handleClear}
                />
              )}

              {itemSelected ? (
                <InvemtoryItemDetails
                  itemDetailsData={itemDetailsData}
                  setSearchItemTerm={setSearchItemTerm}
                  searchItemTerm={searchItemTerm}
                  searchItemResults={searchItemResults}
                />
              ) : (
                <InventoryItems
                  items={items}
                  setItems={setItems}
                  setSelectedItem={setSelectedItem}
                  setItemSelected={setItemSelected}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchResults={searchResults}
                  selectedItem={selectedItem}
                />
              )}

              {showItemModal && (
                <AddItemModal
                  setShowItemModal={setShowItemModal}
                  handleAddItem={handleAddItem}
                  newItem={newItem}
                  setNewItem={setNewItem}
                />
              )}

              {showItemDetailsModal && (
                <AddItemDetailsModal
                  setShowItemDetailsModal={setShowItemDetailsModal}
                  handleAddItemDetails={handleAddItemDetails}
                  selectedItem={selectedItem}
                />
              )}
            </div>
          </div>
          <div
            className={`py-4 ${tabSelected.currentTab === 2 ? "" : "hidden"}`}
            id="tab-panel-2ai"
            aria-selected={`${tabSelected.currentTab === 2 ? "true" : "false"}`}
            role="tabpanel"
            aria-labelledby="tab-label-2ai"
            tabindex="-1"
          >
            <div className="p-3 sm:p-4 md:p-6 bg-white">
              {/* Top row of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Amount Card */}
                <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="mt-8 ml-2">
                      <div className="text-lg sm:text-xl font-bold">
                        ₹ {calculateTotalAmount().toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Total Amount</div>
                    </div>
                    <div className="bg-white p-2 rounded-md mt-6 mr-2">
                      <Wallet size={20} className="sm:w-6 sm:h-6 text-black" />
                    </div>
                  </div>
                </div>

                {/* Total Paid Card */}
                <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="mt-8 ml-2">
                      <div className="text-lg sm:text-xl font-bold">
                        ₹ {calculateTotalPaid().toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Total Paid</div>
                    </div>
                    <div className="bg-white p-2 rounded-md mt-6 mr-2">
                      <CircleDollarSign size={20} className="sm:w-6 sm:h-6 text-black" />
                    </div>
                  </div>
                </div>

                {/* Payment Percentage Card */}
                <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="mt-8 ml-2">
                      <div className="text-lg sm:text-xl font-bold text-red-500">
                        {calculatePaymentPercentage()}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[120px]">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: `${calculatePaymentPercentage()}%` }}
                        ></div>
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base font-medium">Payment Done %</div>
                    </div>
                    <div className="bg-white p-2 rounded-md mt-6 mr-2">
                      <BarChart3 size={20} className="sm:w-6 sm:h-6 text-black" />
                    </div>
                  </div>
                </div>

                {/* Balance Card */}
                <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="mt-8 ml-2">
                      <div className="text-lg sm:text-xl font-bold text-red-500">
                        ₹ {calculateTotalBalance().toLocaleString()}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[120px]">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: `${calculateBalancePercentage()}%` }}
                        ></div>
                      </div>
                      <div className="text-gray-600 text-sm sm:text-base font-medium">Balance</div>
                    </div>
                    <div className="bg-white p-2 rounded-md mt-6 mr-2">
                      <AlertCircle size={20} className="sm:w-6 sm:h-6 text-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Item Distribution Chart */}
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                  <div className="text-white font-medium mb-4">Item Distribution</div>
                  <div className="flex justify-center my-3">
                    {renderCircularProgress(calculatePaymentPercentage(), "pink")}
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center text-white">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Total Items: {itemDetailsData.length}</span>
                    </div>
                    <div className="flex items-center text-white mt-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <span>Unique Items: {Object.keys(getItemCounts()).length}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Stats */}
                <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                  <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                    <div className="text-white text-sm mb-2">Payment Status</div>
                    <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                      {calculateTotalPaid().toLocaleString()} / {calculateTotalAmount().toLocaleString()}
                    </div>
                    <div className="flex justify-center my-2">
                      {renderCircularProgress(calculatePaymentPercentage(), "pink")}
                    </div>
                  </div>
                  <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                    <div className="text-white text-sm mb-2">Payment Percentage</div>
                    <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                      {calculatePaymentPercentage()}%
                    </div>
                    <div className="flex justify-center my-2">
                      {renderCircularProgress(calculatePaymentPercentage(), "pink")}
                    </div>
                  </div>
                </div>

                {/* Balance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                  <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                    <div className="text-white text-sm mb-2">Balance Status</div>
                    <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                      {calculateTotalBalance().toLocaleString()} / {calculateTotalAmount().toLocaleString()}
                    </div>
                    <div className="flex justify-center my-2">
                      {renderCircularProgress(calculateBalancePercentage(), "pink")}
                    </div>
                  </div>
                  <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                    <div className="text-white text-sm mb-2">Balance Percentage</div>
                    <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">
                      {calculateBalancePercentage()}%
                    </div>
                    <div className="flex justify-center my-2">
                      {renderCircularProgress(calculateBalancePercentage(), "pink")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom row - Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bar Chart */}
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-white text-xs sm:text-sm">Total Amount</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                        <span className="text-white text-xs sm:text-sm">Paid Amount</span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    {renderBarChart()}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-[#7BAFD4] rounded-md p-4 shadow">
                  <div className="text-white font-medium mb-4">Recent Transactions</div>
                  <div className="overflow-x-auto">
                    <div className="overflow-y-auto max-h-40">
                      <table className="w-full text-white text-xs sm:text-sm">
                        <thead className="text-xs uppercase">
                          <tr>
                            <th className="py-2 text-left">Date</th>
                            <th className="py-2 text-left">Item</th>
                            <th className="py-2 text-right">Amount</th>
                            <th className="py-2 text-right">Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemDetailsData.slice(-5).map((item, index) => (
                            <tr key={index} className="border-t border-white/10">
                              <td className="py-2">{item.date}</td>
                              <td className="py-2">{item.particulars}</td>
                              <td className="py-2 text-right">₹{item.amount}</td>
                              <td className="py-2 text-right">₹{item.paid}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Inventory;
