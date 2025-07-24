import React from "react";
import Navbar from "../Components/Navbar";
import { ChartColumnBig, Wallet, CircleDollarSign, BarChart3, AlertCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <>
      <Navbar currentPath="/app/dashboard" icon={ChartColumnBig} />
      <div className="pl-0 pr-4 pt-2 pb-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Project Dashboard (Static Demo)</h2>
          <p className="text-gray-600 mb-2">Location: Bangalore</p>
          <div className="flex items-center mt-2 mb-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
            <span className="ml-3 text-sm text-gray-600">Budget: ₹ 2.5 Cr</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Project Progress</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#7BAFD4] h-2 rounded-full transition-all duration-300" style={{ width: `45%` }}></div>
            </div>
          </div>
        </div>
        {/* Top row of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold">5</div>
                <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Total Installments</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <Wallet size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold">₹12,00,000 / ₹25,00,000</div>
                <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">Payments Done</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <CircleDollarSign size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold text-red-500">48%</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[100px] sm:max-w-[120px]">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `48%` }}></div>
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-medium">Payments Done %</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <BarChart3 size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-[#7BAFD4] rounded-md p-4 shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-[#7BAFD4]"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="mt-8 ml-2">
                <div className="text-lg sm:text-xl font-bold text-red-500">₹13,00,000</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2 max-w-[100px] sm:max-w-[120px]">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `52%` }}></div>
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-medium">Expected Payments</div>
              </div>
              <div className="bg-white p-2 rounded-md mt-6 mr-2">
                <AlertCircle size={20} className="sm:w-6 sm:h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
        {/* Middle row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="text-white text-sm sm:text-base font-medium mb-4">Existing Balance : ₹13,00,000</div>
            <div className="flex justify-center my-3">
              <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
                <circle className="stroke-white fill-none opacity-30" cx="50" cy="50" r="40" strokeWidth="10" />
                <circle className="fill-none stroke-red-500" cx="50" cy="50" r="40" strokeWidth="10" strokeDasharray={251.2} strokeDashoffset={130} strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
            </div>
            <div className="mt-2 text-xs sm:text-sm">
              <div className="flex items-center text-white">
                <span>Budget Spent : ₹12,00,000</span>
              </div>
              <div className="flex items-center text-white mt-1">
                <span>PaymentsReceived: ₹12,00,000</span>
              </div>
            </div>
          </div>
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="text-white text-xs sm:text-sm mb-2">Budget Spent</div>
            <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">₹12,00,000 / ₹25,00,000</div>
            <div className="flex justify-center my-2">
              <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
                <circle className="stroke-white fill-none opacity-30" cx="50" cy="50" r="40" strokeWidth="10" />
                <circle className="fill-none stroke-red-500" cx="50" cy="50" r="40" strokeWidth="10" strokeDasharray={251.2} strokeDashoffset={130} strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
            </div>
          </div>
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="text-white text-xs sm:text-sm mb-2">Balance To Be Paid</div>
            <div className="text-red-500 text-base sm:text-lg md:text-xl font-bold">₹13,00,000 / ₹25,00,000</div>
            <div className="flex justify-center my-2">
              <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
                <circle className="stroke-white fill-none opacity-30" cx="50" cy="50" r="40" strokeWidth="10" />
                <circle className="fill-none stroke-red-500" cx="50" cy="50" r="40" strokeWidth="10" strokeDasharray={251.2} strokeDashoffset={130} strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
            </div>
          </div>
        </div>
        {/* Bottom row - Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-white text-xs sm:text-sm">Payments Received</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span className="text-white text-xs sm:text-sm">Payments Made</span>
              </div>
            </div>
            <div className="flex h-40 items-end justify-between space-x-1 px-2 overflow-x-auto">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                <div key={month} className="flex flex-col items-center flex-shrink-0">
                  <div className="flex space-x-1">
                    <div className="w-3 md:w-4 bg-red-500 rounded-t-sm" style={{ height: `${30 + (idx % 5) * 10}%`, minHeight: '8px' }}></div>
                    <div className="w-3 md:w-4 bg-red-400 rounded-t-sm" style={{ height: `${20 + (idx % 3) * 10}%`, minHeight: '8px' }}></div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-white mt-1 font-medium">{month}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#7BAFD4] rounded-md p-4 shadow-md border-2 border-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div className="text-white text-sm font-medium">Statistics</div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span className="text-white text-xs sm:text-sm">Payments Made</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-white text-xs sm:text-sm">Expected Payments</span>
                </div>
              </div>
            </div>
            <div className="relative h-40 mt-2 w-full overflow-x-auto">
              <div className="min-w-full">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2].map((_, index) => (
                    <div key={index} className="border-t border-dashed border-white/30 w-full h-0"></div>
                  ))}
                </div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="xMidYMid meet">
                  <polyline points="0,120 50,100 100,80 150,60 200,80 250,100 300,120 350,140 400,120 450,100 500,80" fill="none" stroke="#F87171" strokeWidth="2" />
                  <polyline points="0,140 50,120 100,100 150,80 200,100 250,120 300,140 350,120 400,100 450,80 500,60" fill="none" stroke="#EF4444" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
