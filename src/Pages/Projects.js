import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import ProjectCard from "../Components/ProjectCard";

// Mock project data - in a real application, this would come from an API
const projectsData = [
  {
    id: 1,
    name: "Residential Complex - Phase 1",
    location: "Bangalore",
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
    location: "Mumbai",
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
    location: "Delhi",
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
    location: "Chennai",
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
    location: "Hyderabad",
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
    location: "Pune",
    status: "Active",
    completion: 5,
    budget: "₹ 15.5 Cr",
    startDate: "20 Jun 2023",
    endDate: "15 Aug 2024",
    color: "#607D8B"
  }
];

const Projects = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectProject } = useProject();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [statusFilter, setStatusFilter] = useState("All");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Filter projects based on search term and status
  useEffect(() => {
    let filtered = projectsData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter]);

  // Handle project selection
  const handleProjectSelect = (project) => {
    // Store selected project using context
    selectProject(project);
    // Navigate to dashboard
    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Construction Projects
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                className="border rounded-full pl-10 pr-4 py-2 w-full md:w-64"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Status Filter */}
            <select
              className="border rounded-lg px-4 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Projects</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Add Project Button */}
            <button className="flex items-center justify-center gap-2 bg-[#7BAFD4] hover:bg-[#5A8CAB] text-white px-4 py-2 rounded-lg transition-colors">
              <Plus size={18} />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={handleProjectSelect}
              onDelete={(id) => console.log("Delete project:", id)}
              onEdit={(project) => console.log("Edit project:", project.name)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
