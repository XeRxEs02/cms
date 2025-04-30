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

  const sandData = [
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
  ];

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newItemObject = { id: items.length + 1, name: newItem };
      setItems([...items, newItemObject]);
      setNewItem("");
      setShowItemModal(false);
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Boxes} />
      <section className="w-full px-4 mx-2" aria-multiselectable="false">
        <ul
          className="flex items-center border-b border-slate-200"
          role="tablist"
          ref={wrapperRef}
        >
          <li className="" role="presentation">
            <button
              className={`-mb-px inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-[#e6f0f5] hover:stroke-[#669BBC] focus:bg-[#e6f0f5] focus-visible:outline-none disabled:cursor-not-allowed ${
                tabSelected.currentTab === 1
                  ? "border-[#669BBC] stroke-[#669BBC] text-black hover:border-[#5588aa] hover:text-[#5588aa] focus:border-[#447799] focus:stroke-[#447799] focus:text-[#447799] disabled:border-slate-500"
                  : "justify-self-center border-transparent stroke-slate-700 text-black hover:border-[#669BBC] hover:text-[#669BBC] focus:border-[#5588aa] focus:stroke-[#5588aa] focus:text-[#5588aa] disabled:text-slate-500"
              }`}
              id="tab-label-1ai"
              role="tab"
              aria-setsize="3"
              aria-posinset="1"
              tabindex={`${tabSelected.currentTab === 1 ? "0" : "-1"}`}
              aria-controls="tab-panel-1ai"
              aria-selected={`${
                tabSelected.currentTab === 1 ? "true" : "false"
              }`}
              onClick={() => setTabSelected({ ...tabSelected, currentTab: 1 })}
            >
              <span className="order-2 ">Inventory List</span>
              <span className="relative only:-mx-6">
                <ClipboardList />
              </span>
            </button>
          </li>
          <li className="" role="presentation">
            <button
              className={`-mb-px inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-[#e6f0f5] hover:stroke-[#669BBC] focus:bg-[#e6f0f5] focus-visible:outline-none disabled:cursor-not-allowed ${
                tabSelected.currentTab === 2
                  ? "border-[#669BBC] stroke-[#669BBC] text-black hover:border-[#5588aa] hover:text-[#5588aa] focus:border-[#447799] focus:stroke-[#447799] focus:text-[#447799] disabled:border-slate-500"
                  : "justify-self-center border-transparent stroke-slate-700 text-black hover:border-[#669BBC] hover:text-[#669BBC] focus:border-[#5588aa] focus:stroke-[#5588aa] focus:text-[#5588aa] disabled:text-slate-500"
              }`}
              id="tab-label-2ai"
              role="tab"
              aria-setsize="3"
              aria-posinset="2"
              tabindex={`${tabSelected.currentTab === 2 ? "0" : "-1"}`}
              aria-controls="tab-panel-2ai"
              aria-selected={`${
                tabSelected.currentTab === 2 ? "true" : "false"
              }`}
              onClick={() => setTabSelected({ ...tabSelected, currentTab: 2 })}
            >
              <span className="order-2 ">Material Flow</span>
              <ArrowDownUp />
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
                <h2 className="font-semibold text-gray-900 text-lg mb-4">
                  {itemSelected ? `Item: ${selectedItem.name}` : "Items"}
                </h2>
              </div>
              <div className="border-b mb-4" />
              {itemSelected ? (
                <InventoryItemToolBar
                  sandData={sandData}
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
                  sandData={sandData}
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
                  handleAddItem={handleAddItem}
                  newItem={newItem}
                  setNewItem={setNewItem}
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
            <p>
              One must be entirely sensitive to the structure of the material
              that one is handling. One must yield to it in tiny details of
              execution, perhaps the handling of the surface or grain, and one
              must master it as a whole.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Inventory;
