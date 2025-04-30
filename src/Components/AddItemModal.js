import React from "react";

const AddItemModal = (props) => {
  const { setShowItemModal, handleAddItem, newItem, setNewItem } = props;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
        <input
          type="text"
          className="border rounded w-full px-3 py-2 mb-4"
          placeholder="Enter item name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddItem();
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={() => setShowItemModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleAddItem}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
