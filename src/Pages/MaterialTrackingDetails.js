import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CircularProgress = ({ value, total, color }) => {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = total > 0 ? value / total : 0;
  const strokeDashoffset = circumference - percent * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} style={{ display: 'block', margin: '0 auto' }}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1.1em"
        fill={color}
        fontWeight="bold"
      >
        {value}/{total}
      </text>
    </svg>
  );
};

const MaterialTrackingDetails = () => {
  const { particularName } = useParams();
  const navigate = useNavigate();
  const { appData } = useAppContext();

  // Get all transactions for this particular
  const txns = appData.dailyReport.entries.filter(
    en => en.particulars.toLowerCase() === particularName.toLowerCase()
  );

  // Compute analytics
  let totalReceived = 0, totalConsumed = 0, unit = '-';
  txns.forEach(txn => {
    if (txn.received) totalReceived += Number(txn.received);
    if (txn.consumed) totalConsumed += Number(txn.consumed);
  });
  if (txns.length > 0 && txns[0].unit) unit = txns[0].unit;
  const totalEstimated = 100; // TODO: Replace with actual estimate if available
  const remaining = totalReceived - totalConsumed;

  // In the analytics cards section, use safe values:
  const safeConsumed = Math.min(totalConsumed, totalEstimated);
  const safeReceived = Math.min(totalReceived, totalEstimated);
  const safeRemaining = Math.max(Math.min(remaining, totalEstimated), 0);
  const percentConsumed = totalEstimated > 0 ? Math.round((safeConsumed / totalEstimated) * 100) : 0;
  const percentReceived = totalEstimated > 0 ? Math.round((safeReceived / totalEstimated) * 100) : 0;
  const percentRemaining = totalEstimated > 0 ? Math.round((safeRemaining / totalEstimated) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 min-h-screen max-w-7xl mx-auto w-full">
      <button onClick={() => navigate(-1)} className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&larr; Back</button>
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Material Tracking List &gt; {particularName}</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">NO.</th>
                <th className="px-4 py-3">DR No</th>
                <th className="px-4 py-3">Particulars</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Consumed</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((txn, idx) => (
                <tr key={(txn.drNo || "-") + idx}>
                  <td className="px-4 py-2">{String(idx+1).padStart(2, '0')}</td>
                  <td className="px-4 py-2">{txn.drNo || '-'}</td>
                  <td className="px-4 py-2 text-red-600 font-bold">{txn.particulars || '-'}</td>
                  <td className="px-4 py-2">{txn.date || '-'}</td>
                  <td className="px-4 py-2">{txn.amount !== undefined ? txn.amount : '-'}</td>
                  <td className="px-4 py-2">{txn.paid !== undefined ? txn.paid : '-'}</td>
                  <td className="px-4 py-2">{txn.balance !== undefined ? txn.balance : '-'}</td>
                  <td className="px-4 py-2">{txn.received !== undefined ? `${txn.received} ${txn.unit || unit}` : '-'}</td>
                  <td className="px-4 py-2">{txn.consumed !== undefined ? `${txn.consumed} ${txn.unit || unit}` : '-'}</td>
                  <td className="px-4 py-2">{txn.remarks || '-'}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2" colSpan={4}>Total</td>
                <td className="px-4 py-2">{txns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)}</td>
                <td className="px-4 py-2">{txns.reduce((sum, t) => sum + (Number(t.paid) || 0), 0)}</td>
                <td className="px-4 py-2">{txns.reduce((sum, t) => sum + (Number(t.balance) || 0), 0)}</td>
                <td className="px-4 py-2">{totalReceived} {unit}</td>
                <td className="px-4 py-2">{totalConsumed} {unit}</td>
                <td className="px-4 py-2">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialTrackingDetails; 