import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { HandCoins, Calendar, Users, CheckCircle } from "lucide-react";
import { useLabour } from "../context/LabourContext";
import { useToast } from "../context/ToastContext";

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
  return (
    <>
      <Navbar currentPath={location.pathname} icon={HandCoins} />
      <div className="p-4 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Labour Payment Management</h1>
          <p className="text-gray-600">Enter daily labour data (saves to Labour Bill) → Complete week (creates payment record)</p>
        </div>

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Days Completed</p>
              <p className="text-2xl font-bold text-blue-800">
                {Object.values(currentWeekData.dailyData).filter(day => day.headMason > 0 || day.mason > 0 || day.mHelper > 0 || day.wHelper > 0).length}/6
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Week Total</p>
              <p className="text-2xl font-bold text-green-800">₹{currentWeekData.totalAmount}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-600 text-sm font-medium">Avg Daily</p>
              <p className="text-2xl font-bold text-purple-800">
                ₹{currentWeekData.totalAmount > 0 ? Math.round(currentWeekData.totalAmount / Object.values(currentWeekData.dailyData).filter(day => day.amount > 0).length) : 0}
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
            {days.map((day) => {
              const dayData = currentWeekData.dailyData[day];
              const isCompleted = dayData.headMason > 0 || dayData.mason > 0 || dayData.mHelper > 0 || dayData.wHelper > 0;
              return (
                <div key={day} className="text-center">
                  <div className={`h-2 rounded-full mb-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <p className="text-xs text-gray-600">{day.slice(0, 3)}</p>
                  <p className="text-xs font-semibold text-gray-800">₹{dayData.amount}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Daily Labour Entry
          </h2>

          {/* Day Selection */}
          <div className="grid grid-cols-6 gap-2 mb-6">
            {days.map((day) => {
              const dayData = currentWeekData.dailyData[day];
              const isCompleted = dayData.headMason > 0 || dayData.mason > 0 || dayData.mHelper > 0 || dayData.wHelper > 0;
              return (
                <button
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedDay === day
                      ? 'bg-red-500 text-white'
                      : isCompleted
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <p className="font-semibold text-sm">{day}</p>
                  <p className="text-xs">₹{dayData.amount}</p>
                </button>
              );
            })}
          </div>

          {/* Form for selected day */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{selectedDay} Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Type *
                </label>
                <select
                  value={dayFormData.workType}
                  onChange={(e) => handleInputChange('workType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <input
                  type="text"
                  value={dayFormData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Additional notes"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Total Staff: {dayFormData.headMason + dayFormData.mason + dayFormData.mHelper + dayFormData.wHelper}</p>
                <p className="font-semibold">Estimated Amount: ₹{
                  (dayFormData.headMason * 800) +
                  (dayFormData.mason * 800) +
                  (dayFormData.mHelper * 600) +
                  (dayFormData.wHelper * 400)
                }</p>
              </div>

              <button
                onClick={saveDayData}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold"
              >
                Save {selectedDay} Data
              </button>
            </div>
          </div>
        </div>

        {/* Completed Weeks */}
        {labourPaymentData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Week Payment Records</h2>
            <p className="text-sm text-gray-600 mb-4">
              These are consolidated weekly payment records. Individual daily entries can be found in Labour Bill.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Week</th>
                    <th className="px-4 py-3">Period</th>
                    <th className="px-4 py-3">Completed Date</th>
                    <th className="px-4 py-3">Working Days</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labourPaymentData.map((week) => (
                    <tr key={week.weekNumber} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">Week {week.weekNumber}</td>
                      <td className="px-4 py-3 text-xs">
                        {week.startDate} to {week.endDate}
                      </td>
                      <td className="px-4 py-3">{week.completedDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {week.totalDays}/6 days
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-600">₹{week.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LabourPayment;
