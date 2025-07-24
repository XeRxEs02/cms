import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const DailyReportHistory = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { appData } = useAppContext();

  // Filters for the history list
  const [historyRange, setHistoryRange] = useState('1week');
  const allParticulars = Array.from(new Set(appData.dailyReport.entries.map(e => e.particulars)));
  const [historyParticular, setHistoryParticular] = useState('All');

  if (!date) {
    // Show list of all dates with transaction counts, filtered
    const now = new Date();
    let allDates = Array.from(new Set(appData.dailyReport.entries.map(e => e.date)));
    // Filter by item/particular
    if (historyParticular !== 'All') {
      allDates = allDates.filter(date => appData.dailyReport.entries.some(e => e.date === date && e.particulars === historyParticular));
    }
    // Filter by range
    if (historyRange === '1week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      allDates = allDates.filter(date => new Date(date) >= weekAgo && new Date(date) <= now);
    } else if (historyRange === '1month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      allDates = allDates.filter(date => new Date(date) >= monthAgo && new Date(date) <= now);
    } else if (historyRange === '1year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      allDates = allDates.filter(date => new Date(date) >= yearAgo && new Date(date) <= now);
    }
    allDates = allDates.sort((a, b) => new Date(b) - new Date(a));
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <button
          className="mb-4 px-4 py-2 bg-[#7BAFD4] text-white rounded hover:bg-[#669BBC] shadow"
          onClick={() => navigate('/app/daily-report')}
        >
          ← Back to Daily Report
        </button>
        <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">Transaction History - All Dates</h1>
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <label className="font-medium text-gray-700">Show:</label>
          <select
            className="border rounded px-2 py-1"
            value={historyRange}
            onChange={e => setHistoryRange(e.target.value)}
          >
            <option value="1week">1 Week</option>
            <option value="1month">Last Month</option>
            <option value="1year">One Year</option>
            <option value="all">All</option>
          </select>
          <label className="font-medium text-gray-700 ml-4">Item:</label>
          <select
            className="border rounded px-2 py-1"
            value={historyParticular}
            onChange={e => setHistoryParticular(e.target.value)}
          >
            <option value="All">All</option>
            {allParticulars.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto">
          {allDates.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No history available.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {allDates.map(date => {
                const count = appData.dailyReport.entries.filter(e => e.date === date && (historyParticular === 'All' || e.particulars === historyParticular)).length;
                return (
                  <li key={date} className="flex justify-between items-center py-3 hover:bg-blue-50 transition rounded-lg px-2">
                    <button
                      className="text-blue-700 hover:underline font-mono text-base font-semibold"
                      onClick={() => navigate(`/app/daily-report/history/${date}`)}
                    >
                      {date}
                    </button>
                    <span className="text-gray-500 text-sm bg-blue-100 rounded px-2 py-1 font-medium">{count} transaction{count !== 1 ? 's' : ''}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Show transactions for a specific date
  const entries = appData.dailyReport.entries.filter(e => e.date === date);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <button
        className="mb-4 px-4 py-2 bg-[#7BAFD4] text-white rounded hover:bg-[#669BBC] shadow"
        onClick={() => navigate('/app/daily-report/history')}
      >
        ← Back to History List
      </button>
      <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">Transactions for {date}</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px] bg-white rounded-xl shadow-lg">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-blue-900 font-bold text-sm">DR No.</th>
              <th className="px-4 py-3 text-blue-900 font-bold text-sm">Particulars</th>
              <th className="px-4 py-3 text-green-800 font-bold text-sm">Amount</th>
              <th className="px-4 py-3 text-green-800 font-bold text-sm">Paid</th>
              <th className="px-4 py-3 text-red-800 font-bold text-sm">Balance</th>
              <th className="px-4 py-3 text-blue-900 font-bold text-sm">Unit</th>
              <th className="px-4 py-3 text-blue-900 font-bold text-sm">Quantity</th>
              <th className="px-4 py-3 text-blue-900 font-bold text-sm">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-4 text-gray-400">No entries for this day.</td></tr>
            ) : (
              entries.map((entry, idx) => (
                <tr key={entry.id || entry.no || idx} className={
                  `text-sm ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition`}
                >
                  <td className="px-4 py-3 font-mono text-blue-900 font-semibold">{entry.drNo}</td>
                  <td className="px-4 py-3 text-blue-700 font-medium">{entry.particulars}</td>
                  <td className="px-4 py-3 text-green-700 font-bold">₹{entry.amount}</td>
                  <td className="px-4 py-3 text-green-700 font-bold">₹{entry.paid}</td>
                  <td className="px-4 py-3 text-red-600 font-bold">₹{entry.balance}</td>
                  <td className="px-4 py-3 text-blue-900">{entry.unit}</td>
                  <td className="px-4 py-3 text-blue-900">{entry.quantity}</td>
                  <td className="px-4 py-3 text-gray-600">{entry.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyReportHistory; 