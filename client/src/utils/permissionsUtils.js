import { Navigate } from 'react-router-dom';

export const hasRole = (role, allowedRoles) => allowedRoles.includes(role);

export const ProtectedHomeRoute = ({ role, children }) => {
  if (role === 'accountant') {
    return <Navigate to='/fuel-tank' replace />;
  }
  return children;
};
