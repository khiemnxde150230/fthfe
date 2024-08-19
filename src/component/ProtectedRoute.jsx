import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { token, user } = useContext(UserContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.roleId)) {
    return <Navigate to="/403" replace />;
  }

  return element;
};

export default ProtectedRoute;
