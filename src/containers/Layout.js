import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import MobileNav from "../Components/MobileNav";
import pageroutes from "../routes/index";
import Login from "../Pages/Login";
import Page404 from "../Pages/Page404";
const Layout = ({ children }) => {
  const location = useLocation();
  const isProjectsPage = location.pathname === "/app/projects";

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 overflow-hidden">
      {!isProjectsPage && <MobileNav />}
      <div className="flex flex-row h-screen">
        {!isProjectsPage && (
          <div className="hidden lg:block w-56 flex-shrink-0">
            <Sidebar />
          </div>
        )}

        <div className={`flex flex-col flex-1 w-full overflow-hidden ${isProjectsPage ? 'ml-0' : ''}`}>
          <div className="flex-1 overflow-y-auto">
            <Routes>
              {pageroutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
              <Route path="/app" element={<Navigate to="/app/projects" />} />
              <Route path="*" element={<Page404 />} />
              {/* <Route path="/login" element={<Login />} /> */}
            </Routes>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
