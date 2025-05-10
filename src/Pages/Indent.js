import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { BadgeInfo, X } from "lucide-react";

// General Information Modal Component
const AddGeneralInfoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    projectNo: "",
    labourContractor: "",
    address: "",
    totalBudget: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add General Information</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of Client
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project No.
              </label>
              <input
                type="text"
                name="projectNo"
                value={formData.projectNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Labour Contractor
              </label>
              <input
                type="text"
                name="labourContractor"
                value={formData.labourContractor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Budget
              </label>
              <input
                type="text"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Rate List Modal Component
const AddRateListModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    role: "",
    rate: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Rate List Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate
              </label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Indent = () => {
  const location = useLocation();

  // State for general information
  const [generalInfo, setGeneralInfo] = useState([
    ["Name Of Client", "Mr. Narendra Kori"],
    ["Project No.", "#MC02"],
    ["Labour Contractor", "Thippanna B"],
    ["Address", "Mahendra Enclave"],
    ["Total Budget", "10,00,000"],
  ]);

  // State for rate list
  const [rateList, setRateList] = useState([
    ["Head Mason", "800"],
    ["Mason", "800"],
    ["M - Helper", "600"],
    ["W - Helper", "400"],
    ["Column bartending", "13,200"],
  ]);

  // State for modals
  const [isGeneralInfoModalOpen, setIsGeneralInfoModalOpen] = useState(false);
  const [isRateListModalOpen, setIsRateListModalOpen] = useState(false);

  // Function to handle saving general information
  const handleSaveGeneralInfo = (data) => {
    const newGeneralInfo = [
      ["Name Of Client", data.clientName],
      ["Project No.", data.projectNo],
      ["Labour Contractor", data.labourContractor],
      ["Address", data.address],
      ["Total Budget", data.totalBudget],
    ];
    setGeneralInfo(newGeneralInfo);
  };

  // Function to handle saving rate list item
  const handleSaveRateList = (data) => {
    const newRateList = [...rateList, [data.role, data.rate]];
    setRateList(newRateList);
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={BadgeInfo} />
      <div className="p-6 max-w-4xl min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General Information Section */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2 bg-gray-200">
              <h2 className="font-semibold text-lg text-gray-900">
                General Information
              </h2>
              <button
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
                type="button"
                onClick={() => setIsGeneralInfoModalOpen(true)}
              >
                Add General Information
              </button>
            </div>

            <table className="w-full text-gray-700 text-sm">
              <tbody>
                {generalInfo.map(([label, value], index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 border-gray-200"
                  >
                    <td className="px-6 py-3 w-1/3">{label}</td>
                    <td className="px-6 py-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Rate List Section */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2 bg-gray-200">
              <h2 className="font-semibold text-lg text-gray-900">Rate List</h2>
              <button
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
                type="button"
                onClick={() => setIsRateListModalOpen(true)}
              >
                Add Rate List
              </button>
            </div>

            <table className="w-full text-gray-700 text-sm">
              <tbody>
                {rateList.map(([label, value], index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 border-gray-200"
                  >
                    <td className="px-6 py-3 w-1/3">{label}</td>
                    <td className="px-6 py-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {/* Modals */}
      <AddGeneralInfoModal
        isOpen={isGeneralInfoModalOpen}
        onClose={() => setIsGeneralInfoModalOpen(false)}
        onSave={handleSaveGeneralInfo}
      />

      <AddRateListModal
        isOpen={isRateListModalOpen}
        onClose={() => setIsRateListModalOpen(false)}
        onSave={handleSaveRateList}
      />
    </>
  );
};

export default Indent;
