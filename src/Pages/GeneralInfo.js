import React from "react";

const InformationTables = () => {
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
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
              type="button"
            >
              Add General Information
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

        {/* Rate List Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2">
            <h2 className="font-semibold text-lg text-gray-900">Rate List</h2>
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
              type="button"
            >
              Add Rate List
            </button>
          </div>

          <table className="w-full text-gray-700 text-sm">
            <tbody>
              {[
                ["Head Mason", "800"],
                ["Mason", "800"],
                ["M - Helper", "600"],
                ["W - Helper", "400"],
                ["Column bartending", "13,200"],
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
      </div>
    </div>
  );
};

export default InformationTables;
