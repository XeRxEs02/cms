import React, { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
const InventoryItems = (props) => {
  const { items, setItems, setSelectedItem, setItemSelected, selectedItem } =
    props;
  const { searchTerm, setSearchTerm, searchResults } = props;

  const [isPending, startTransition] = useTransition(); // Add useTransition

  const handleClear = () => {
    setSelectedItem({});
    setItemSelected(false);
  };

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="w-full text-left text-sm text-gray-600 border border-gray-200 rounded-md">
        <thead className="bg-gray-200 border-b border-gray-200">
          <tr className="font-semibold text-black">
            <th scope="col" className="px-4 py-3 w-16">
              No.
            </th>
            <th scope="col" className="px-4 py-3">
              Particulars
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(searchTerm ? searchResults : items).map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                setItemSelected(true);
              }}
            >
              <td className="px-4 py-3 font-semibold text-gray-900">
                {item.id}
              </td>
              <td className="px-4 py-3 justify-between flex items-center">
                <span className="flex-1">{item.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startTransition(() => {
                      const updatedItems = items
                        .filter((i) => i.id !== item.id) // Remove the item with the matching ID
                        .map((item, index) => ({ ...item, id: index + 1 })); // Reassign IDs sequentially
                      setItems(updatedItems);
                      if (selectedItem.id === item.id) {
                        handleClear();
                      }
                    });
                  }}
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPending && <p className="text-gray-500 text-sm">Updating...</p>}
    </div>
  );
};

export default InventoryItems;
