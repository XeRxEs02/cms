import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

const ProjectCard = ({ project, onSelect, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      className="relative w-[200px] mt-[60px] mx-auto cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
      style={{
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.2s ease-in-out',
      }}
    >
      <div className="absolute w-[200px] h-[150px]">
        <div
          className="absolute top-[-15px] w-[150px] h-[20px] rounded-t-[5px]"
          style={{ backgroundColor: colorScheme.tab }}
        ></div>
        <div
          className="absolute right-[2px] top-[-6px] w-[150px] h-[10px] rounded-tr-[5px]"
          style={{ backgroundColor: colorScheme.tab }}
        ></div>
      </div>
      <div
        className="relative w-[200px] h-[150px] rounded-[5px]"
        style={{
          background: `linear-gradient(to bottom, ${colorScheme.gradient[0]}, ${colorScheme.gradient[1]})`,
          boxShadow: isHovered
            ? 'inset 0 1px 3px rgba(255,255,255,0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.15)'
            : 'inset 0 1px 3px rgba(255,255,255,0.5), 0 2px 2px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.2s ease-in-out'
        }}
      >
        <div className="absolute inset-0 z-[-1] rounded-[10px]"></div>
        <div className="p-3 pt-5 h-full flex flex-col">
          <div className="block flex-grow">
            <h3 className="font-bold text-sm text-white mb-1">
              {project.name}
            </h3>
            <div className="text-xs text-white/90">
              <p className="mb-1">{project.location}</p>
              <p>Budget: {project.budget}</p>
              <p>Period: {project.startDate} - {project.endDate}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-white/20 mt-auto">
            <div className="text-xs text-white/80 truncate max-w-[60%]">Completion: {project.completion}%</div>
            <div className="flex items-center">
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white">{project.status}</span>
            </div>
          </div>
        </div>

        {/* Hover actions */}
        <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            onClick={handleDeleteClick}
            aria-label="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            aria-label="Edit project"
          >
            <Edit className="h-3.5 w-3.5" />
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
