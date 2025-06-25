import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { useToast } from "../context/ToastContext";
import ProjectCard from "../Components/ProjectCard";
import EditProjectModal from "../Components/EditProjectModal";
import AddProjectModal from "../Components/AddProjectModal";
import AddClientModal from '../Pages/Indent'; // or the correct path if AddClientModal is exported separately
import AddUserModal from '../Components/AddUserModal';
import { ClientProvider, useClientContext } from '../context/ClientContext';

// Mock project data - in a real application, this would come from an API
const projectsData = [
  {
    id: 1,
    name: "Residential Complex - Phase 1",
    status: "Active",
    completion: 45,
    budget: "₹ 2.5 Cr",
    startDate: "15 Jan 2023",
    endDate: "30 Dec 2023",
    color: "#4CAF50"
  },
  {
    id: 2,
    name: "Commercial Tower",
    status: "Active",
    completion: 30,
    budget: "₹ 5.8 Cr",
    startDate: "10 Mar 2023",
    endDate: "15 Apr 2024",
    color: "#2196F3"
  },
  {
    id: 3,
    name: "Highway Extension",
    status: "Active",
    completion: 10,
    budget: "₹ 12.2 Cr",
    startDate: "05 May 2023",
    endDate: "20 Jun 2024",
    color: "#FFC107"
  },
  {
    id: 4,
    name: "Hospital Building",
    status: "Completed",
    completion: 100,
    budget: "₹ 3.7 Cr",
    startDate: "12 Dec 2022",
    endDate: "25 Nov 2023",
    color: "#9C27B0"
  },
  {
    id: 5,
    name: "Shopping Mall",
    status: "Active",
    completion: 60,
    budget: "₹ 8.1 Cr",
    startDate: "08 Feb 2023",
    endDate: "30 Mar 2024",
    color: "#FF5722"
  },
  {
    id: 6,
    name: "IT Park",
    status: "Active",
    completion: 5,
    budget: "₹ 15.5 Cr",
    startDate: "20 Jun 2023",
    endDate: "15 Aug 2024",
    color: "#607D8B"
  }
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { selectProject, selectedProject } = useProject();
  const { showSuccess, showError, showInfo } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState(projectsData);
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [statusFilter, setStatusFilter] = useState("All");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { addOrUpdateClient } = useClientContext();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Filter projects based on search term and status
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, projects]);

  // Handle project selection
  const handleProjectSelect = (project) => {
    // Store selected project using context
    selectProject(project);
    // Navigate to project-specific dashboard
    navigate(`/app/project/${project.id}/dashboard`);
  };

  // Handle project edit
  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setEditModalOpen(true);
  };

  // Handle project save
  const handleProjectSave = (updatedProject) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    showSuccess(`Project "${updatedProject.name}" updated successfully!`);
  };

  // Handle project delete
  const handleProjectDelete = (projectId) => {
    const deletedProject = projects.find(project => project.id === projectId);
    setProjects(prevProjects =>
      prevProjects.filter(project => project.id !== projectId)
    );
    showSuccess(`Project "${deletedProject?.name || 'Unknown'}" deleted successfully!`);
  };

  // Handle add project
  const handleAddProject = () => {
    setAddModalOpen(true);
  };

  // Handle project add save
  const handleProjectAdd = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
    showSuccess(`Project "${newProject.name}" created successfully!`);
  };

  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Clear authentication state
    navigate("/login"); // Navigate to login page
  };

  const handleAddClient = (client) => {
    setClientList((prev) => [...prev, client]);
  };

  const handleAddUser = (userData) => {
    if (userData.authorisation === 'Client') {
      if (!userData.projects || userData.projects.length === 0) {
        showError('Please select at least one project for the client user.');
        return;
      }
      const newClient = {
        clientName: userData.user,
        projectNo: '',
        labourContractor: '',
        address: '',
        totalBudget: '',
        projects: userData.projects
      };
      addOrUpdateClient(newClient);
      setTimeout(() => {
        console.log('DEBUG: newClient.projects:', newClient.projects);
      }, 500);
    }
    showSuccess('User added successfully!');
  };

  return (
    <>
      {/* Navbar Section */}
      <div className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate pr-4">
              {getGreeting()} {user?.name || 'User'}!
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-xs sm:text-sm font-medium min-w-0 flex-shrink-0"
                aria-label="Add User"
              >
                Add User
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-xs sm:text-sm font-medium min-w-0 flex-shrink-0"
                aria-label="Logout"
              >
                <span className="hidden xs:inline sm:inline">Logout</span>
                <span className="xs:hidden sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 lg:mb-0">
              Construction Projects
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  className="border border-gray-300 rounded-full pl-10 pr-4 py-2.5 w-full sm:w-64 lg:w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] focus:border-transparent"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              {/* Status Filter */}
              <select
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] focus:border-transparent min-w-0 flex-1 sm:flex-initial"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Projects</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Add Project Button */}
              <button
                onClick={handleAddProject}
                className="flex items-center justify-center gap-2 bg-[#7BAFD4] hover:bg-[#5A8CAB] text-white px-3 sm:px-4 py-2.5 rounded-lg transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                aria-label="Add new project"
              >
                <Plus size={16} />
                <span className="hidden xs:inline">Add Project</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-0">
            {filteredProjects.map((project) => (
              <div key={project.id} className="flex justify-center w-full max-w-[280px] sm:max-w-[250px] py-2">
                <ProjectCard
                  project={project}
                  onSelect={handleProjectSelect}
                  onDelete={(id) => {
                    handleProjectDelete(id);
                    setDeletingProjectId(null);
                  }}
                  onEdit={(proj) => {
                    handleProjectEdit(proj);
                    setDeletingProjectId(null);
                  }}
                  deletingProjectId={deletingProjectId}
                  setDeletingProjectId={setDeletingProjectId}
                />
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-10 sm:py-16">
              <p className="text-gray-600 text-sm sm:text-base px-4">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleProjectSave}
        project={editingProject}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleProjectAdd}
      />

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAdd={handleAddClient}
        existingClients={clientList.map(c => c.clientName)}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUser}
        projects={projects}
      />
    </>
  );
};

export default ProjectsPage;
