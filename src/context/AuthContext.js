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
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Clear any existing authentication data on initialization
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedProject');
    
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // In a real app, you would validate credentials against a backend
    // For this demo, we'll accept specific credentials
    if (email === "admin@sbpatil.com" && password === "admin123") {
      // Create user object
      const userData = {
        name: 'Abhishek U',
        email: email,
        role: 'Admin'
      };

      // Store authentication state and user data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedProject');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateUserProfile = (userData) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
