import React, { createContext, useContext, useState, useEffect } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  // Load from localStorage or use default, always include hardcoded clients
  const [clientList, setClientList] = useState(() => {
    const stored = localStorage.getItem('clientList');
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('clientList', JSON.stringify(clientList));
  }, [clientList]);

  // Add or update a client
  const addOrUpdateClient = (client) => {
    setClientList((prev) => {
      const existingIndex = prev.findIndex(
        (c) => c.clientName === client.clientName
      );
      if (existingIndex !== -1) {
        // Merge projects array
        const updated = [...prev];
        const existingProjects = updated[existingIndex].projects || [];
        const newProjects = client.projects || [];
        const mergedProjects = Array.from(new Set([...existingProjects, ...newProjects]));
        updated[existingIndex] = { ...updated[existingIndex], ...client, projects: mergedProjects };
        return updated;
      } else {
        // Add new client
        return [...prev, { ...client, projects: client.projects || [] }];
      }
    });
  };

  return (
    <ClientContext.Provider value={{ clientList, setClientList, addOrUpdateClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
}; 