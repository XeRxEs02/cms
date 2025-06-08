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
  const { logout, user } = useAuth();

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

  return React.createElement(
    'div',
    { className: 'lg:hidden' },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between p-4 bg-white shadow-md' },
      React.createElement(
        'div',
        { className: 'flex items-center' },
        React.createElement('img', {
          src: logo1,
          alt: 'Logo',
          className: 'h-8'
        })
      ),
      React.createElement(
        'button',
        {
          onClick: toggleMenu,
          className: 'text-gray-600 hover:text-gray-800'
        },
        isOpen
          ? React.createElement(X, { size: 24 })
          : React.createElement(Menu, { size: 24 })
      )
    ),
    isOpen && React.createElement(
      'div',
      {
        className: 'fixed inset-0 z-50 bg-white',
        style: { top: '64px' }
      },
      React.createElement(
        'div',
        { className: 'flex flex-col h-full' },
        React.createElement(
          'div',
          { className: 'flex-1 overflow-y-auto' },
          React.createElement(
            'nav',
            { className: 'px-4 py-2' },
            sidebarroutes.map((route) =>
              React.createElement(
                'button',
                {
                  key: route.path,
                  onClick: () => handleNavigation(route.path),
                  className: `flex items-center w-full px-4 py-2 mb-2 text-left rounded-md ${
                    isActive(route.path)
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                },
                React.createElement(
                  'span',
                  { className: 'mr-3' },
                  React.createElement(route.icon, { size: 20 })
                ),
                route.name
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'p-4 border-t' },
          React.createElement(
            'button',
            {
              onClick: handleLogout,
              className: 'flex items-center w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-md'
            },
            React.createElement(LogOut, {
              size: 20,
              className: 'mr-3'
            }),
            'Logout'
          )
        )
      )
    )
  );
};

export default MobileNav;
