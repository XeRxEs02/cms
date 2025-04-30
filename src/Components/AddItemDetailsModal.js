import React, { useState } from "react";

const AddItemDetailsModal = (props) => {
  const { setShowItemDetailsModal, handleAddItem, newItem, setNewItem } = props;
  const [formData, setFormData] = useState({
    drno: "",
    particulars: "",
    date: "",
    amount: "",
    balance: "",
    paid: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setShowItemDetailsModal(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center min-h-screen p-4 z-50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-md w-full max-w-xs p-6 relative"
      >
        <h2
          id="modal-title"
          className="font-semibold text-xl text-black mb-1 leading-tight"
        >
          Add Data
        </h2>
        <p className="text-sm text-gray-600 mb-5 leading-tight">
          Fill in the details below to add new data to the system.
        </p>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Dr. No", name: "drno", type: "text" },
            { label: "Particulars", name: "particulars", type: "text" },
            { label: "Amount", name: "amount", type: "text" },
            { label: "Balance", name: "balance", type: "text" },
            { label: "Paid", name: "paid", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="mb-3 flex items-center">
              <label
                htmlFor={name}
                className="font-semibold text-black w-[70px] flex-shrink-0 mr-4"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          ))}

          <div className="mb-3 flex items-center">
            <label
              htmlFor="date"
              className="font-semibold text-black w-[70px] flex-shrink-0"
            >
              Date
            </label>
            <div className="relative w-full">
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]">
                📅
              </span> */}
            </div>
          </div>
          <div className="mb-4 flex items-start">
            <label
              htmlFor="remarks"
              className="font-semibold text-black w-[70px] flex-shrink-0 pt-1"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows="3"
              value={formData.remarks}
              onChange={handleChange}
              className="border border-gray-300 rounded-md text-[13px] px-3 py-1 w-full resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              onClick={() => setShowItemDetailsModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemDetailsModal;
