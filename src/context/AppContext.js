import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext();

function getRelativeDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

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
        // Today
        {
          no: "01",
          drNo: "DR001",
          particulars: "Cement",
          date: getRelativeDate(0),
          amount: 1000,
          paid: 800,
          balance: 200,
          unit: "bags",
          quantity: 10,
          remarks: "Received from supplier",
          received: 10
        },
        {
          no: "02",
          drNo: "DR002",
          particulars: "Sand",
          date: getRelativeDate(0),
          amount: 600,
          paid: 600,
          balance: 0,
          unit: "tons",
          quantity: 6,
          remarks: "Sand delivered",
          received: 6
        },
        // 3 days ago
        {
          no: "03",
          drNo: "DR003",
          particulars: "Bricks",
          date: getRelativeDate(3),
          amount: 2000,
          paid: 1500,
          balance: 500,
          unit: "pcs",
          quantity: 1000,
          remarks: "Partial payment",
          received: 1000
        },
        {
          no: "04",
          drNo: "DR004",
          particulars: "Steel",
          date: getRelativeDate(3),
          amount: 1200,
          paid: 1200,
          balance: 0,
          unit: "kg",
          quantity: 400,
          remarks: "Steel rods",
          received: 400
        },
        // 10 days ago
        {
          no: "05",
          drNo: "DR005",
          particulars: "Cement",
          date: getRelativeDate(10),
          amount: 800,
          paid: 800,
          balance: 0,
          unit: "bags",
          quantity: 8,
          remarks: "Old cement",
          received: 8
        },
        {
          no: "06",
          drNo: "DR006",
          particulars: "Sand",
          date: getRelativeDate(10),
          amount: 400,
          paid: 400,
          balance: 0,
          unit: "tons",
          quantity: 4,
          remarks: "Sand for foundation",
          received: 4
        },
        // 40 days ago
        {
          no: "07",
          drNo: "DR007",
          particulars: "Bricks",
          date: getRelativeDate(40),
          amount: 1500,
          paid: 1500,
          balance: 0,
          unit: "pcs",
          quantity: 700,
          remarks: "Bricks for wall",
          received: 700
        },
        {
          no: "08",
          drNo: "DR008",
          particulars: "Steel",
          date: getRelativeDate(40),
          amount: 900,
          paid: 900,
          balance: 0,
          unit: "kg",
          quantity: 300,
          remarks: "Steel mesh",
          received: 300
        },
        // 8 months ago (approx 240 days)
        {
          no: "09",
          drNo: "DR009",
          particulars: "Cement",
          date: getRelativeDate(240),
          amount: 1200,
          paid: 1000,
          balance: 200,
          unit: "bags",
          quantity: 12,
          remarks: "Received last year",
          received: 12
        },
        {
          no: "10",
          drNo: "DR010",
          particulars: "Sand",
          date: getRelativeDate(240),
          amount: 700,
          paid: 700,
          balance: 0,
          unit: "tons",
          quantity: 7,
          remarks: "Old sand",
          received: 7
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
        // Always store date as YYYY-MM-DD
        let entryDate = newEntry.date;
        if (entryDate) {
          // If not already in YYYY-MM-DD, convert
          const d = new Date(entryDate);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
            entryDate = d.toISOString().split('T')[0];
          }
        }
        updatedEntries.push({
          ...newEntry,
          no: nextNo,
          date: entryDate
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