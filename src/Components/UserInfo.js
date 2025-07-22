import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserInfo = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">User Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-medium">{user.name || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Username</p>
          <p className="font-medium">{user.username || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium">{user.email || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">User ID</p>
          <p className="font-medium">{user.id || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Roles</p>
        <div className="flex flex-wrap gap-2">
          {user.roles?.map((role, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      {user.permissions && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Permissions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${user.permissions.isClient ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              Client Access: {user.permissions.isClient ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${user.permissions.isUser ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              User Access: {user.permissions.isUser ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${user.permissions.isAdmin ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              Admin Access: {user.permissions.isAdmin ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${user.permissions.canViewProjects ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              View Projects: {user.permissions.canViewProjects ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${user.permissions.canCreateProjects ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              Create Projects: {user.permissions.canCreateProjects ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${user.permissions.canManageUsers ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              Manage Users: {user.permissions.canManageUsers ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
