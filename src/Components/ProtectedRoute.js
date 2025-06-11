import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return React.createElement(Navigate, { to: "/login", replace: true });
  }

  return children;
};

export default ProtectedRoute;
