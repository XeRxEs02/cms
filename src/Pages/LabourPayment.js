import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { Coins, Calendar, Users, CheckCircle, Info, Copy, Trash2, Download } from "lucide-react";
import { useLabour } from "../context/LabourContext";
import { useToast } from "../context/ToastContext";
import WeekDetailsModal from "../Components/WeekDetailsModal";
import * as XLSX from 'xlsx';

const LabourPayment = () => {
  const location = useLocation();
  const {
    currentWeekData,
    updateDailyData,
    completeWeek,
    isWeekComplete,
    labourPaymentData,
    addDailyEntryToLabourBill
  } = useLabour();
  const { showSuccess, showInfo, showError } = useToast();

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [dayFormData, setDayFormData] = useState({
    headMason: 0,
    mason: 0,
    mHelper: 0,
    wHelper: 0,
    workType: '',
    remarks: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Load data for selected day
  const loadDayData = (day) => {
    const dayData = currentWeekData.dailyData[day];
    setDayFormData({
      headMason: dayData.headMason,
      mason: dayData.mason,
      mHelper: dayData.mHelper,
      wHelper: dayData.wHelper,
      workType: dayData.workType,
      remarks: dayData.remarks
    });
  };

  // Handle day selection
  const handleDaySelect = (day) => {
    if (showConfirmClear) {
      setShowConfirmClear(false);
    }
    setSelectedDay(day);
    loadDayData(day);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setDayFormData(prev => ({
      ...prev,
      [field]: field.includes('Mason') || field.includes('Helper') ? parseInt(value) || 0 : value
    }));
  };

  // Clear day data
  const handleClearDay = () => {
    if (currentWeekData.dailyData[selectedDay].amount > 0) {
      setShowConfirmClear(true);
      return;
    }
    clearDayData();
  };

  const clearDayData = () => {
    const emptyData = {
      headMason: 0,
      mason: 0,
      mHelper: 0,
      wHelper: 0,
      workType: '',
      remarks: ''
    };
    setDayFormData(emptyData);
    updateDailyData(selectedDay, emptyData);
    showInfo(`${selectedDay}'s data has been cleared.`);
    setShowConfirmClear(false);
  };

  // Copy previous day's data
  const handleCopyPreviousDay = () => {
    const currentDayIndex = days.indexOf(selectedDay);
    if (currentDayIndex > 0) {
      const previousDay = days[currentDayIndex - 1];
      const previousData = currentWeekData.dailyData[previousDay];
      
      if (previousData.amount > 0) {
        setDayFormData({
          headMason: previousData.headMason,
          mason: previousData.mason,
          mHelper: previousData.mHelper,
          wHelper: previousData.wHelper,
          workType: previousData.workType,
          remarks: `Copied from ${previousDay}`
        });
        showInfo(`Data copied from ${previousDay}.`);
      } else {
        showError(`No data available from ${previousDay} to copy.`);
      }
    } else {
      showError("This is the first day of the week. Nothing to copy from.");
    }
  };

  // Save daily data
  const saveDayData = () => {
    if (!dayFormData.workType) {
      showError("Please select a work type before saving.");
      return;
    }

    if (dayFormData.headMason === 0 && dayFormData.mason === 0 && dayFormData.mHelper === 0 && dayFormData.wHelper === 0) {
      showError("Please add at least one staff member.");
      return;
    }

    // Update the weekly tracking data
    updateDailyData(selectedDay, dayFormData);

    // Add entry directly to Labour Bill
    const labourEntry = addDailyEntryToLabourBill(selectedDay, dayFormData);

    showSuccess(`${selectedDay} data saved to Labour Bill! Entry ID: ${Math.floor(labourEntry.id)} | Amount: ₹${labourEntry.amount}`);

    // Auto-select next day if available
    const currentDayIndex = days.indexOf(selectedDay);
    if (currentDayIndex < days.length - 1) {
      const nextDay = days[currentDayIndex + 1];
      handleDaySelect(nextDay);
    }
  };

  // Complete the week
  const handleCompleteWeek = () => {
    if (!isWeekComplete()) {
      showError("Please fill data for all days (Monday to Saturday) before completing the week.");
      return;
    }

    const weekNumber = currentWeekData.weekNumber;
    const totalAmount = currentWeekData.totalAmount;

    completeWeek();
    showSuccess(`Week ${weekNumber} completed and moved to Labour Payment! Total: ₹${totalAmount}. Daily entries remain in Labour Bill.`);

    // Reset form for new week
    setSelectedDay('Monday');
    loadDayData('Monday');
  };

  // Show week details
  const handleShowWeekDetails = (week) => {
    setSelectedWeek(week);
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet from labour payment data
      const ws = XLSX.utils.json_to_sheet(labourPaymentData.map(week => ({
        'Week Number': `Week ${week.weekNumber}`,
        'Date Range': `${week.startDate} to ${week.endDate}`,
        'Total Days': week.totalDays,
        'Total Amount': week.totalAmount,
        'Status': week.status || 'Pending',
        'Remarks': week.remarks || '-'
      })));

      // Add total row
      const totalAmount = labourPaymentData.reduce((sum, week) => sum + week.totalAmount, 0);
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', '', '', totalAmount, '', '']
      ], { origin: -1 });

      // Set column widths
      ws['!cols'] = [
        { wch: 12 }, // Week Number
        { wch: 20 }, // Date Range
        { wch: 12 }, // Total Days
        { wch: 15 }, // Total Amount
        { wch: 12 }, // Status
        { wch: 20 }  // Remarks
      ];

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Labour Payments');

      // Generate Excel file
      XLSX.writeFile(wb, 'labour_payments.xlsx');
      showSuccess('Labour payment data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Coins} />
      <div className="p-4 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Labour Payment Management
          </h1>
          <p className="text-gray-600">
            Enter daily labour data (saves to Labour Bill) → Complete week (creates payment record)
          </p>
        </div>

        {/* Completed Weeks List */}
        {labourPaymentData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Weeks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Week</th>
                    <th className="px-4 py-3 text-left">Period</th>
                    <th className="px-4 py-3 text-center">Days Worked</th>
                    <th className="px-4 py-3 text-right">Total Amount</th>
                    <th className="px-4 py-3 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {labourPaymentData.map((week) => (
                    <tr key={week.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">Week {week.weekNumber}</td>
                      <td className="px-4 py-3">
                        {week.startDate} to {week.endDate}
                      </td>
                      <td className="px-4 py-3 text-center">{week.totalDays}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{week.totalAmount}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleShowWeekDetails(week)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View week details"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Current Week Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Week {currentWeekData.weekNumber} Progress
            </h2>
            {isWeekComplete() && (
              <button
                onClick={handleCompleteWeek}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Week
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Days Completed</p>
              <p className="text-2xl font-bold text-blue-800">
                {Object.values(currentWeekData.dailyData).filter(day =>
                  day.headMason > 0 || day.mason > 0 || day.mHelper > 0 || day.wHelper > 0
                ).length}/6
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Week Total</p>
              <p className="text-2xl font-bold text-green-800">₹{currentWeekData.totalAmount}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-600 text-sm font-medium">Avg Daily</p>
              <p className="text-2xl font-bold text-purple-800">
                ₹{currentWeekData.totalAmount > 0
                  ? Math.round(currentWeekData.totalAmount / Object.values(currentWeekData.dailyData)
                      .filter(day => day.amount > 0).length)
                  : 0}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-orange-600 text-sm font-medium">Status</p>
              <p className="text-lg font-bold text-orange-800">
                {isWeekComplete() ? 'Ready' : 'In Progress'}
              </p>
            </div>
          </div>

          {/* Week Progress Bar */}
          <div className="grid grid-cols-6 gap-2">
            {days.map(day => {
              const dayData = currentWeekData.dailyData[day];
              const isCompleted = dayData.headMason > 0 || dayData.mason > 0 || dayData.mHelper > 0 || dayData.wHelper > 0;
              return (
                <div key={day} className="text-center">
                  <div className={`h-2 rounded-full mb-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <p className="text-xs text-gray-600">{day.slice(0, 3)}</p>
                  <p className="text-xs font-semibold text-gray-800">₹{dayData.amount}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Labour Entry Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daily Labour Entry
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopyPreviousDay}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"
                title="Copy Previous Day"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearDay}
                className="text-gray-600 hover:text-red-600 p-2 rounded-md hover:bg-gray-100"
                title="Clear Day"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Selection */}
          <div className="grid grid-cols-6 gap-2 mb-6">
            {days.map(day => {
              const dayData = currentWeekData.dailyData[day];
              const isCompleted = dayData.headMason > 0 || dayData.mason > 0 || dayData.mHelper > 0 || dayData.wHelper > 0;
              return (
                <button
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors relative
                    ${selectedDay === day
                      ? 'bg-red-500 text-white'
                      : isCompleted
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title={isCompleted ? `₹${dayData.amount} - ${dayData.workType || 'No work type'}` : 'No data entered'}
                >
                  {day}
                  {isCompleted && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full transform -translate-y-1 translate-x-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Work Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Type *
              </label>
              <select
                value={dayFormData.workType}
                onChange={(e) => handleInputChange('workType', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Work Type</option>
                <option value="Column BarBending">Column BarBending</option>
                <option value="Beam BarBending">Beam BarBending</option>
                <option value="Slab BarBending">Slab BarBending</option>
                <option value="Concrete Work">Concrete Work</option>
                <option value="Masonry Work">Masonry Work</option>
                <option value="General Construction">General Construction</option>
              </select>
            </div>

            {/* Staff Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Head Mason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Head Mason (₹800/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.headMason}
                  onChange={(e) => handleInputChange('headMason', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Mason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mason (₹800/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.mason}
                  onChange={(e) => handleInputChange('mason', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* M-Helper */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-Helper (₹600/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.mHelper}
                  onChange={(e) => handleInputChange('mHelper', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* W-Helper */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  W-Helper (₹400/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.wHelper}
                  onChange={(e) => handleInputChange('wHelper', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={dayFormData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Additional notes or comments"
                rows="2"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={saveDayData}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2"
              >
                Save Daily Entry
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={handleExportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Download size={18} />
            EXPORT TO EXCEL
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clear Day */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Day Data?</h3>
            <p className="text-gray-600 mb-4">
              This will remove all data for {selectedDay}. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={clearDayData}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Week Details Modal */}
      {selectedWeek && (
        <WeekDetailsModal
          weekData={selectedWeek}
          onClose={() => setSelectedWeek(null)}
        />
      )}
    </>
  );
};

export default LabourPayment;
