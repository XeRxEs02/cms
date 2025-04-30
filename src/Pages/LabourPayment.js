import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { HandCoins } from "lucide-react";

const LabourPayment = () => {
  const location = useLocation();
  const cardData = [
    {
      count: 183,
      label: "Overdue Invoices",
      icon: "fas fa-chart-bar",
      color: "bg-[#f76c5e]",
      buttonLabel: "View Invoices",
    },
    {
      count: 233,
      label: "Incomplete Jobs",
      icon: "far fa-file-alt",
      color: "bg-[#00b0f0]",
      buttonLabel: "View Jobs",
    },
    {
      count: 97,
      label: "Open Tickets",
      icon: "fas fa-tag",
      color: "bg-[#2ca64a]",
      buttonLabel: "View Tickets",
    },
  ];
  return (
    <>
      <Navbar currentPath={location.pathname} icon={HandCoins} />
      <div className="p-4 min-h-screen">
        <div className="max-w-full overflow-x-auto">
          <div className="flex gap-4 w-max">
            {cardData.map((card, index) => (
              <div
                key={index}
                className={`${card.color} min-w-[250px] sm:min-w-[200px] h-36 sm:h-28 rounded-md p-4 flex flex-col justify-between text-white shadow-md`}
              >
                <div>
                  <p className="text-3xl sm:text-2xl font-bold leading-none">
                    {card.count}
                  </p>
                  <p className="text-sm font-semibold opacity-80 mt-1">
                    {card.label}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <i
                    className={`${card.icon} opacity-50 text-lg sm:text-base`}
                  ></i>
                  <button className="text-xs sm:text-[10px] font-semibold opacity-80 flex items-center gap-1 hover:underline">
                    {card.buttonLabel}{" "}
                    <i className="fas fa-arrow-circle-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LabourPayment;
