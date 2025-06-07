import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appData, setAppData] = useState({
    dailyReport: {
      existingBalance: 3.63,
      budgetSpent: {
        amount: 36700,
        total: 1000000,
        percentage: 3.67
      },
      balanceToBePaid: {
        amount: 12000,
        total: 36700,
        percentage: 32.69
      },
      entries: [
        {
          no: "01",
          particulars: "Construction Material",
          date: "01/01/2025",
          amount: 700,
          paid: 700,
          balance: 0,
          unit: "No.",
          quantity: 1,
          remarks: "-"
        },
        {
          no: "02",
          particulars: "Sand",
          date: "01/01/2025",
          amount: 24000,
          paid: 24000,
          balance: 0,
          unit: "Trip",
          quantity: 1,
          remarks: "-"
        },
        {
          no: "03",
          particulars: "Sand",
          date: "01/01/2025",
          amount: 12000,
          paid: 0,
          balance: 12000,
          unit: "Trip",
          quantity: 1,
          remarks: "-"
        }
      ]
    },
    dashboard: {
      totalBudget: 1000000,
      totalSpent: 36700,
      totalBalance: 963300,
      recentTransactions: [],
      aggregatedItems: {}
    }
  });

  // Function to aggregate transactions by particulars
  const aggregateTransactions = (entries) => {
    const aggregated = entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();
      
      if (!acc[key]) {
        acc[key] = {
          particulars: entry.particulars,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          totalQuantity: 0,
          unit: entry.unit,
          lastUpdated: entry.date,
          transactions: []
        };
      }

      acc[key].totalAmount += entry.amount;
      acc[key].totalPaid += entry.paid;
      acc[key].totalBalance += entry.balance;
      acc[key].totalQuantity += entry.quantity;
      acc[key].lastUpdated = entry.date;
      acc[key].transactions.push({
        date: entry.date,
        amount: entry.amount,
        paid: entry.paid,
        balance: entry.balance,
        quantity: entry.quantity
      });

      return acc;
    }, {});

    // Convert to array and sort by last updated date
    return Object.values(aggregated)
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 5); // Keep only the 5 most recent unique items
  };

  // Function to update daily report data
  const updateDailyReport = (newEntry) => {
    setAppData(prevData => {
      // Create a copy of the current entries
      const updatedEntries = [...prevData.dailyReport.entries];
      
      // If it's a new entry, add it
      if (newEntry.isNew) {
        const nextNo = (updatedEntries.length + 1).toString().padStart(2, '0');
        updatedEntries.push({
          ...newEntry,
          no: nextNo,
          date: new Date(newEntry.date).toLocaleDateString('en-GB')
        });
      }
      
      // Calculate new totals
      const totalAmount = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const totalPaid = updatedEntries.reduce((sum, entry) => sum + entry.paid, 0);
      const totalBalance = updatedEntries.reduce((sum, entry) => sum + entry.balance, 0);
      
      // Get aggregated recent transactions
      const aggregatedTransactions = aggregateTransactions(updatedEntries);
      
      // Update both daily report and dashboard data
      return {
        ...prevData,
        dailyReport: {
          ...prevData.dailyReport,
          entries: updatedEntries,
          budgetSpent: {
            amount: totalAmount,
            total: prevData.dailyReport.budgetSpent.total,
            percentage: ((totalAmount / prevData.dailyReport.budgetSpent.total) * 100).toFixed(2)
          },
          balanceToBePaid: {
            amount: totalBalance,
            total: totalAmount,
            percentage: totalAmount > 0 ? ((totalBalance / totalAmount) * 100).toFixed(2) : 0
          }
        },
        dashboard: {
          ...prevData.dashboard,
          totalSpent: totalAmount,
          totalBalance: prevData.dashboard.totalBudget - totalAmount,
          recentTransactions: aggregatedTransactions,
          aggregatedItems: aggregatedTransactions.reduce((acc, item) => {
            acc[item.particulars.toLowerCase()] = item;
            return acc;
          }, {})
        }
      };
    });
  };

  // Function to update dashboard data
  const updateDashboard = (newData) => {
    setAppData(prevData => ({
      ...prevData,
      dashboard: {
        ...prevData.dashboard,
        ...newData
      }
    }));
  };

  // Initialize aggregated transactions on mount
  useEffect(() => {
    const aggregatedTransactions = aggregateTransactions(appData.dailyReport.entries);
    updateDashboard({
      recentTransactions: aggregatedTransactions,
      aggregatedItems: aggregatedTransactions.reduce((acc, item) => {
        acc[item.particulars.toLowerCase()] = item;
        return acc;
      }, {})
    });
  }, []);

  return (
    <AppContext.Provider value={{ 
      appData, 
      updateDailyReport, 
      updateDashboard 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 