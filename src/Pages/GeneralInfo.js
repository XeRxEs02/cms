import React, { useState } from "react";
import { useClientContext } from '../context/ClientContext';
import { useProject } from '../context/ProjectContext';

const InformationTables = () => {
  const { clientList } = useClientContext();
  const { selectedProject } = useProject();

  // Modal state
  const [isGeneralInfoModalOpen, setIsGeneralInfoModalOpen] = useState(false);
  const [isRateListModalOpen, setIsRateListModalOpen] = useState(false);

  // Find the client for the selected project
  let clientInfo = null;
  if (selectedProject) {
    clientInfo = clientList.find(client => (client.projects || []).includes(selectedProject.name));
  }

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-400 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* General Information Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2">
            <h2 className="font-semibold text-lg text-gray-900">
              General Information
            </h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded"
              type="button"
              onClick={() => setIsGeneralInfoModalOpen(true)}
            >
              General Information List
            </button>
          </div>

          <table className="w-full text-gray-700 text-sm">
            <tbody>
              {[
                ["Name Of Client", "Mr. Narendra Kori"],
                ["Project No.", "#MC02"],
                ["Labour Contractor", "Thippanna B"],
                ["Address", "Mahendra Enclave"],
                ["Total Budget", "10,00,000"],
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
                <h2 className="text-xl font-semibold">Edit General Information</h2>
                <button onClick={() => setIsGeneralInfoModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="text-gray-700">(General Information editing form goes here)</div>
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
