import React, { useState, useEffect } from 'react';

const AddUserModal = ({ isOpen, onClose, onAdd, projects = [] }) => {
  const [formData, setFormData] = useState({
    user: '',
    authorisation: '',
    projects: [],
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Auto-fill username and password when all other fields are filled
  useEffect(() => {
    if (
      formData.user.trim() &&
      formData.authorisation &&
      formData.projects &&
      formData.projects.length > 0 &&
      !formData.username &&
      !formData.password
    ) {
      setFormData((prev) => ({
        ...prev,
        username: 'saielva',
        password: 'Tarun@2002',
      }));
    }
  }, [formData.user, formData.authorisation, formData.projects]);

  const validate = () => {
    const newErrors = {};
    if (!formData.user.trim()) newErrors.user = 'Enter User';
    if (!formData.authorisation) newErrors.authorisation = 'Select Authorisation';
    if (!formData.projects || formData.projects.length === 0) newErrors.projects = 'Select projects from Dropdown';
    if (!formData.username.trim()) newErrors.username = 'Enter Username';
    if (!formData.password.trim()) newErrors.password = 'Enter Password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAdd(formData);
      // Store supervisor-project mapping in localStorage
      if (formData.authorisation === 'Supervisor') {
        let supervisorProjects = {};
        try {
          supervisorProjects = JSON.parse(localStorage.getItem('supervisorProjects')) || {};
        } catch (e) { supervisorProjects = {}; }
        formData.projects.forEach(projectName => {
          supervisorProjects[projectName] = formData.user;
        });
        localStorage.setItem('supervisorProjects', JSON.stringify(supervisorProjects));
      }
      setFormData({ user: '', authorisation: '', projects: [], username: '', password: '' });
      setErrors({});
      onClose();
    }
  };

  const allProjectNames = projects.map((proj) => proj.name);
  const isAllSelected = formData.projects.length === allProjectNames.length;

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="user"
              value={formData.user}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.user ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.user || 'Enter User'}
            />
          </div>
          <div>
            <select
              name="authorisation"
              value={formData.authorisation}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.authorisation ? 'border-red-400 bg-red-50 text-red-400' : ''}`}
            >
              <option value="" disabled>{errors.authorisation || 'Select Authorisation'}</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Client">Client</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 border mb-2"
              onClick={() => setShowProjectsDropdown((prev) => !prev)}
            >
              {showProjectsDropdown ? 'Hide Projects' : 'Select Projects'}
            </button>
            {showProjectsDropdown && (
              <div className="border rounded p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="all-projects"
                    checked={isAllSelected}
                    onChange={e => {
                      setFormData({
                        ...formData,
                        projects: e.target.checked ? allProjectNames : []
                      });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="all-projects" className="text-sm text-gray-700 select-none">All Projects</label>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {projects.map((proj) => (
                    <div key={proj.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`project-${proj.id}`}
                        checked={formData.projects.includes(proj.name)}
                        onChange={e => {
                          let newSelected;
                          if (e.target.checked) {
                            newSelected = [...formData.projects, proj.name];
                          } else {
                            newSelected = formData.projects.filter(p => p !== proj.name);
                          }
                          setFormData({ ...formData, projects: newSelected });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`project-${proj.id}`} className="text-sm text-gray-700 select-none">{proj.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <input
              name="username"
              value={formData.username}
              readOnly
              className={`w-full border p-2 rounded bg-gray-100 ${errors.username ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.username || 'Enter Username'}
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              value={formData.password}
              readOnly
              className={`w-full border p-2 rounded bg-gray-100 ${errors.password ? 'border-red-400 bg-red-50 placeholder-red-400' : ''}`}
              placeholder={errors.password || 'Enter Password'}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 