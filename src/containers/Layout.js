import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import MobileNav from "../Components/MobileNav";
import pageroutes from "../routes/index";
import Page404 from "../Pages/Page404";

const Layout = () => {
  const location = useLocation();
  const isProjectsPage = location.pathname === "/app/projects";

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-200 to-gray-400">
      {!isProjectsPage && <MobileNav />}
      <div className="flex flex-row min-h-screen">
        {!isProjectsPage && (
          <div className="hidden lg:block w-56 flex-shrink-0">
            <Sidebar />
          </div>
        )}

        <div className={`flex flex-col flex-1 w-full ${isProjectsPage ? 'ml-0' : ''}`}>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              {/* Default route for /app */}
              <Route path="/" element={<Navigate to="/app/projects" replace />} />
              
              {/* Map all defined routes */}
              {pageroutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path.replace('/app/', '')}
                  element={<route.component />}
                />
              ))}

              {/* Catch any unmatched routes */}
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
