import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { ChartColumnBig, ClipboardList, ArrowDownUp } from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  return (
    <>
      <Navbar currentPath={location.pathname} icon={ChartColumnBig} />
    </>
  );
};

export default Dashboard;
