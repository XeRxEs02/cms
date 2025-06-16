import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { BadgeInfo, X } from "lucide-react";
import { useToast } from "../context/ToastContext";

// General Information Modal Component
const AddGeneralInfoModal = ({ isOpen, onClose, onSave, clientList }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [formData, setFormData] = useState({
    clientName: "",
    projectNo: "",
    labourContractor: "",
    address: "",
    totalBudget: ""
  });

  // Auto-fill fields when client is selected
  const handleClientChange = (e) => {
    const selectedClient = e.target.value;
    setFormData((prev) => ({ ...prev, clientName: selectedClient }));
    const clientData = clientList.find((c) => c.clientName === selectedClient);
    if (clientData) {
      setFormData({
        clientName: clientData.clientName,
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
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
                {clientList.map((client) => (
                  <option key={client.clientName} value={client.clientName}>
                    {client.clientName}
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
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
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
const AddRateListModal = ({ isOpen, onClose, onSave, rateList }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [formData, setFormData] = useState({
    role: "",
    rate: ""
  });

  // Allow typing a new role or selecting existing
  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
    const roleData = rateList.find((r) => r[0] === e.target.value);
    if (roleData) {
      setFormData({ role: roleData[0], rate: roleData[1] });
    } else {
      setFormData((prev) => ({ ...prev, rate: "" }));
    }
  };

  const handleRateChange = (e) => {
    setFormData({ ...formData, rate: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.role || !formData.rate) {
      return;
    }
    onSave({ role: formData.role, rate: formData.rate });
    setFormData({ role: "", rate: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Rate List Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                name="role"
                list="role-list"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                placeholder="Type or select a role"
              />
              <datalist id="role-list">
                {rateList.map(([role]) => (
                  <option key={role} value={role} />
                ))}
              </datalist>
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
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
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

// Add Client Modal Component
const AddClientModal = ({ isOpen, onClose, onAdd, existingClients }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    projectNo: "",
    labourContractor: "",
    address: "",
    totalBudget: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields are filled
    if (Object.values(formData).some((v) => !v.trim())) {
      setError("All fields are required.");
      return;
    }
    // Prevent duplicate client names
    if (existingClients.includes(formData.clientName)) {
      setError("Client name already exists.");
      return;
    }
    onAdd(formData);
    setFormData({
      clientName: "",
      projectNo: "",
      labourContractor: "",
      address: "",
      totalBudget: ""
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="clientName" value={formData.clientName} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name of Client" />
          <input name="projectNo" value={formData.projectNo} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Project No." />
          <input name="labourContractor" value={formData.labourContractor} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Labour Contractor" />
          <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Address" />
          <input name="totalBudget" value={formData.totalBudget} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Total Budget" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">Add</button>
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

  // New state for client list and modal
  const [clientList, setClientList] = useState([
    {
      clientName: "Mr. Narendra Kori",
      projectNo: "#MC02",
      labourContractor: "Thippanna B",
      address: "Mahendra Enclave",
      totalBudget: "10,00,000"
    }
  ]);
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

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
      // Add new role
      const newRateList = [...rateList, [data.role, data.rate]];
      setRateList(newRateList);
      showSuccess(`Rate for ${data.role} added successfully!`);
    }
  };

  // Add client handler
  const handleAddClient = (client) => {
    setClientList((prev) => [...prev, client]);
    setSelectedClientIndex(clientList.length); // select the newly added client
    showSuccess(`Client '${client.clientName}' added!`);
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
              <div className="flex gap-2">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
                  type="button"
                  onClick={() => setIsAddClientModalOpen(true)}
                >
                  Add Client
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
                  type="button"
                  onClick={() => {
                    setIsGeneralInfoModalOpen(true);
                    showInfo("Add General Info modal opened. Enter project details.");
                  }}
                >
                  General Information List
                </button>
              </div>
            </div>
            <table className="w-full text-gray-700 text-sm">
              <tbody>
                <tr><td className="px-6 py-3 w-1/3">Name Of Client</td><td className="px-6 py-3">{clientList[clientList.length-1]?.clientName}</td></tr>
                <tr><td className="px-6 py-3 w-1/3">Project No.</td><td className="px-6 py-3">{clientList[clientList.length-1]?.projectNo}</td></tr>
                <tr><td className="px-6 py-3 w-1/3">Labour Contractor</td><td className="px-6 py-3">{clientList[clientList.length-1]?.labourContractor}</td></tr>
                <tr><td className="px-6 py-3 w-1/3">Address</td><td className="px-6 py-3">{clientList[clientList.length-1]?.address}</td></tr>
                <tr><td className="px-6 py-3 w-1/3">Total Budget</td><td className="px-6 py-3">{clientList[clientList.length-1]?.totalBudget}</td></tr>
              </tbody>
            </table>
          </section>

          {/* Rate List Section */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2 bg-gray-200">
              <h2 className="font-semibold text-lg text-gray-900">Rate List</h2>
              <div className="flex gap-2">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
                  type="button"
                  onClick={() => {
                    setIsRateListModalOpen(true);
                    showInfo("Add Rate List modal opened. Add a new rate.");
                  }}
                >
                  Add Rate
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
                  type="button"
                  onClick={() => {
                    setIsRateListModalOpen(true);
                    showInfo("Add Rate List modal opened. Select a role to set rates.");
                  }}
                >
                  Rate List
                </button>
              </div>
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
        clientList={clientList}
      />

      <AddRateListModal
        isOpen={isRateListModalOpen}
        onClose={() => setIsRateListModalOpen(false)}
        onSave={handleSaveRateList}
        rateList={rateList}
      />

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAdd={handleAddClient}
        existingClients={clientList.map(c => c.clientName)}
      />
    </>
  );
};

export default Indent;
