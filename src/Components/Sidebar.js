import React from "react";
import { Home, ClipboardList, FileText, List } from "lucide-react";
import logo1 from "../Images/logo1.png";
import sidebarroutes from "../routes/sidebar";
import { useNavigate } from "react-router-dom";
import elvalogo from "../Images/elva-logo-1.png";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside
      className="fixed lg:relative top-[14px] left-[16px] w-[201px] bg-[#669BBC] rounded-[6px] shadow-md text-white flex flex-col justify-between p-4 transition-transform translate-x-0 overflow-y-auto"
      style={{ height: "calc(100vh - 2rem)" }}
    >
      <div className="flex items-center justify-center">
        <img
          src={logo1}
          alt="S B Patil Group Logo"
          className="top-[14px] left-[16px] w-[171px] h-[65px] max-w-full"
        />
      </div>
      <nav className="flex-1 overflow-y-auto mt-4">
        <ul>
          {sidebarroutes.map((route, index) => (
            <li key={index} className="flex flex-col">
              <div
                className="flex items-center gap-2 p-2 rounded cursor-pointer text-md text-black hover:bg-white hover:text-[#669BBC] transition"
                onClick={() => navigate(route.path)}
              >
                {route.icon} {route.name}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-4 items-center mt-auto">
        <div className="flex items-center gap-4 w-full">
          <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full ">
            A
          </div>
          <p className="text-lg font-semibold text-black">Abhishek U</p>
        </div>
        <div className="bg-red-600 w-full text-center py-2 rounded cursor-pointer hover:bg-red-700 text-lg">
          LOGOUT
        </div>
      </div>
    </aside>
  );
}
