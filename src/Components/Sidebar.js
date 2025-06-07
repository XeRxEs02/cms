import React from "react";
import { Home, ClipboardList, FileText, List, LogOut } from "lucide-react";
import logo1 from "../Images/logo1.png";
import sidebarroutes from "../routes/sidebar";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import elvalogo from "../Images/elva-logo-1.png";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { logout, user } = useAuth();
  const { selectedProject } = useProject();

  // Log the current path for debugging
  console.log('Current path:', location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get the current project ID from URL or selected project
  const getCurrentProjectId = () => {
    if (projectId) return projectId;
    if (selectedProject) return selectedProject.id.toString();
    return null;
  };

  // Generate project-specific route path
  const getProjectRoute = (basePath) => {
    const currentProjectId = getCurrentProjectId();
    if (currentProjectId) {
      return `/app/project/${currentProjectId}${basePath.replace('/app', '')}`;
    }
    return basePath;
  };

  // Check if the current path matches the route path
  const isActive = (routePath) => {
    const projectSpecificPath = getProjectRoute(routePath);

    // Check both the original path and project-specific path
    return location.pathname === routePath ||
           location.pathname === projectSpecificPath ||
           location.pathname.startsWith(routePath + '/') ||
           location.pathname.startsWith(projectSpecificPath + '/');
  };

  // Handle navigation with project-specific routes
  const handleNavigation = (routePath) => {
    const targetPath = getProjectRoute(routePath);
    navigate(targetPath);
  };

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
                className={`flex items-center gap-2 p-2 rounded cursor-pointer text-md transition
                  ${isActive(route.path)
                    ? 'bg-white text-[#669BBC] font-semibold'
                    : 'text-black hover:bg-white hover:text-[#669BBC]'
                  }`}
                onClick={() => handleNavigation(route.path)}
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
            {user && user.name ? user.name.charAt(0) : 'A'}
          </div>
          <p className="text-lg font-semibold text-black">{user && user.name ? user.name : 'Abhishek U'}</p>
        </div>
        <div
          className="bg-red-600 w-full text-center py-2 rounded cursor-pointer hover:bg-red-700 text-lg flex items-center justify-center text-white"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          LOGOUT
        </div>
      </div>
    </aside>
  );
}
