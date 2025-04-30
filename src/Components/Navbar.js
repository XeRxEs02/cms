import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";

const Navbar = ({ currentPath, icon: Icon }) => {
  const path = currentPath.split("/");

  let displayPath = path[path.length - 1].toLowerCase();

  if (displayPath === "labourbill") {
    displayPath = "Labour Bill";
  } else if (displayPath === "labourpayments") {
    displayPath = "Labour Payments";
  } else if (displayPath === "generalinfo") {
    displayPath = "General Info";
  } else {
    displayPath = displayPath.charAt(0).toUpperCase() + displayPath.slice(1);
  }

  return (
    <div className="px-6 mt-4">
      <div class="flex items-center py-4">
        <button className="text-gray-600 hover:text-gray-800 mr-3">
          <FaArrowLeft size={18} />
        </button>
        <div className="flex items-center space-x-2 text-black font-semibold">
          {Icon ? <Icon size={20} /> : null}
          <span class="ml-2 text-xl font-semibold text-black">
            {displayPath}
          </span>
        </div>
      </div>
      <div className="flex-grow border-b border-gray-300 mr-3"></div>
    </div>
  );
};

export default Navbar;
