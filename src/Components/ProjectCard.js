import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { useAuth } from "../context/AuthContext";

const ProjectCard = ({ project, onSelect, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();

  // Define an array of color schemes for the folders
  const colorSchemes = [
    { tab: '#5CA4F1', gradient: ['#72BAFB', '#347EE1'] }, // Blue (default)
    { tab: '#F1A05C', gradient: ['#FBBA72', '#E17E34'] }, // Orange
    { tab: '#5CF17E', gradient: ['#72FB9A', '#34E17E'] }, // Green
    { tab: '#F15C5C', gradient: ['#FB7272', '#E13434'] }, // Red
    { tab: '#C45CF1', gradient: ['#D672FB', '#9A34E1'] }, // Purple
    { tab: '#F1D45C', gradient: ['#FBE672', '#E1B434'] }  // Yellow
  ];

  // Determine color scheme based on project ID
  const projectIdNum = parseInt(project.id) || 0;
  const colorIndex = projectIdNum % colorSchemes.length;
  const colorScheme = colorSchemes[colorIndex];

  const handleDelete = () => {
    // Call the onDelete prop if it exists
    if (typeof onDelete === 'function') {
      onDelete(project.id);
    } else {
      console.log("Deleting project:", project.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    // Call the onEdit prop if it exists
    if (typeof onEdit === 'function') {
      onEdit(project);
    } else {
      console.log("Editing project:", project.id);
    }
  };

  const handleSelect = () => {
    if (typeof onSelect === 'function') {
      onSelect(project);
    }
  };

  return (
    <div
      className="relative w-[180px] sm:w-[200px] mt-[50px] sm:mt-[60px] cursor-pointer flex-shrink-0 touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
      style={{
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.2s ease-in-out',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      aria-label={`Open project ${project.name}`}
    >
      <div className="absolute w-[180px] sm:w-[200px] h-[135px] sm:h-[150px]">
        <div
          className="absolute top-[-12px] sm:top-[-15px] w-[135px] sm:w-[150px] h-[16px] sm:h-[20px] rounded-t-[5px]"
          style={{
            backgroundColor: colorScheme.tab,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
          }}
        ></div>
        <div
          className="absolute right-[2px] top-[-5px] sm:top-[-6px] w-[135px] sm:w-[150px] h-[8px] sm:h-[10px] rounded-tr-[5px]"
          style={{
            backgroundColor: colorScheme.tab,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        ></div>
      </div>
      <div
        className="relative w-[180px] sm:w-[200px] h-[135px] sm:h-[150px] rounded-[5px]"
        style={{
          background: `linear-gradient(to bottom, ${colorScheme.gradient[0]}, ${colorScheme.gradient[1]})`,
          boxShadow: isHovered
            ? 'inset 0 1px 3px rgba(255,255,255,0.5), 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            : 'inset 0 1px 3px rgba(255,255,255,0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
          transition: 'box-shadow 0.2s ease-in-out'
        }}
      >
        <div className="absolute inset-0 z-[-1] rounded-[10px]"></div>
        <div className="p-2 sm:p-3 pt-4 sm:pt-5 h-full flex flex-col overflow-hidden">
          <div className="block flex-grow overflow-hidden">
            <h3 className="font-bold text-xs sm:text-sm text-white mb-1 truncate leading-tight">
              {project.name}
            </h3>
            <div className="text-[10px] sm:text-xs text-white/90 space-y-0.5 sm:space-y-1">
              <p className="truncate">{project.location}</p>
              <p className="truncate">Budget: {project.budget}</p>
              <p className="truncate text-[9px] sm:text-[10px] leading-tight">Period: {project.startDate} - {project.endDate}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-white/20 mt-auto">
            <div className="text-xs text-white/80 truncate flex-1 mr-2">Owner: {user?.name || 'Abhishek U'}</div>
            <div className="flex items-center flex-shrink-0">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white truncate max-w-[60px]">{project.status}</span>
            </div>
          </div>
        </div>

        {/* Hover actions - Always visible on mobile for better touch interaction */}
        <div className={`absolute top-1 sm:top-2 right-1 sm:right-2 flex space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0'}`}>
          <button
            className="p-1.5 sm:p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors touch-manipulation min-h-[32px] sm:min-h-auto"
            onClick={handleDeleteClick}
            aria-label={`Delete project ${project.name}`}
            title="Delete project"
          >
            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1.5 sm:p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors touch-manipulation min-h-[32px] sm:min-h-auto"
            aria-label={`Edit project ${project.name}`}
            title="Edit project"
          >
            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Are you sure?"
        description={`This will permanently delete the project "${project.name}" and all its contents. This action cannot be undone.`}
      />
    </div>
  );
};

export default ProjectCard;
