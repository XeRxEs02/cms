import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { BadgeInfo, X } from "lucide-react";
import { useToast } from "../context/ToastContext";

// General Information Modal Component
const AddGeneralInfoModal = ({ isOpen, onClose, onSave }) => {
  const { showSuccess, showError, showInfo } = useToast();

  // Predefined clients with their associated information
  const predefinedClients = {
    "Mr. Narendra Kori": {
      projectNo: "#MC02",
      labourContractor: "Thippanna B",
      address: "Mahendra Enclave",
      totalBudget: "10,00,000"
    },
    "Mrs. Priya Sharma": {
      projectNo: "#PS03",
      labourContractor: "Rajesh Kumar",
      address: "Green Valley Apartments",
      totalBudget: "15,00,000"
    },
    "Mr. Amit Patel": {
      projectNo: "#AP04",
      labourContractor: "Suresh Reddy",
      address: "Sunrise Residency",
      totalBudget: "12,50,000"
    },
    "Dr. Kavitha Rao": {
      projectNo: "#KR05",
      labourContractor: "Venkatesh Naidu",
      address: "Medical Complex Plaza",
      totalBudget: "20,00,000"
    },
    "Mr. Ravi Kumar": {
      projectNo: "#RK06",
      labourContractor: "Mohan Singh",
      address: "Tech Park Avenue",
      totalBudget: "18,75,000"
    }
  };

  const [formData, setFormData] = useState({
    clientName: "",
    projectNo: "",
    labourContractor: "",
    address: "",
    totalBudget: ""
  });

  const handleClientChange = (e) => {
    const selectedClient = e.target.value;
    const clientData = predefinedClients[selectedClient];

    if (clientData) {
      setFormData({
        clientName: selectedClient,
        projectNo: clientData.projectNo,
        labourContractor: clientData.labourContractor,
        address: clientData.address,
        totalBudget: clientData.totalBudget
      });

      showInfo(`Client details for "${selectedClient}" auto-filled successfully!`);
    } else {
      setFormData({
        clientName: selectedClient,
        projectNo: "",
        labourContractor: "",
        address: "",
        totalBudget: ""
      });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.projectNo || !formData.labourContractor || !formData.address || !formData.totalBudget) {
      showError("Please fill in all required fields.");
      return;
    }

    onSave(formData);
    showSuccess(`General information for "${formData.clientName}" saved successfully!`);

    // Reset form
    setFormData({
      clientName: "",
      projectNo: "",
      labourContractor: "",
      address: "",
      totalBudget: ""
    });
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
                Name of Client *
              </label>
              <select
                name="clientName"
                value={formData.clientName}
                onChange={handleClientChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select a client</option>
                {Object.keys(predefinedClients).map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project No. *
              </label>
              <input
                type="text"
                name="projectNo"
                value={formData.projectNo}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Project number will be auto-filled when client is selected"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Labour Contractor *
              </label>
              <input
                type="text"
                name="labourContractor"
                value={formData.labourContractor}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Labour contractor will be auto-filled when client is selected"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Address will be auto-filled when client is selected"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Budget (₹) *
              </label>
              <input
                type="text"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Budget will be auto-filled when client is selected"
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
  const { showSuccess, showError, showInfo } = useToast();

  // Predefined roles with their rates
  const predefinedRoles = {
    "Head Mason": "800",
    "Mason": "800",
    "M - Helper": "600",
    "W - Helper": "400"
  };

  const [formData, setFormData] = useState({
    role: "",
    rate: ""
  });

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    const autoRate = predefinedRoles[selectedRole] || "";

    setFormData({
      role: selectedRole,
      rate: autoRate
    });

    if (selectedRole && autoRate) {
      showInfo(`Rate automatically set to ₹${autoRate} for ${selectedRole}`);
    }
  };

  const handleRateChange = (e) => {
    setFormData({ ...formData, rate: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.role || !formData.rate) {
      showError("Please select a role and enter a rate.");
      return;
    }

    onSave(formData);
    showSuccess(`Rate for ${formData.role} added successfully!`);

    // Reset form
    setFormData({ role: "", rate: "" });
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
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select a role</option>
                {Object.keys(predefinedRoles).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (₹) *
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleRateChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Rate will be auto-filled when role is selected"
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
  const { showInfo, showSuccess } = useToast();

  // State for general information
  const [generalInfo, setGeneralInfo] = useState([
    ["Name Of Client", "Mr. Narendra Kori"],
    ["Project No.", "#MC02"],
    ["Labour Contractor", "Thippanna B"],
    ["Address", "Mahendra Enclave"],
    ["Total Budget", "10,00,000"],
  ]);

  // State for rate list - only the 4 predefined roles
  const [rateList, setRateList] = useState([
    ["Head Mason", "800"],
    ["Mason", "800"],
    ["M - Helper", "600"],
    ["W - Helper", "400"],
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
    showSuccess(`General information updated successfully for ${data.clientName}!`);
  };

  // Function to handle saving rate list item
  const handleSaveRateList = (data) => {
    // Check if role already exists
    const existingRoleIndex = rateList.findIndex(item => item[0] === data.role);

    if (existingRoleIndex !== -1) {
      // Update existing role rate
      const updatedRateList = [...rateList];
      updatedRateList[existingRoleIndex] = [data.role, data.rate];
      setRateList(updatedRateList);
      showSuccess(`Rate for ${data.role} updated to ₹${data.rate}`);
    } else {
      // Add new role (though this shouldn't happen with predefined roles)
      const newRateList = [...rateList, [data.role, data.rate]];
      setRateList(newRateList);
      showSuccess(`Rate for ${data.role} added successfully!`);
    }
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
                onClick={() => {
                  setIsGeneralInfoModalOpen(true);
                  showInfo("Add General Info modal opened. Enter project details.");
                }}
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
                onClick={() => {
                  setIsRateListModalOpen(true);
                  showInfo("Add Rate List modal opened. Select a role to set rates.");
                }}
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
