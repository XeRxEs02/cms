import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleBasedComponent = ({ children, allowedRoles = [], allowedPermissions = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Check role-based access
  const hasRequiredRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => user.roles?.includes(role));

  // Check permission-based access
  const hasRequiredPermission = allowedPermissions.length === 0 ||
    allowedPermissions.some(permission => user.permissions?.[permission]);

  if (!hasRequiredRole && !hasRequiredPermission) {
    return null;
  }

  return <>{children}</>;
};

export default RoleBasedComponent;
