import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Navbar = ({ currentPath, icon: Icon }) => {
  const navigate = useNavigate();
  const path = currentPath.split("/");

  let displayPath = path[path.length - 1].toLowerCase();

  // Function to handle back button click
  const handleBackClick = () => {
    // Navigate to the dashboard page
    navigate("/app/dashboard");
  };

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
    <div className="px-3 sm:px-6 mt-4 lg:mt-0">
      <div className="flex items-center py-2 sm:py-4">
        <button
          className="text-gray-600 hover:text-gray-800 mr-2 sm:mr-3 cursor-pointer"
          onClick={handleBackClick}
        >
          <FaArrowLeft size={16} className="sm:text-lg" />
        </button>
        <div className="flex items-center space-x-1 sm:space-x-2 text-black font-semibold">
          {Icon ? <Icon size={18} className="sm:text-xl" /> : null}
          <span className="ml-1 sm:ml-2 text-base sm:text-xl font-semibold text-black truncate">
            {displayPath}
          </span>
        </div>
      </div>
      <div className="flex-grow border-b border-gray-300 mr-3"></div>
    </div>
  );
};

export default Navbar;
