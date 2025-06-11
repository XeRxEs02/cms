import React, { createContext, useContext, useState } from 'react';

const LabourContext = createContext();

export const useLabour = () => {
  const context = useContext(LabourContext);
  if (!context) {
    throw new Error('useLabour must be used within a LabourProvider');
  }
  return context;
};

export const LabourProvider = ({ children }) => {
  // Rate list from General Info (matching the predefined rates)
  const [rateList] = useState({
    "Head Mason": 800,
    "Mason": 800,
    "M - Helper": 600,
    "W - Helper": 400
  });

  // Weekly labour data (Monday to Saturday)
  const [weeklyLabourData, setWeeklyLabourData] = useState([]);

  // Labour payment data (completed weeks)
  const [labourPaymentData, setLabourPaymentData] = useState([]);

  // Counter for sequential IDs
  const [nextId, setNextId] = useState(1);

  // Current week data (Monday to Saturday)
  const [currentWeekData, setCurrentWeekData] = useState({
    weekNumber: 1,
    startDate: null,
    endDate: null,
    dailyData: {
      Monday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
      Tuesday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
      Wednesday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
      Thursday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
      Friday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
      Saturday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 }
    },
    totalAmount: 0,
    isCompleted: false
  });

  // Calculate daily amount based on staff count and rates
  const calculateDailyAmount = (headMason, mason, mHelper, wHelper) => {
    const amount =
      (headMason * rateList["Head Mason"]) +
      (mason * rateList["Mason"]) +
      (mHelper * rateList["M - Helper"]) +
      (wHelper * rateList["W - Helper"]);
    return amount;
  };

  // Update daily data for current week
  const updateDailyData = (day, data) => {
    const amount = calculateDailyAmount(
      parseInt(data.headMason) || 0,
      parseInt(data.mason) || 0,
      parseInt(data.mHelper) || 0,
      parseInt(data.wHelper) || 0
    );

    const updatedDailyData = {
      ...currentWeekData.dailyData,
      [day]: {
        ...data,
        amount: amount
      }
    };

    // Calculate total week amount
    const totalAmount = Object.values(updatedDailyData).reduce((sum, dayData) => sum + dayData.amount, 0);

    setCurrentWeekData(prev => ({
      ...prev,
      dailyData: updatedDailyData,
      totalAmount: totalAmount
    }));
  };

  // Complete current week and move to labour payment
  const completeWeek = () => {
    if (!currentWeekData.isCompleted) {
      // Create a consolidated week record for labour payment
      const completedWeek = {
        id: Date.now(),
        weekNumber: currentWeekData.weekNumber,
        startDate: getDateForDay('Monday', currentWeekData.weekNumber),
        endDate: getDateForDay('Saturday', currentWeekData.weekNumber),
        totalDays: Object.values(currentWeekData.dailyData).filter(day => day.amount > 0).length,
        totalAmount: currentWeekData.totalAmount,
        dailyBreakdown: currentWeekData.dailyData,
        isCompleted: true,
        completedDate: new Date().toISOString().split('T')[0]
      };

      setLabourPaymentData(prev => [...prev, completedWeek]);

      // Reset for new week (daily data stays in Labour Bill)
      setCurrentWeekData({
        weekNumber: currentWeekData.weekNumber + 1,
        startDate: null,
        endDate: null,
        dailyData: {
          Monday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
          Tuesday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
          Wednesday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
          Thursday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
          Friday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 },
          Saturday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, workType: '', remarks: '', amount: 0 }
        },
        totalAmount: 0,
        isCompleted: false
      });
    }
  };

  // Add daily entry directly to Labour Bill
  const addDailyEntryToLabourBill = (day, data) => {
    const labourEntry = {
      id: nextId,
      date: getDateForDay(day, currentWeekData.weekNumber),
      barbender: data.workType || 'General Work',
      headmanson: data.headMason,
      manson: data.mason,
      mhelper: data.mHelper,
      whelper: data.wHelper,
      amount: data.amount,
      extrapayment: 0,
      remarks: data.remarks || '',
      weekNumber: currentWeekData.weekNumber,
      day: day
    };

    setWeeklyLabourData(prev => [...prev, labourEntry]);
    setNextId(prev => prev + 1);
    return labourEntry;
  };

  // Helper function to get date for a specific day
  const getDateForDay = (day, weekNumber) => {
    const today = new Date();
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayIndex);
    return date.toISOString().split('T')[0];
  };

  // Check if current week is complete (all days filled)
  const isWeekComplete = () => {
    return Object.values(currentWeekData.dailyData).every(dayData =>
      dayData.headMason > 0 || dayData.mason > 0 || dayData.mHelper > 0 || dayData.wHelper > 0
    );
  };

  const value = {
    rateList,
    weeklyLabourData,
    setWeeklyLabourData,
    labourPaymentData,
    setLabourPaymentData,
    currentWeekData,
    setCurrentWeekData,
    calculateDailyAmount,
    updateDailyData,
    completeWeek,
    isWeekComplete,
    addDailyEntryToLabourBill,
    nextId,
    setNextId
  };

  return (
    <LabourContext.Provider value={value}>
      {children}
    </LabourContext.Provider>
  );
};
