import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo1 from "../Images/logo1.png";
import sidebarroutes from "../routes/sidebar";
import { useAuth } from "../context/AuthContext";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if the current path matches the route path
  const isActive = (routePath) => {
    // Special case for dashboard
    if (routePath === '/app/dashboard' && (location.pathname === '/app' || location.pathname === '/')) {
      return true;
    }
    // Special case for DWA
    if (routePath === '/app/dwa' && location.pathname === '/app') {
      return true;
    }
    // This will handle both exact matches and sub-routes
    return location.pathname === routePath || location.pathname.startsWith(routePath + '/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu after navigation
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 bg-[#669BBC] text-white">
        <div className="flex items-center">
          <img
            src={logo1}
            alt="S B Patil Group Logo"
            className="h-10 max-w-[120px]"
          />
        </div>
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
        style={{ top: "60px" }}
      >
        <div className="bg-[#669BBC] h-full w-64 shadow-lg p-4 overflow-y-auto">
          <nav className="flex-1 mt-4">
            <ul className="space-y-2">
              {sidebarroutes.map((route, index) => (
                <li key={index}>
                  <div
                    className={`flex items-center gap-2 p-3 rounded cursor-pointer text-md transition
                      ${isActive(route.path)
                        ? 'bg-white text-[#669BBC] font-semibold'
                        : 'text-black hover:bg-white hover:text-[#669BBC]'
                      }`}
                    onClick={() => handleNavigation(route.path)}
                  >
                    {route.icon} {route.name}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 items-center mt-8">
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full">
                A
              </div>
              <p className="text-lg font-semibold text-black">Abhishek U</p>
            </div>
            <div
              className="bg-red-600 w-full text-center py-2 rounded cursor-pointer hover:bg-red-700 text-lg flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              LOGOUT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
