import React from "react";
import { FaWallet, FaMoneyCheckAlt, FaChartPie, FaHandHoldingUsd } from "react-icons/fa";

const formatCurrency = (value) => {
  if (typeof value === "string") value = parseFloat(value);
  if (isNaN(value)) return "₹0";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

const ProgressBar = ({ percent, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
    <div
      className={`h-2.5 rounded-full ${color}`}
      style={{ width: `${percent}%`, transition: "width 0.5s" }}
    ></div>
  </div>
);

const DashboardBar = ({
  existingBalance,
  paymentsReceived,
  budgetSpent,
  balanceToBePaid,
  totalBudget
}) => {
  // Calculate analytics
  const budgetSpentPercent = totalBudget ? ((budgetSpent / totalBudget) * 100).toFixed(1) : 0;
  const paymentsReceivedPercent = totalBudget ? ((paymentsReceived / totalBudget) * 100).toFixed(1) : 0;
  const balanceToBePaidPercent = totalBudget ? ((balanceToBePaid / totalBudget) * 100).toFixed(1) : 0;
  const existingBalancePercent = totalBudget ? ((existingBalance / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Existing Balance: blue-yellow */}
      <div className="bg-gradient-to-br from-blue-500 to-yellow-300 rounded-xl p-4 shadow-lg border-2 border-white flex flex-col items-center">
        <FaWallet className="text-white text-2xl mb-1 drop-shadow" />
        <div className="text-white text-sm font-medium mb-1">Existing Balance</div>
        <div className="text-white text-lg font-bold drop-shadow">{formatCurrency(existingBalance)}</div>
        <div className="text-white text-xs mt-1">{existingBalancePercent}% of Total Budget</div>
        <ProgressBar percent={existingBalancePercent} color="bg-yellow-400" />
      </div>
      {/* Payments Received: green-red */}
      <div className="bg-gradient-to-br from-green-500 to-red-400 rounded-xl p-4 shadow-lg border-2 border-white flex flex-col items-center">
        <FaHandHoldingUsd className="text-white text-2xl mb-1 drop-shadow" />
        <div className="text-white text-sm font-medium mb-1">Payments Received</div>
        <div className="text-white text-lg font-bold drop-shadow">{formatCurrency(paymentsReceived)}</div>
        <div className="text-white text-xs mt-1">{paymentsReceivedPercent}% of Total Budget</div>
        <ProgressBar percent={paymentsReceivedPercent} color="bg-red-400" />
      </div>
      {/* Budget Spent: yellow-purple */}
      <div className="bg-gradient-to-br from-yellow-300 to-purple-500 rounded-xl p-4 shadow-lg border-2 border-white flex flex-col items-center">
        <FaChartPie className="text-white text-2xl mb-1 drop-shadow" />
        <div className="text-white text-sm font-medium mb-1">Budget Spent</div>
        <div className="text-white text-lg font-bold drop-shadow">{formatCurrency(budgetSpent)}</div>
        <div className="text-white text-xs mt-1">{budgetSpentPercent}% of Total Budget</div>
        <ProgressBar percent={budgetSpentPercent} color="bg-purple-400" />
      </div>
      {/* Balance To Be Paid: red-white */}
      <div className="bg-gradient-to-br from-red-500 to-white rounded-xl p-4 shadow-lg border-2 border-white flex flex-col items-center">
        <FaMoneyCheckAlt className="text-white text-2xl mb-1 drop-shadow" />
        <div className="text-white text-sm font-medium mb-1">Balance To Be Paid</div>
        <div className="text-white text-lg font-bold drop-shadow">{formatCurrency(balanceToBePaid)}</div>
        <div className="text-white text-xs mt-1">{balanceToBePaidPercent}% of Total Budget</div>
        <ProgressBar percent={balanceToBePaidPercent} color="bg-white" />
      </div>
    </div>
  );
};

export default DashboardBar; 