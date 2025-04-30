import React from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { DraftingCompass, Search } from "lucide-react";

const drawings = [
  { no: "01", name: "Basic Plan", status: "Approved" },
  { no: "02", name: "Plinth Beam Plan", status: "Approved" },
  { no: "03", name: "Site Diagram", status: "Rejected" },
  { no: "04", name: "Blue Print", status: "Submitted" },
];
const statusClasses = {
  Approved:
    "text-green-600 border border-green-500 px-2 py-0.5 rounded-full text-xs",
  Rejected:
    "text-red-600 border border-red-500 px-2 py-0.5 rounded-full text-xs",
  Submitted:
    "text-red-600 border border-red-500 px-2 py-0.5 rounded-full text-xs",
  Reupload: "bg-red-500 text-white px-2 py-0.5 rounded-full text-xs",
};

function FilterIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
      />
    </svg>
  );
}

function CustomButton({ children, className, variant = "solid", ...props }) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
      : "bg-red-600  text-white";

  return (
    <button
      className={`px-4 py-2 rounded-md text-md transition ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function CustomInput({ className, ...props }) {
  return (
    <div className="relative">
      <input
        type="text"
        className="border rounded-md pl-10 py-2"
        placeholder="Search"
        // value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}

const Billing = () => {
  const location = useLocation();

  return (
    <>
      <Navbar currentPath={location.pathname} icon={DraftingCompass} />
      <div className="px-6 py-4  mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <div className="flex gap-2 items-center">
            <CustomButton variant="outline" className="flex items-center gap-2">
              <FilterIcon className="w-6 h-6" />
              Filter
            </CustomButton>
            <CustomInput
              type="text"
              placeholder="Search"
              className="max-w-xs"
            />
          </div>
          <CustomButton className="bg-red-500 hover:bg-red-600 text-white">
            Upload Drawing
          </CustomButton>
        </div>

        <table className="w-full table-auto text-left bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-200 border-b border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold">NO.</th>
              <th className="p-3 text-sm font-semibold">Particulars</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {drawings.map((drawing) => (
              <tr
                key={drawing.id}
                className="border-t hover:bg-gray-50 text-sm"
              >
                <td className="p-3 font-medium">{drawing.no}</td>
                <td className="p-3 text-red-600 font-medium">{drawing.name}</td>
                <td className="p-3 space-x-2">
                  {drawing.status === "Rejected" ? (
                    <>
                      <span className={statusClasses[drawing.status]}>
                        {drawing.status}
                      </span>
                      <span className={statusClasses["Reupload"]}>
                        Re-Upload
                      </span>
                    </>
                  ) : (
                    <span className={statusClasses[drawing.status]}>
                      {drawing.status}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <CustomButton variant="outline" className="text-xs">
                    View
                  </CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Billing;
