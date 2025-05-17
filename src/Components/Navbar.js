import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ currentPath, icon: Icon }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = currentPath.split("/");
  const { selectedProject } = useProject();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let displayPath = path[path.length - 1].toLowerCase();

  // Function to handle back button click
  const handleBackClick = () => {
    // Check if we're in a project-specific page
    if (selectedProject && location.pathname.includes('/app/') && !location.pathname.includes('/app/projects')) {
      // Navigate to the dashboard if we're in a project
      navigate("/app/dashboard");
    } else {
      // Navigate to the projects page
      navigate("/app/projects");
    }
  };

  // Format display path for better readability
  if (displayPath === "labourbill") {
    displayPath = "Labour Bill";
  } else if (displayPath === "labourpayments") {
    displayPath = "Labour Payments";
  } else if (displayPath === "generalinfo") {
    displayPath = "General Info";
  } else if (displayPath === "dwa") {
    displayPath = "Daily Report";
  } else {
    displayPath = displayPath.charAt(0).toUpperCase() + displayPath.slice(1);
  }

  return (
    <div className="px-3 sm:px-6 mt-4 lg:mt-0">
      <div className="flex items-center justify-between py-2 sm:py-4">
        <div className="flex items-center">
          <button
            className="text-gray-600 hover:text-gray-800 mr-2 sm:mr-3 cursor-pointer"
            onClick={handleBackClick}
            aria-label="Go back"
          >
            <FaArrowLeft size={16} className="sm:text-lg" />
          </button>
          <div className="flex items-center space-x-1 sm:space-x-2 text-black font-semibold">
            {Icon ? <Icon size={18} className="sm:text-xl" /> : null}
            <span className="ml-1 sm:ml-2 text-base sm:text-xl font-semibold text-black truncate">
              {displayPath}
            </span>
          </div>
          {selectedProject && selectedProject.name && (
            <div className="ml-4 px-3 py-1 bg-[#7BAFD4] text-white rounded-md text-sm">
              {selectedProject.name}
            </div>
          )}
        </div>

        {/* User info on navbar for larger screens */}
        {!isMobile && user && (
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded-full">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user.name || 'User'}
            </span>
          </div>
        )}
      </div>
      <div className="flex-grow border-b border-gray-300 mr-3"></div>
    </div>
  );
};

export default Navbar;
