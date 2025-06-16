import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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
          drNo: "DR001",
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
          drNo: "DR002",
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
          drNo: "DR003",
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

  // Memoize aggregateTransactions function
  const aggregateTransactions = useCallback((entries) => {
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

    return Object.values(aggregated)
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 5);
  }, []);

  // Memoize updateDailyReport function
  const updateDailyReport = useCallback((newEntry) => {
    setAppData(prevData => {
      const updatedEntries = [...prevData.dailyReport.entries];
      
      if (newEntry.isNew) {
        const nextNo = (updatedEntries.length + 1).toString().padStart(2, '0');
        updatedEntries.push({
          ...newEntry,
          no: nextNo,
          date: new Date(newEntry.date).toLocaleDateString('en-GB')
        });
      }
      
      const totalAmount = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const totalBalance = updatedEntries.reduce((sum, entry) => sum + entry.balance, 0);
      
      const aggregatedTransactions = aggregateTransactions(updatedEntries);
      
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
  }, [aggregateTransactions]);

  // Memoize updateDashboard function
  const updateDashboard = useCallback((newData) => {
    setAppData(prevData => ({
      ...prevData,
      dashboard: {
        ...prevData.dashboard,
        ...newData
      }
    }));
  }, []);

  // Memoize initial data processing
  useEffect(() => {
    const aggregatedTransactions = aggregateTransactions(appData.dailyReport.entries);
    const aggregatedItems = aggregatedTransactions.reduce((acc, item) => {
      acc[item.particulars.toLowerCase()] = item;
      return acc;
    }, {});
    
    updateDashboard({
      recentTransactions: aggregatedTransactions,
      aggregatedItems
    });
  }, [appData.dailyReport.entries, aggregateTransactions]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    appData,
    updateDailyReport,
    updateDashboard
  }), [appData, updateDailyReport, updateDashboard]);

  return (
    <AppContext.Provider value={contextValue}>
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