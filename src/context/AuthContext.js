import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear authentication on page load/refresh
    const checkAuth = () => {
      // Remove the next line to persist login across refreshes
      localStorage.removeItem('isAuthenticated');
      const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(loggedIn);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = (email, password) => {
    // In a real app, you would validate credentials against a backend
    // For this demo, we'll accept specific credentials
    if (email === "admin@sbpatil.com" && password === "admin123") {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
