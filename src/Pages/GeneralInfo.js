import React, { useState } from "react";
import { useClientContext } from '../context/ClientContext';
import { useProject } from '../context/ProjectContext';

const InformationTables = () => {
  const { clientList, addOrUpdateClient } = useClientContext();
  const { selectedProject } = useProject();

  // Modal state
  const [isGeneralInfoModalOpen, setIsGeneralInfoModalOpen] = useState(false);
  const [isRateListModalOpen, setIsRateListModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    clientName: '',
    projectNo: '',
    labourContractor: '',
    address: '',
    totalBudget: ''
  });
  const [clientSelected, setClientSelected] = useState(false);

  // Find the client for the selected project
  let clientInfo = null;
  if (selectedProject && clientSelected) {
    clientInfo = clientList.find(client => (client.projects || []).includes(selectedProject.name));
  }

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setClientForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle client select (save and show info)
  const handleSelectClient = (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    addOrUpdateClient({
      ...clientForm,
      projects: [selectedProject.name]
    });
    setClientSelected(true);
    setIsGeneralInfoModalOpen(false);
  };

  // Open modal: pre-fill clientName if client user exists for this project
  const openClientModal = () => {
    let clientName = '';
    if (selectedProject) {
      // Find client user for this project
      const clientUser = clientList.find(client => (client.projects || []).includes(selectedProject.name));
      if (clientUser) {
        clientName = clientUser.clientName || '';
      }
    }
    setClientForm({
      clientName,
      projectNo: '',
      labourContractor: '',
      address: '',
      totalBudget: ''
    });
    setIsGeneralInfoModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-400 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Client Information Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2">
            <h2 className="font-semibold text-lg text-gray-900">
              Client Information
            </h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded"
              type="button"
              onClick={openClientModal}
            >
              Client Information
            </button>
          </div>

          <table className="w-full text-gray-700 text-sm">
            <tbody>
              {[
                ["Name Of Client", clientInfo ? clientInfo.clientName || "" : ""],
                ["Project No.", clientInfo ? clientInfo.projectNo || "" : ""],
                ["Labour Contractor", clientInfo ? clientInfo.labourContractor || "" : ""],
                ["Address", clientInfo ? clientInfo.address || "" : ""],
                ["Total Budget", clientInfo ? clientInfo.totalBudget || "" : ""]
              ].map(([label, value], index) => (
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
        {/* General Info Modal */}
        {isGeneralInfoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Client General Information</h2>
                <button onClick={() => setIsGeneralInfoModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleSelectClient} className="space-y-4">
                <input name="clientName" value={clientForm.clientName} onChange={handleFormChange} className="w-full border p-2 rounded" placeholder="Name of Client" required readOnly={!!clientForm.clientName} />
                <input name="projectNo" value={clientForm.projectNo} onChange={handleFormChange} className="w-full border p-2 rounded" placeholder="Project No." required />
                <input name="labourContractor" value={clientForm.labourContractor} onChange={handleFormChange} className="w-full border p-2 rounded" placeholder="Labour Contractor" required />
                <input name="address" value={clientForm.address} onChange={handleFormChange} className="w-full border p-2 rounded" placeholder="Address" required />
                <input name="totalBudget" value={clientForm.totalBudget} onChange={handleFormChange} className="w-full border p-2 rounded" placeholder="Total Budget" required />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsGeneralInfoModalOpen(false)} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Select Client</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rate List Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2">
            <h2 className="font-semibold text-lg text-gray-900">Rate List</h2>
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
              type="button"
              onClick={() => setIsRateListModalOpen(true)}
            >
              Rate List
            </button>
          </div>

          <table className="w-full text-gray-700 text-sm">
            <tbody>
              {[
                ["Head Mason", "800"],
                ["Mason", "800"],
                ["M - Helper", "600"],
                ["W - Helper", "400"],
              ].map(([label, value], index) => (
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
        {/* Rate List Modal */}
        {isRateListModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Rate List</h2>
                <button onClick={() => setIsRateListModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="text-gray-700">(Rate List editing form goes here)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationTables;
